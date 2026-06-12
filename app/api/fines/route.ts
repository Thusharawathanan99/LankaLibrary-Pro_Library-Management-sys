// ============================================================================
// /api/fines — GET (list fines)
// ============================================================================

import { NextRequest } from 'next/server';
import { FineService } from '@/services/fine.service';
import { fineFilterSchema } from '@/lib/validators/fine';
import { paginatedResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/fines — All authenticated: list fines (filtered by role)
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const params = fineFilterSchema.parse({
      userId: searchParams.get('userId') || undefined,
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
    });

    // Regular users can only see their own fines
    const filters = {
      ...params,
      ...(req.user.role === Role.USER && { userId: req.user.userId }),
    };

    const { fines, total } = await FineService.getAll(filters);

    return paginatedResponse(fines, total, params.page, params.limit, 'Fines fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
});
