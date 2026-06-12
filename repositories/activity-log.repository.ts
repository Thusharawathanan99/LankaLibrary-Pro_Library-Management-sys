// ============================================================================
// Activity Log Repository — Data Access Layer
// ============================================================================

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class ActivityLogRepository {
  /**
   * Find all activity logs with pagination
   */
  static async findAll(
    page: number = 1,
    limit: number = 20,
    userId?: string,
    action?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.ActivityLogWhereInput = {};

    if (userId) where.userId = userId;
    if (action) where.action = { contains: action };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activityLog.count({ where }),
    ]);

    return { logs, total };
  }

  /**
   * Create an activity log entry
   */
  static async create(userId: string, action: string, description: string) {
    return prisma.activityLog.create({
      data: {
        user: { connect: { id: userId } },
        action,
        description,
      },
    });
  }

  /**
   * Delete old logs (older than given date)
   */
  static async deleteOlderThan(date: Date) {
    return prisma.activityLog.deleteMany({
      where: { createdAt: { lt: date } },
    });
  }
}
