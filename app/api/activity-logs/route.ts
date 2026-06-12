// ============================================================================
// /api/activity-logs — GET (list activity logs)
// ============================================================================

import { NextRequest } from 'next/server';
import { ActivityLogService } from '@/services/activity-log.service';
import { paginatedResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/activity-logs — Admin: view activity logs
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId') || undefined;
    const action = searchParams.get('action') || undefined;
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    const { logs, total } = await ActivityLogService.getAll(
      page,
      limit,
      userId,
      action,
      startDate,
      endDate
    );

    return paginatedResponse(logs, total, page, limit, 'Activity logs fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
