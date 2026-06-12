// ============================================================================
// Custom Error Classes & Error Handler
// ============================================================================

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ============================================================================
// Custom Error Classes
// ============================================================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;

  constructor(message: string = 'Validation failed', errors: Record<string, string[]> = {}) {
    super(message, 400);
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409);
  }
}

// ============================================================================
// Error Handler — converts any error into a NextResponse
// ============================================================================

export function handleApiError(error: unknown): NextResponse {
  // Zod validation errors
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(err.message);
    });

    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: fieldErrors,
      },
      { status: 400 }
    );
  }

  // Custom ValidationError with field errors
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errors: error.errors,
      },
      { status: error.statusCode }
    );
  }

  // Custom AppError (and subclasses)
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  // Prisma known request errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: { target?: string[] } };

    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target?.join(', ') || 'field';
      return NextResponse.json(
        {
          success: false,
          message: `A record with this ${target} already exists`,
        },
        { status: 409 }
      );
    }

    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        {
          success: false,
          message: 'Record not found',
        },
        { status: 404 }
      );
    }
  }

  // Unknown errors
  console.error('Unhandled API error:', error);
  return NextResponse.json(
    {
      success: false,
      message: process.env.NODE_ENV === 'development'
        ? `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
        : 'Internal server error',
    },
    { status: 500 }
  );
}
