// ============================================================================
// Issue Service — Core Book Issue/Return Business Logic
// ============================================================================

import { IssueRepository } from '@/repositories/issue.repository';
import { BookRepository } from '@/repositories/book.repository';
import { UserRepository } from '@/repositories/user.repository';
import { FineRepository } from '@/repositories/fine.repository';
import { ActivityLogRepository } from '@/repositories/activity-log.repository';
import { NotificationRepository } from '@/repositories/notification.repository';
import { SettingsRepository } from '@/repositories/settings.repository';
import { NotFoundError, AppError } from '@/lib/errors';
import {
  DEFAULT_FINE_PER_DAY,
  DEFAULT_LOAN_DAYS,
  MAX_BOOKS_PER_USER,
  SETTINGS_KEYS,
} from '@/lib/constants';
import { addDays, differenceInDays } from 'date-fns';
import type { IssueFilters } from '@/types';

export class IssueService {
  /**
   * Get all issues with filters and pagination
   */
  static async getAll(filters: IssueFilters) {
    return IssueRepository.findAll(filters);
  }

  /**
   * Get issue by ID
   */
  static async getById(id: string) {
    const issue = await IssueRepository.findById(id);
    if (!issue) {
      throw new NotFoundError('Issue');
    }
    return issue;
  }

  /**
   * Issue a book to a user
   *
   * Business rules:
   * 1. Book must exist and have available copies
   * 2. User must exist
   * 3. User must not exceed max books limit
   * 4. User must not have overdue books
   * 5. Due date is calculated from system settings
   */
  static async issueBook(userId: string, bookId: string, actorId: string) {
    // 1. Check book exists and is available
    const book = await BookRepository.findById(bookId);
    if (!book) {
      throw new NotFoundError('Book');
    }
    if (book.availableQuantity <= 0) {
      throw new AppError(
        `"${book.title}" is currently not available. All copies are issued.`,
        400
      );
    }

    // 2. Check user exists
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    // 3. Check max books limit
    const maxBooks = await SettingsRepository.getNumericValue(
      SETTINGS_KEYS.MAX_BOOKS_PER_USER,
      MAX_BOOKS_PER_USER
    );
    const activeCount = await IssueRepository.countActiveByUser(userId);
    if (activeCount >= maxBooks) {
      throw new AppError(
        `User has already borrowed ${activeCount} book(s). Maximum allowed: ${maxBooks}`,
        400
      );
    }

    // 4. Check for overdue books
    const hasOverdue = await IssueRepository.hasOverdueBooks(userId);
    if (hasOverdue) {
      throw new AppError(
        'User has overdue books. Please return or settle overdue books before issuing new ones.',
        400
      );
    }

    // 5. Calculate due date
    const loanDays = await SettingsRepository.getNumericValue(
      SETTINGS_KEYS.LOAN_DAYS,
      DEFAULT_LOAN_DAYS
    );
    const dueDate = addDays(new Date(), loanDays);

    // 6. Create issue record
    const issue = await IssueRepository.create({
      user: { connect: { id: userId } },
      book: { connect: { id: bookId } },
      dueDate,
      status: 'ISSUED',
    });

    // 7. Decrement available quantity
    await BookRepository.decrementAvailableQuantity(bookId);

    // 8. Send notification to user
    await NotificationRepository.create({
      user: { connect: { id: userId } },
      title: 'Book Issued',
      message: `You have been issued "${book.title}" by ${book.author}. Due date: ${dueDate.toLocaleDateString()}`,
      type: 'SYSTEM',
    });

    // 9. Log activity
    await ActivityLogRepository.create(
      actorId,
      'BOOK_ISSUED',
      `Book issued: "${book.title}" to ${user.name} (${user.email}). Due: ${dueDate.toLocaleDateString()}`
    );

    return issue;
  }

  /**
   * Return a book
   *
   * Business rules:
   * 1. Issue must exist with status ISSUED or OVERDUE
   * 2. Set return date to now
   * 3. Update status to RETURNED
   * 4. Increment available quantity
   * 5. Calculate fine if overdue
   */
  static async returnBook(issueId: string, actorId: string) {
    // 1. Find issue
    const issue = await IssueRepository.findById(issueId);
    if (!issue) {
      throw new NotFoundError('Issue');
    }
    if (issue.status === 'RETURNED') {
      throw new AppError('This book has already been returned', 400);
    }

    const now = new Date();

    // 2. Update issue record
    const updatedIssue = await IssueRepository.update(issueId, {
      returnDate: now,
      status: 'RETURNED',
    });

    // 3. Increment available quantity
    await BookRepository.incrementAvailableQuantity(issue.bookId);

    // 4. Calculate and create fine if overdue
    let fine = null;
    const overdueDays = differenceInDays(now, issue.dueDate);

    if (overdueDays > 0) {
      const finePerDay = await SettingsRepository.getNumericValue(
        SETTINGS_KEYS.FINE_PER_DAY,
        DEFAULT_FINE_PER_DAY
      );
      const fineAmount = overdueDays * finePerDay;

      fine = await FineRepository.create({
        issue: { connect: { id: issueId } },
        user: { connect: { id: issue.userId } },
        amount: fineAmount,
        status: 'UNPAID',
      });

      // Notify user about fine
      await NotificationRepository.create({
        user: { connect: { id: issue.userId } },
        title: 'Overdue Fine Generated',
        message: `A fine of ${fineAmount} has been generated for "${issue.book.title}" (${overdueDays} days overdue at ${finePerDay}/day).`,
        type: 'SYSTEM',
      });
    }

    // 5. Notify user about return
    await NotificationRepository.create({
      user: { connect: { id: issue.userId } },
      title: 'Book Returned',
      message: `"${issue.book.title}" has been returned successfully.${fine ? ` Fine of ${fine.amount} generated.` : ''}`,
      type: 'SYSTEM',
    });

    // 6. Log activity
    await ActivityLogRepository.create(
      actorId,
      'BOOK_RETURNED',
      `Book returned: "${issue.book.title}" by ${issue.user.name}.${fine ? ` Fine: ${fine.amount} (${overdueDays} days overdue)` : ' No fine.'}`
    );

    return { issue: updatedIssue, fine };
  }

  /**
   * Get overdue issues
   */
  static async getOverdue() {
    return IssueRepository.findOverdue();
  }

  /**
   * Get active issues for a user
   */
  static async getActiveByUser(userId: string) {
    return IssueRepository.findActiveByUser(userId);
  }

  /**
   * Mark overdue issues (cron-friendly)
   */
  static async markOverdueIssues() {
    return IssueRepository.markOverdueIssues();
  }
}
