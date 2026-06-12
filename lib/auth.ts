// ============================================================================
// Authentication Helpers — JWT + bcrypt
// ============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { BCRYPT_ROUNDS, JWT_EXPIRY } from './constants';
import type { JwtPayload } from '@/types';

// ============================================================================
// Environment
// ============================================================================

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

// ============================================================================
// Password Hashing
// ============================================================================

/**
 * Hash a plain-text password using bcrypt
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// ============================================================================
// JWT Token Management
// ============================================================================

/**
 * Sign a JWT token with user payload
 */
export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const expiresIn = process.env.JWT_EXPIRES_IN || JWT_EXPIRY;
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 * @throws JsonWebTokenError if token is invalid or expired
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}
