// ============================================================================
// /api/fines/[id] — PUT (update fine status)
// ============================================================================

import { NextRequest } from 'next/server';
import { FineService } from '@/services/fine.service';
import { updateFineSchema } from '@/lib/validators/fine';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// PUT /api/fines/[id] — Admin/Staff: update fine status
export const PUT = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const body = await req.json();
    const validated = updateFineSchema.parse(body);

    const fine = await FineService.updateStatus(id, validated.status, req.user.userId);

    return successResponse(fine, `Fine marked as ${validated.status.toLowerCase()}`);
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);

// GET /api/fines/[id] — Admin/Staff: get fine details
export const GET = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const fine = await FineService.getById(id);
    return successResponse(fine, 'Fine fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
