// ============================================================================
// Notification Repository — Data Access Layer
// ============================================================================

import prisma from '@/lib/prisma';
import { Prisma, NotificationType } from '@prisma/client';

export class NotificationRepository {
  /**
   * Find notification by ID
   */
  static async findById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Find notifications by user with pagination
   */
  static async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    isRead?: boolean,
    type?: NotificationType
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.NotificationWhereInput = { userId };

    if (isRead !== undefined) where.isRead = isRead;
    if (type) where.type = type;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  /**
   * Create a notification
   */
  static async create(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  }

  /**
   * Create multiple notifications (broadcast)
   */
  static async createMany(data: Prisma.NotificationCreateManyInput[]) {
    return prisma.notification.createMany({ data });
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Count unread notifications for a user
   */
  static async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Delete old notifications (older than given date)
   */
  static async deleteOlderThan(date: Date) {
    return prisma.notification.deleteMany({
      where: { createdAt: { lt: date } },
    });
  }
}
