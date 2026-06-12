// ============================================================================
// POST /api/issues/return — Return a book
// ============================================================================

import { NextRequest } from 'next/server';
import { IssueService } from '@/services/issue.service';
import { returnBookSchema } from '@/lib/validators/issue';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// POST /api/issues/return — Admin/Staff: return a book
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = returnBookSchema.parse(body);

    const result = await IssueService.returnBook(
      validated.issueId,
      req.user.userId
    );

    const message = result.fine
      ? `Book returned successfully. Fine of ${result.fine.amount} generated (overdue).`
      : 'Book returned successfully. No fine.';

    return successResponse(result, message);
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
