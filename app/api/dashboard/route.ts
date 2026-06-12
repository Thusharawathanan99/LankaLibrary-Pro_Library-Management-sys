// ============================================================================
// GET /api/dashboard — Dashboard statistics
// ============================================================================

import { NextRequest } from 'next/server';
import { ReportService } from '@/services/report.service';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/dashboard — Admin/Staff: get dashboard stats
export const GET = withAuth(async (req) => {
  try {
    const stats = await ReportService.getDashboardStats();
    return successResponse(stats, 'Dashboard statistics fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
