// ============================================================================
// Notification Validation Schemas
// ============================================================================

import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z
    .string()
    .min(1, 'User ID is required'),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim(),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(2000, 'Message must not exceed 2000 characters')
    .trim(),
  type: z.enum(['EMAIL', 'SMS', 'SYSTEM']).optional().default('SYSTEM'),
});

export const notificationFilterSchema = z.object({
  isRead: z.enum(['true', 'false']).optional(),
  type: z.enum(['EMAIL', 'SMS', 'SYSTEM']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type NotificationFilterInput = z.infer<typeof notificationFilterSchema>;
