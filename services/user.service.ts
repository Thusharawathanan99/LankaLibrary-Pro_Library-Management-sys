// ============================================================================
// User Service — Business Logic
// ============================================================================

import { UserRepository } from '@/repositories/user.repository';
import { ActivityLogRepository } from '@/repositories/activity-log.repository';
import { hashPassword } from '@/lib/auth';
import { NotFoundError, ConflictError, AppError } from '@/lib/errors';
import type { UserFilters } from '@/types';
import type { Role } from '@prisma/client';

export class UserService {
  /**
   * Get all users with filters and pagination
   */
  static async getAll(filters: UserFilters) {
    return UserRepository.findAll(filters);
  }

  /**
   * Get user by ID
   */
  static async getById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  /**
   * Create a new user (by admin/staff)
   */
  static async create(
    data: {
      name: string;
      email: string;
      password: string;
      role?: Role;
      phone?: string;
    },
    actorId: string
  ) {
    // Check for duplicate email
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'USER',
      phone: data.phone,
    });

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      'USER_CREATED',
      `User created: ${user.email} (${user.role}) by admin/staff`
    );

    return user;
  }

  /**
   * Update a user
   */
  static async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: Role;
      phone?: string | null;
    },
    actorId: string
  ) {
    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError('User');
    }

    // If email is being changed, check for duplicates
    if (data.email && data.email !== existingUser.email) {
      const duplicate = await UserRepository.findByEmail(data.email);
      if (duplicate) {
        throw new ConflictError('A user with this email already exists');
      }
    }

    // Hash password if being updated
    const updateData: Record<string, unknown> = { ...data };
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    const user = await UserRepository.update(id, updateData);

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      'USER_UPDATED',
      `User updated: ${user.email} (ID: ${user.id})`
    );

    return user;
  }

  /**
   * Delete a user
   */
  static async delete(id: string, actorId: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    // Prevent self-deletion
    if (id === actorId) {
      throw new AppError('You cannot delete your own account', 400);
    }

    await UserRepository.delete(id);

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      'USER_DELETED',
      `User deleted: ${user.email} (${user.role})`
    );

    return user;
  }

  /**
   * Get staff members (users with STAFF role)
   */
  static async getStaff(filters: UserFilters) {
    return UserRepository.findAll({ ...filters, role: 'STAFF' as Role });
  }

  /**
   * Create a staff member
   */
  static async createStaff(
    data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    },
    actorId: string
  ) {
    return this.create({ ...data, role: 'STAFF' as Role }, actorId);
  }
}
