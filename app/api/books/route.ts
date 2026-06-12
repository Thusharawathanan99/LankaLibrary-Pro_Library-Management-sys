// ============================================================================
// /api/books — GET (list/search) & POST (create)
// ============================================================================

import { NextRequest } from 'next/server';
import { BookService } from '@/services/book.service';
import { createBookSchema, searchBookSchema } from '@/lib/validators/book';
import { paginatedResponse, createdResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/books — Public: list/search books
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = searchBookSchema.parse({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      author: searchParams.get('author') || undefined,
      available: searchParams.get('available') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
    });

    const { books, total } = await BookService.getAll({
      ...params,
      available: params.available === 'true' ? true : params.available === 'false' ? false : undefined,
    });

    return paginatedResponse(books, total, params.page, params.limit, 'Books fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/books — Admin/Staff: create a new book
export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = createBookSchema.parse(body);

    const book = await BookService.create(validated, req.user.userId);

    return createdResponse(book, 'Book created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN, Role.STAFF]);
