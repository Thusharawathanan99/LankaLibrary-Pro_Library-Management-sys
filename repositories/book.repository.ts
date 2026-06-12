// ============================================================================
// Book Repository — Data Access Layer
// ============================================================================

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { BookFilters } from '@/types';

export class BookRepository {
  /**
   * Find book by ID
   */
  static async findById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: {
        _count: {
          select: { issues: true },
        },
      },
    });
  }

  /**
   * Find book by ISBN
   */
  static async findByIsbn(isbn: string) {
    return prisma.book.findUnique({
      where: { isbn },
    });
  }

  /**
   * Find all books with filtering, search, and pagination
   */
  static async findAll(filters: BookFilters) {
    const { page, limit, search, category, author, available } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { isbn: { contains: search } },
        { publisher: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (author) {
      where.author = { contains: author };
    }

    if (available !== undefined) {
      where.availableQuantity = available ? { gt: 0 } : { equals: 0 };
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          _count: {
            select: { issues: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.book.count({ where }),
    ]);

    return { books, total };
  }

  /**
   * Create a new book
   */
  static async create(data: Prisma.BookCreateInput) {
    return prisma.book.create({ data });
  }

  /**
   * Update a book
   */
  static async update(id: string, data: Prisma.BookUpdateInput) {
    return prisma.book.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a book
   */
  static async delete(id: string) {
    return prisma.book.delete({
      where: { id },
    });
  }

  /**
   * Decrement available quantity (atomic operation)
   */
  static async decrementAvailableQuantity(id: string) {
    return prisma.book.update({
      where: { id },
      data: {
        availableQuantity: { decrement: 1 },
      },
    });
  }

  /**
   * Increment available quantity (atomic operation)
   */
  static async incrementAvailableQuantity(id: string) {
    return prisma.book.update({
      where: { id },
      data: {
        availableQuantity: { increment: 1 },
      },
    });
  }

  /**
   * Count total books
   */
  static async count() {
    return prisma.book.count();
  }

  /**
   * Get distinct categories
   */
  static async getCategories() {
    const categories = await prisma.book.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return categories.map((c) => c.category);
  }

  /**
   * Get most borrowed books
   */
  static async getMostBorrowed(limit: number = 10) {
    return prisma.book.findMany({
      include: {
        _count: {
          select: { issues: true },
        },
      },
      orderBy: {
        issues: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  }
}
