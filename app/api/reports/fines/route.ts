// ============================================================================
// GET /api/reports/fines — Fine collections report
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
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    const report = await ReportService.getFineReport(startDate, endDate);

    return successResponse(report, 'Fine report generated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
