// ============================================================================
// Activity Log Service — Business Logic
// ============================================================================

import { ActivityLogRepository } from '@/repositories/activity-log.repository';

export class ActivityLogService {
  /**
   * Get all activity logs with filtering and pagination
   */
  static async getAll(
    page: number = 1,
    limit: number = 20,
    userId?: string,
    action?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    return ActivityLogRepository.findAll(page, limit, userId, action, startDate, endDate);
  }

  /**
   * Create a log entry
   */
  static async log(userId: string, action: string, description: string) {
    return ActivityLogRepository.create(userId, action, description);
  }

  /**
   * Clean up old logs (older than 90 days)
   */
  static async cleanup(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    return ActivityLogRepository.deleteOlderThan(cutoffDate);
  }
}
