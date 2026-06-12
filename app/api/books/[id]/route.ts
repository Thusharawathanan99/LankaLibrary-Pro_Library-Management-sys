// ============================================================================
// /api/books/[id] — GET, PUT, DELETE
// ============================================================================

import { NextRequest } from 'next/server';
import { BookService } from '@/services/book.service';
import { updateBookSchema } from '@/lib/validators/book';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/books/[id] — Public: get book details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await BookService.getById(params.id);
    return successResponse(book, 'Book fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/books/[id] — Admin/Staff: update book
export const PUT = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const body = await req.json();
    const validated = updateBookSchema.parse(body);

    const book = await BookService.update(id, validated, req.user.userId);

    return successResponse(book, 'Book updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);

// DELETE /api/books/[id] — Admin only: delete book
export const DELETE = withAuth(async (req, context) => {
  try {
    const id = context?.params?.id as string;
    const book = await BookService.delete(id, req.user.userId);

    return successResponse(book, 'Book deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
