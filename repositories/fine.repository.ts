// ============================================================================
// Fine Repository — Data Access Layer
// ============================================================================

import prisma from '@/lib/prisma';
import { Prisma, FineStatus } from '@prisma/client';
import type { FineFilters } from '@/types';

export class FineRepository {
  /**
   * Find fine by ID with relations
   */
  static async findById(id: string) {
    return prisma.fine.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        issue: {
          include: {
            book: {
              select: { id: true, title: true, author: true },
            },
          },
        },
      },
    });
  }

  /**
   * Find fine by issue ID
   */
  static async findByIssueId(issueId: string) {
    return prisma.fine.findUnique({
      where: { issueId },
    });
  }

  /**
   * Find all fines with filtering and pagination
   */
  static async findAll(filters: FineFilters) {
    const { page, limit, userId, status } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.FineWhereInput = {};

    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [fines, total] = await Promise.all([
      prisma.fine.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          issue: {
            include: {
              book: {
                select: { id: true, title: true, author: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.fine.count({ where }),
    ]);

    return { fines, total };
  }

  /**
   * Find fines by user
   */
  static async findByUser(userId: string) {
    return prisma.fine.findMany({
      where: { userId },
      include: {
        issue: {
          include: {
            book: {
              select: { id: true, title: true, author: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a fine
   */
  static async create(data: Prisma.FineCreateInput) {
    return prisma.fine.create({
      data,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        issue: {
          include: {
            book: {
              select: { id: true, title: true, author: true },
            },
          },
        },
      },
    });
  }

  /**
   * Update fine status
   */
  static async updateStatus(id: string, status: FineStatus) {
    return prisma.fine.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        issue: {
          include: {
            book: {
              select: { id: true, title: true, author: true },
            },
          },
        },
      },
    });
  }

  /**
   * Get total fine amount collected within a date range
   */
  static async getTotalCollected(startDate?: Date, endDate?: Date) {
    const where: Prisma.FineWhereInput = {
      status: 'PAID',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const result = await prisma.fine.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    });

    return {
      totalAmount: result._sum.amount || 0,
      totalCount: result._count,
    };
  }

  /**
   * Get total unpaid fines for a user
   */
  static async getUnpaidByUser(userId: string) {
    const result = await prisma.fine.aggregate({
      where: { userId, status: 'UNPAID' },
      _sum: { amount: true },
      _count: true,
    });

    return {
      totalAmount: result._sum.amount || 0,
      totalCount: result._count,
    };
  }
}
