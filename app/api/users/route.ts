// ============================================================================
// /api/users — GET (list) & POST (create)
// ============================================================================

import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';
import { createUserSchema, userFilterSchema } from '@/lib/validators/user';
import { paginatedResponse, createdResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/users — Admin/Staff: list users
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const params = userFilterSchema.parse({
      search: searchParams.get('search') || undefined,
      role: searchParams.get('role') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
    });

    const { users, total } = await UserService.getAll(params);

    return paginatedResponse(users, total, params.page, params.limit, 'Users fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);

// POST /api/users — Admin/Staff: create a new user
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = createUserSchema.parse(body);

    const user = await UserService.create(validated, req.user.userId);

    return createdResponse(user, 'User created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
