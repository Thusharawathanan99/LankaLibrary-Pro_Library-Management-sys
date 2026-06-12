// ============================================================================
// /api/notifications/[id] — PUT (mark as read)
// ============================================================================

import { NextRequest } from 'next/server';
import { NotificationService } from '@/services/notification.service';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';

// PUT /api/notifications/[id] — Authenticated: mark notification as read
export const PUT = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;

    // Check if marking all as read
    if (id === 'read-all') {
      await NotificationService.markAllAsRead(req.user.userId);
      return successResponse(null, 'All notifications marked as read');
    }

    const notification = await NotificationService.markAsRead(id, req.user.userId);

    return successResponse(notification, 'Notification marked as read');
  } catch (error) {
    return handleApiError(error);
  }
});
