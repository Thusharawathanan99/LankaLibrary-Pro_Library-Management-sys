// ============================================================================
// Notification Service — Business Logic
// ============================================================================

import { NotificationRepository } from '@/repositories/notification.repository';
import { ActivityLogRepository } from '@/repositories/activity-log.repository';
import { UserRepository } from '@/repositories/user.repository';
import { NotFoundError } from '@/lib/errors';
import type { NotificationType } from '@prisma/client';

export class NotificationService {
  /**
   * Get notifications for a user with pagination
   */
  static async getByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    isRead?: boolean,
    type?: NotificationType
  ) {
    return NotificationRepository.findByUser(userId, page, limit, isRead, type);
  }

  /**
   * Create a notification (admin-sent)
   */
  static async create(
    data: {
      userId: string;
      title: string;
      message: string;
      type?: NotificationType;
    },
    actorId: string
  ) {
    // Verify target user exists
    const user = await UserRepository.findById(data.userId);
    if (!user) {
      throw new NotFoundError('Target user');
    }

    const notification = await NotificationRepository.create({
      user: { connect: { id: data.userId } },
      title: data.title,
      message: data.message,
      type: data.type || 'SYSTEM',
    });

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      'NOTIFICATION_SENT',
      `Notification sent to ${user.email}: "${data.title}"`
    );

    return notification;
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(id: string, userId: string) {
    const notification = await NotificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification');
    }

    // Ensure user owns this notification
    if (notification.userId !== userId) {
      throw new NotFoundError('Notification');
    }

    return NotificationRepository.markAsRead(id);
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    return NotificationRepository.markAllAsRead(userId);
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string) {
    return NotificationRepository.countUnread(userId);
  }

  /**
   * Broadcast notification to all users (admin)
   */
  static async broadcast(
    title: string,
    message: string,
    type: NotificationType = 'SYSTEM',
    actorId: string
  ) {
    // Get all users
    const { users } = await UserRepository.findAll({ page: 1, limit: 10000 });

    const notifications = users.map((user) => ({
      userId: user.id,
      title,
      message,
      type,
      isRead: false,
    }));

    await NotificationRepository.createMany(notifications);

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      'NOTIFICATION_BROADCAST',
      `Broadcast notification to ${users.length} users: "${title}"`
    );

    return { sentTo: users.length };
  }
}
