// ============================================================================
// GET /api/reports/monthly — Monthly issued books report
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
    const now = new Date();
    const year = parseInt(searchParams.get('year') || String(now.getFullYear()));
    const month = parseInt(searchParams.get('month') || String(now.getMonth() + 1));

    const report = await ReportService.getMonthlyReport(year, month);

    return successResponse(report, 'Monthly report generated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
