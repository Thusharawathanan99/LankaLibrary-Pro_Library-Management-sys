// ============================================================================
// GET /api/reports/most-borrowed — Most borrowed books report
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
    const limit = parseInt(searchParams.get('limit') || '20');

    const report = await ReportService.getMostBorrowedReport(limit);

    return successResponse(report, 'Most borrowed books report generated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
