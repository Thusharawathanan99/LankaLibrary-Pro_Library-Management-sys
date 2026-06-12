// ============================================================================
// /api/notifications — GET (list) & POST (create)
// ============================================================================

import { NextRequest } from 'next/server';
import { NotificationService } from '@/services/notification.service';
import { createNotificationSchema, notificationFilterSchema } from '@/lib/validators/notification';
import { createdResponse, successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role, NotificationType } from '@/types';

// GET /api/notifications — All authenticated: get user's notifications
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const params = notificationFilterSchema.parse({
      isRead: searchParams.get('isRead') || undefined,
      type: searchParams.get('type') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
    });

    const isRead = params.isRead === 'true' ? true : params.isRead === 'false' ? false : undefined;

    const { notifications, total } = await NotificationService.getByUser(
      req.user.userId,
      params.page,
      params.limit,
      isRead,
      params.type as NotificationType | undefined
    );

    const unreadCount = await NotificationService.getUnreadCount(req.user.userId);
    const totalPages = Math.ceil(total / params.limit);

    return successResponse(
      {
        notifications,
        unreadCount,
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages,
          hasNextPage: params.page < totalPages,
          hasPrevPage: params.page > 1,
        },
      },
      'Notifications fetched successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
});

// POST /api/notifications — Admin: send notification
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();

    // Check if it's a broadcast
    if (body.broadcast) {
      const result = await NotificationService.broadcast(
        body.title,
        body.message,
        body.type || 'SYSTEM',
        req.user.userId
      );
      return createdResponse(result, `Notification broadcast to ${result.sentTo} users`);
    }

    const validated = createNotificationSchema.parse(body);
    const notification = await NotificationService.create(validated, req.user.userId);

    return createdResponse(notification, 'Notification sent successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
