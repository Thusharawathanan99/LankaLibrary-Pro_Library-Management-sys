// ============================================================================
// POST /api/auth/register — Register a new user
// ============================================================================

import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { registerSchema } from '@/lib/validators/auth';
import { createdResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const result = await AuthService.register(validated);

    return createdResponse(result, 'User registered successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
