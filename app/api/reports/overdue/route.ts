// ============================================================================
// GET /api/reports/overdue — Overdue books report
// ============================================================================

import { NextRequest } from 'next/server';
import { ReportService } from '@/services/report.service';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

export const GET = withAuth(async (req) => {
  try {
    const report = await ReportService.getOverdueReport();
    return successResponse(report, 'Overdue report generated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
