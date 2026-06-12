// ============================================================================
// /api/issues — GET (list all issues)
// ============================================================================

import { NextRequest } from 'next/server';
import { IssueService } from '@/services/issue.service';
import { issueFilterSchema } from '@/lib/validators/issue';
import { paginatedResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/issues — All authenticated: list issues (filtered by role)
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const params = issueFilterSchema.parse({
      userId: searchParams.get('userId') || undefined,
      bookId: searchParams.get('bookId') || undefined,
      status: searchParams.get('status') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
    });

    // Regular users can only see their own issues
    const filters = {
      ...params,
      ...(req.user.role === Role.USER && { userId: req.user.userId }),
    };

    const { issues, total } = await IssueService.getAll(filters);

    return paginatedResponse(issues, total, params.page, params.limit, 'Issues fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
});
