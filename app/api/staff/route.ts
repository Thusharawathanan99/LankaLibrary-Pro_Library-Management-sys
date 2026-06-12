// ============================================================================
// /api/staff — GET (list) & POST (create)
// ============================================================================

import { NextRequest } from 'next/server';
import { UserService } from '@/services/user.service';
import { createUserSchema, userFilterSchema } from '@/lib/validators/user';
import { paginatedResponse, createdResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/staff — Admin: list staff members
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const params = userFilterSchema.parse({
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
    });

    const { users, total } = await UserService.getStaff(params);

    return paginatedResponse(users, total, params.page, params.limit, 'Staff members fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);

// POST /api/staff — Admin: create a new staff member
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = createUserSchema.parse(body);

    const staff = await UserService.createStaff(
      {
        name: validated.name,
        email: validated.email,
        password: validated.password,
        phone: validated.phone,
      },
      req.user.userId
    );

    return createdResponse(staff, 'Staff member created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
