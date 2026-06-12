// ============================================================================
// Auth Service — Business Logic
// ============================================================================

import { UserRepository } from '@/repositories/user.repository';
import { hashPassword, comparePassword, signToken } from '@/lib/auth';
import { ConflictError, UnauthorizedError, NotFoundError } from '@/lib/errors';
import { ActivityLogRepository } from '@/repositories/activity-log.repository';
import type { Role } from '@prisma/client';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: Role;
  }) {
    // Check if email already exists
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('A user with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'USER',
      phone: data.phone,
    });

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Log activity
    await ActivityLogRepository.create(
      user.id,
      'USER_REGISTERED',
      `New user registered: ${user.email} (${user.role})`
    );

    return {
      user,
      token,
    };
  }

  /**
   * Login with email and password
   */
  static async login(email: string, password: string) {
    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Compare passwords
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Log activity
    await ActivityLogRepository.create(
      user.id,
      'USER_LOGIN',
      `User logged in: ${user.email}`
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Get current user profile
   */
  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }
}
