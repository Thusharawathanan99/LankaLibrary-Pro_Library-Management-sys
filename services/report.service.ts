// ============================================================================
// Report Service — Business Logic
// ============================================================================

import { IssueRepository } from '@/repositories/issue.repository';
import { FineRepository } from '@/repositories/fine.repository';
import { BookRepository } from '@/repositories/book.repository';
import { UserRepository } from '@/repositories/user.repository';
import { SettingsRepository } from '@/repositories/settings.repository';
import { DEFAULT_FINE_PER_DAY, SETTINGS_KEYS } from '@/lib/constants';
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from 'date-fns';

export class ReportService {
  /**
   * Daily report — books issued/returned on a specific date
   */
  static async getDailyReport(date: Date = new Date()) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const issues = await IssueRepository.findByDateRange(start, end);

    const totalIssued = issues.filter((i) => i.status !== 'RETURNED').length;
    const totalReturned = issues.filter(
      (i) => i.returnDate && i.returnDate >= start && i.returnDate <= end
    ).length;

    return {
      date: date.toISOString().split('T')[0],
      totalIssued,
      totalReturned,
      issues: issues.map((issue) => ({
        id: issue.id,
        bookTitle: issue.book.title,
        bookAuthor: issue.book.author,
        userName: issue.user.name,
        userEmail: issue.user.email,
        issueDate: issue.issueDate,
        dueDate: issue.dueDate,
        returnDate: issue.returnDate,
        status: issue.status,
      })),
    };
  }

  /**
   * Monthly report — summary for a given month/year
   */
  static async getMonthlyReport(year: number, month: number) {
    const date = new Date(year, month - 1, 1);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const [totalIssued, totalReturned, totalOverdue, fineCollection] =
      await Promise.all([
        IssueRepository.countByDateRange(start, end),
        IssueRepository.countByDateRange(start, end, 'RETURNED'),
        IssueRepository.countByDateRange(start, end, 'OVERDUE'),
        FineRepository.getTotalCollected(start, end),
      ]);

    return {
      month: date.toLocaleString('default', { month: 'long' }),
      year,
      totalIssued,
      totalReturned,
      totalOverdue,
      finesCollected: fineCollection.totalAmount,
      finesCount: fineCollection.totalCount,
    };
  }

  /**
   * Overdue books report
   */
  static async getOverdueReport() {
    const overdueIssues = await IssueRepository.findOverdue();

    const finePerDay = await SettingsRepository.getNumericValue(
      SETTINGS_KEYS.FINE_PER_DAY,
      DEFAULT_FINE_PER_DAY
    );

    const now = new Date();
    const issues = overdueIssues.map((issue) => {
      const overdueDays = differenceInDays(now, issue.dueDate);
      return {
        id: issue.id,
        bookTitle: issue.book.title,
        bookAuthor: issue.book.author,
        bookIsbn: issue.book.isbn,
        userName: issue.user.name,
        userEmail: issue.user.email,
        issueDate: issue.issueDate,
        dueDate: issue.dueDate,
        overdueDays,
        estimatedFine: overdueDays * finePerDay,
      };
    });

    return {
      totalOverdue: issues.length,
      totalEstimatedFines: issues.reduce((sum, i) => sum + i.estimatedFine, 0),
      finePerDay,
      issues,
    };
  }

  /**
   * Fine collections report
   */
  static async getFineReport(startDate?: Date, endDate?: Date) {
    const collected = await FineRepository.getTotalCollected(startDate, endDate);

    // Get all fines for the period
    const { fines } = await FineRepository.findAll({
      page: 1,
      limit: 1000,
      status: 'PAID',
    });

    return {
      totalCollected: collected.totalAmount,
      totalTransactions: collected.totalCount,
      period: {
        startDate: startDate?.toISOString() || 'All time',
        endDate: endDate?.toISOString() || 'Now',
      },
      recentPayments: fines.slice(0, 20),
    };
  }

  /**
   * Active users report (most active borrowers)
   */
  static async getActiveUsersReport(limit: number = 20) {
    const users = await UserRepository.findAll({
      page: 1,
      limit,
      role: 'USER',
    });

    return {
      totalUsers: users.total,
      users: users.users.map((user) => ({
        userId: user.id,
        name: user.name,
        email: user.email,
        totalIssues: user._count.issues,
        totalFines: user._count.fines,
      })),
    };
  }

  /**
   * Most borrowed books report
   */
  static async getMostBorrowedReport(limit: number = 20) {
    const books = await BookRepository.getMostBorrowed(limit);

    return {
      books: books.map((book) => ({
        bookId: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category: book.category,
        totalIssues: book._count.issues,
        currentlyAvailable: book.availableQuantity,
        totalQuantity: book.quantity,
      })),
    };
  }

  /**
   * Dashboard statistics (combined overview)
   */
  static async getDashboardStats() {
    const [
      totalBooks,
      totalUsers,
      totalStaff,
      totalIssued,
      totalOverdue,
      fineCollection,
    ] = await Promise.all([
      BookRepository.count(),
      UserRepository.countByRole('USER'),
      UserRepository.countByRole('STAFF'),
      IssueRepository.countByStatus('ISSUED'),
      IssueRepository.countByStatus('OVERDUE'),
      FineRepository.getTotalCollected(),
    ]);

    return {
      totalBooks,
      totalUsers,
      totalStaff,
      totalIssued,
      totalOverdue,
      totalFinesCollected: fineCollection.totalAmount,
    };
  }
}
