// ============================================================================
// User Repository — Data Access Layer
// ============================================================================

import prisma from '@/lib/prisma';
import { Prisma, Role } from '@prisma/client';
import type { UserFilters } from '@/types';

export class UserRepository {
  /**
   * Find user by ID
   */
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find user by ID (includes password for auth)
   */
  static async findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find all users with filtering and pagination
   */
  static async findAll(filters: UserFilters) {
    const { page, limit, search, role } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              issues: true,
              fines: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  /**
   * Create a new user
   */
  static async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Update a user
   */
  static async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Delete a user
   */
  static async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Count users by role
   */
  static async countByRole(role?: Role) {
    return prisma.user.count({
      where: role ? { role } : undefined,
    });
  }

  /**
   * Find users with active (ISSUED) books
   */
  static async findUsersWithActiveIssues() {
    return prisma.user.findMany({
      where: {
        issues: {
          some: {
            status: 'ISSUED',
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            issues: {
              where: { status: 'ISSUED' },
            },
          },
        },
      },
    });
  }
}
