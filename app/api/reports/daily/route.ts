// ============================================================================
// GET /api/reports/daily — Daily issued books report
// ============================================================================

import { NextRequest } from 'next/server';
import { ReportService } from '@/services/report.service';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    const date = dateStr ? new Date(dateStr) : new Date();

    const report = await ReportService.getDailyReport(date);

    return successResponse(report, 'Daily report generated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
