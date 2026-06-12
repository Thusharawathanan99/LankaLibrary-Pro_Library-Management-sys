// ============================================================================
// Authentication & Authorization Middleware
// ============================================================================

import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './auth';
import { UnauthorizedError, ForbiddenError } from './errors';
import { handleApiError } from './errors';
import type { AuthenticatedUser } from '@/types';
import { Role } from '@prisma/client';

// ============================================================================
// Types
// ============================================================================

export type AuthenticatedRequest = NextRequest & {
  user: AuthenticatedUser;
};

type RouteHandler = (
  req: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<Response>;

type AuthenticatedRouteHandler = (
  req: NextRequest & { user: AuthenticatedUser },
  context?: { params: Record<string, string> }
) => Promise<Response>;

// ============================================================================
// withAuth — Higher-Order Function for Protected Routes
// ============================================================================

/**
 * Wraps an API route handler with JWT authentication and optional RBAC.
 *
 * @param handler - The route handler function that receives the authenticated user
 * @param allowedRoles - Optional array of roles permitted to access this route.
 *                       If omitted, any authenticated user is allowed.
 *
 * @example
 * // Any authenticated user
 * export const GET = withAuth(async (req) => { ... });
 *
 * // Admin only
 * export const DELETE = withAuth(async (req) => { ... }, [Role.ADMIN]);
 *
 * // Admin or Staff
 * export const POST = withAuth(async (req) => { ... }, [Role.ADMIN, Role.STAFF]);
 */
export function withAuth(
  handler: AuthenticatedRouteHandler,
  allowedRoles?: Role[]
): RouteHandler {
  return async (req: NextRequest, context?: { params: Record<string, string> }) => {
    try {
      // 1. Extract token from Authorization header
      const authHeader = req.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        throw new UnauthorizedError('Missing or invalid authorization token');
      }

      // 2. Verify JWT
      const decoded = verifyToken(token);

      // 3. Check role-based access control
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(decoded.role)) {
          throw new ForbiddenError(
            `Access denied. Required role(s): ${allowedRoles.join(', ')}`
          );
        }
      }

      // 4. Attach user to request
      const authenticatedReq = req as NextRequest & { user: AuthenticatedUser };
      authenticatedReq.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      // 5. Call the actual route handler
      return handler(authenticatedReq, context);
    } catch (error) {
      // Handle JWT-specific errors
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        return handleApiError(new UnauthorizedError('Invalid token'));
      }
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        return handleApiError(new UnauthorizedError('Token has expired'));
      }
      return handleApiError(error);
    }
  };
}

// ============================================================================
// getUserFromRequest — Extract user without throwing (for optional auth)
// ============================================================================

/**
 * Tries to extract the authenticated user from request headers.
 * Returns null if no valid token is present (does NOT throw).
 */
export function getUserFromRequest(req: NextRequest): AuthenticatedUser | null {
  try {
    const authHeader = req.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    if (!token) return null;

    const decoded = verifyToken(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}
