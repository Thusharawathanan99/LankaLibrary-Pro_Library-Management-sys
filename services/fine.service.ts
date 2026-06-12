// ============================================================================
// Fine Service — Business Logic
// ============================================================================

import { FineRepository } from '@/repositories/fine.repository';
import { ActivityLogRepository } from '@/repositories/activity-log.repository';
import { NotificationRepository } from '@/repositories/notification.repository';
import { NotFoundError } from '@/lib/errors';
import type { FineFilters } from '@/types';
import type { FineStatus } from '@prisma/client';

export class FineService {
  /**
   * Get all fines with filters and pagination
   */
  static async getAll(filters: FineFilters) {
    return FineRepository.findAll(filters);
  }

  /**
   * Get fine by ID
   */
  static async getById(id: string) {
    const fine = await FineRepository.findById(id);
    if (!fine) {
      throw new NotFoundError('Fine');
    }
    return fine;
  }

  /**
   * Get fines by user
   */
  static async getByUser(userId: string) {
    return FineRepository.findByUser(userId);
  }

  /**
   * Update fine status (pay/unpay)
   */
  static async updateStatus(id: string, status: FineStatus, actorId: string) {
    const fine = await FineRepository.findById(id);
    if (!fine) {
      throw new NotFoundError('Fine');
    }

    const updatedFine = await FineRepository.updateStatus(id, status);

    // Notify user
    if (status === 'PAID') {
      await NotificationRepository.create({
        user: { connect: { id: fine.userId } },
        title: 'Fine Paid',
        message: `Your fine of ${fine.amount} for "${fine.issue.book.title}" has been marked as paid.`,
        type: 'SYSTEM',
      });
    }

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      status === 'PAID' ? 'FINE_PAID' : 'FINE_STATUS_UPDATED',
      `Fine ${status.toLowerCase()}: ${fine.amount} for user ${fine.user.email}`
    );

    return updatedFine;
  }

  /**
   * Get total fine collections within a date range
   */
  static async getTotalCollected(startDate?: Date, endDate?: Date) {
    return FineRepository.getTotalCollected(startDate, endDate);
  }

  /**
   * Get unpaid fines for a user
   */
  static async getUnpaidByUser(userId: string) {
    return FineRepository.getUnpaidByUser(userId);
  }
}
