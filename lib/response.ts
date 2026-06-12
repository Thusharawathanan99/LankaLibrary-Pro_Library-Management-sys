// ============================================================================
// Standardized API Response Helpers
// ============================================================================

import { NextResponse } from 'next/server';

// ============================================================================
// Success Response
// ============================================================================

export function successResponse<T>(
  data: T,
  message: string = 'Success',
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

// ============================================================================
// Error Response
// ============================================================================

export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string[]> | string[]
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors }),
    },
    { status }
  );
}

// ============================================================================
// Paginated Response
// ============================================================================

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success'
): NextResponse {
  const totalPages = Math.ceil(total / limit);

  return NextResponse.json(
    {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
    { status: 200 }
  );
}

// ============================================================================
// No Content Response (204)
// ============================================================================

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ============================================================================
// Created Response (201)
// ============================================================================

export function createdResponse<T>(data: T, message: string = 'Created successfully'): NextResponse {
  return successResponse(data, message, 201);
}
