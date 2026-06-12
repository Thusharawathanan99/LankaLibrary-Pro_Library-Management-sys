// ============================================================================
// POST /api/issues/issue — Issue a book to a user
// ============================================================================

import { NextRequest } from 'next/server';
import { IssueService } from '@/services/issue.service';
import { issueBookSchema } from '@/lib/validators/issue';
import { createdResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// POST /api/issues/issue — Admin/Staff: issue a book
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = issueBookSchema.parse(body);

    const issue = await IssueService.issueBook(
      validated.userId,
      validated.bookId,
      req.user.userId
    );

    return createdResponse(issue, 'Book issued successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
