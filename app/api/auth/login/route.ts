// ============================================================================
// POST /api/auth/login — User login
// ============================================================================

import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { loginSchema } from '@/lib/validators/auth';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const result = await AuthService.login(validated.email, validated.password);

    return successResponse(result, 'Login successful');
  } catch (error) {
    return handleApiError(error);
  }
}
