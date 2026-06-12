// ============================================================================
// /api/users/[id] — GET, PUT, DELETE
// ============================================================================

import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';
import { updateUserSchema } from '@/lib/validators/user';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/users/[id] — Admin/Staff: get user details
export const GET = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const user = await UserService.getById(id);
    return successResponse(user, 'User fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);

// PUT /api/users/[id] — Admin: update user
export const PUT = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const body = await req.json();
    const validated = updateUserSchema.parse(body);

    const user = await UserService.update(id, validated, req.user.userId);

    return successResponse(user, 'User updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);

// DELETE /api/users/[id] — Admin: delete user
export const DELETE = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const user = await UserService.delete(id, req.user.userId);
    return successResponse(user, 'User deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
