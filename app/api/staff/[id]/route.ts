// ============================================================================
// /api/staff/[id] — GET, PUT, DELETE
// ============================================================================

import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';
import { updateUserSchema } from '@/lib/validators/user';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/staff/[id] — Admin: get staff details
export const GET = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const user = await UserService.getById(id);
    return successResponse(user, 'Staff member fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);

// PUT /api/staff/[id] — Admin: update staff member
export const PUT = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const body = await req.json();
    const validated = updateUserSchema.parse(body);

    const user = await UserService.update(id, validated, req.user.userId);

    return successResponse(user, 'Staff member updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);

// DELETE /api/staff/[id] — Admin: delete staff member
export const DELETE = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const user = await UserService.delete(id, req.user.userId);
    return successResponse(user, 'Staff member deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
