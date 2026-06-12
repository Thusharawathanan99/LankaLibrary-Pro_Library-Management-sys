// ============================================================================
// Issue Repository — Data Access Layer
// ============================================================================

import prisma from '@/lib/prisma';
import { Prisma, IssueStatus } from '@prisma/client';
import type { IssueFilters } from '@/types';

export class IssueRepository {
  /**
   * Find issue by ID with relations
   */
  static async findById(id: string) {
    return prisma.issue.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        book: {
          select: { id: true, title: true, author: true, isbn: true },
        },
        fine: true,
      },
    });
  }

  /**
   * Find all issues with filtering and pagination
   */
  static async findAll(filters: IssueFilters) {
    const { page, limit, userId, bookId, status, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.IssueWhereInput = {};

    if (userId) where.userId = userId;
    if (bookId) where.bookId = bookId;
    if (status) where.status = status;

    if (startDate || endDate) {
      where.issueDate = {};
      if (startDate) where.issueDate.gte = startDate;
      if (endDate) where.issueDate.lte = endDate;
    }

    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          book: {
            select: { id: true, title: true, author: true, isbn: true },
          },
          fine: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.issue.count({ where }),
    ]);

    return { issues, total };
  }

  /**
   * Find active issues for a user (status = ISSUED)
   */
  static async findActiveByUser(userId: string) {
    return prisma.issue.findMany({
      where: {
        userId,
        status: 'ISSUED',
      },
      include: {
        book: {
          select: { id: true, title: true, author: true },
        },
      },
    });
  }

  /**
   * Count active issues for a user
   */
  static async countActiveByUser(userId: string) {
    return prisma.issue.count({
      where: {
        userId,
        status: 'ISSUED',
      },
    });
  }

  /**
   * Find overdue issues (status=ISSUED and dueDate < now)
   */
  static async findOverdue() {
    return prisma.issue.findMany({
      where: {
        status: 'ISSUED',
        dueDate: { lt: new Date() },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        book: {
          select: { id: true, title: true, author: true, isbn: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  /**
   * Create a new issue
   */
  static async create(data: Prisma.IssueCreateInput) {
    return prisma.issue.create({
      data,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        book: {
          select: { id: true, title: true, author: true, isbn: true },
        },
      },
    });
  }

  /**
   * Update issue (e.g., on return)
   */
  static async update(id: string, data: Prisma.IssueUpdateInput) {
    return prisma.issue.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        book: {
          select: { id: true, title: true, author: true, isbn: true },
        },
        fine: true,
      },
    });
  }

  /**
   * Count issues by status
   */
  static async countByStatus(status?: IssueStatus) {
    return prisma.issue.count({
      where: status ? { status } : undefined,
    });
  }

  /**
   * Count issues within a date range
   */
  static async countByDateRange(startDate: Date, endDate: Date, status?: IssueStatus) {
    return prisma.issue.count({
      where: {
        issueDate: { gte: startDate, lte: endDate },
        ...(status && { status }),
      },
    });
  }

  /**
   * Find issues within a date range
   */
  static async findByDateRange(startDate: Date, endDate: Date) {
    return prisma.issue.findMany({
      where: {
        issueDate: { gte: startDate, lte: endDate },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        book: {
          select: { id: true, title: true, author: true },
        },
        fine: true,
      },
      orderBy: { issueDate: 'desc' },
    });
  }

  /**
   * Mark overdue issues (update status to OVERDUE where dueDate passed)
   */
  static async markOverdueIssues() {
    return prisma.issue.updateMany({
      where: {
        status: 'ISSUED',
        dueDate: { lt: new Date() },
      },
      data: {
        status: 'OVERDUE',
      },
    });
  }

  /**
   * Check if user has overdue books
   */
  static async hasOverdueBooks(userId: string) {
    const count = await prisma.issue.count({
      where: {
        userId,
        status: 'ISSUED',
        dueDate: { lt: new Date() },
      },
    });
    return count > 0;
  }
}
