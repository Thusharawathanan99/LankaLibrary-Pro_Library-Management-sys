// ============================================================================
// POST /api/backup — Trigger database backup (admin only)
// ============================================================================

import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { ActivityLogRepository } from '@/repositories/activity-log.repository';
import { Role } from '@prisma/client';
import prisma from '@/lib/prisma';

// POST /api/backup — Admin: export database tables as JSON
export const POST = withAuth(async (req) => {
  try {
    // Fetch all data from each table
    const [users, books, issues, fines, notifications, activityLogs, settings] =
      await Promise.all([
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            createdAt: true,
          },
        }),
        prisma.book.findMany(),
        prisma.issue.findMany({
          include: { fine: true },
        }),
        prisma.fine.findMany(),
        prisma.notification.findMany(),
        prisma.activityLog.findMany(),
        prisma.systemSettings.findMany(),
      ]);

    const backup = {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      tables: {
        users: { count: users.length, data: users },
        books: { count: books.length, data: books },
        issues: { count: issues.length, data: issues },
        fines: { count: fines.length, data: fines },
        notifications: { count: notifications.length, data: notifications },
        activityLogs: { count: activityLogs.length, data: activityLogs },
        settings: { count: settings.length, data: settings },
      },
    };

    // Log activity
    await ActivityLogRepository.create(
      req.user.userId,
      'DATABASE_BACKUP',
      `Database backup generated. Users: ${users.length}, Books: ${books.length}, Issues: ${issues.length}`
    );

    return successResponse(backup, 'Database backup generated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
