// ============================================================================
// Book Service — Business Logic
// ============================================================================

import { BookRepository } from '@/repositories/book.repository';
import { ActivityLogRepository } from '@/repositories/activity-log.repository';
import { NotFoundError, ConflictError, AppError } from '@/lib/errors';
import type { BookFilters, CreateBookInput, UpdateBookInput } from '@/types';

export class BookService {
  /**
   * Get all books with filters and pagination
   */
  static async getAll(filters: BookFilters) {
    return BookRepository.findAll(filters);
  }

  /**
   * Get book by ID
   */
  static async getById(id: string) {
    const book = await BookRepository.findById(id);
    if (!book) {
      throw new NotFoundError('Book');
    }
    return book;
  }

  /**
   * Create a new book
   */
  static async create(data: CreateBookInput, actorId: string) {
    // Check for duplicate ISBN
    const existing = await BookRepository.findByIsbn(data.isbn);
    if (existing) {
      throw new ConflictError('A book with this ISBN already exists');
    }

    const book = await BookRepository.create({
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      category: data.category,
      publisher: data.publisher,
      quantity: data.quantity,
      availableQuantity: data.quantity,
    });

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      'BOOK_CREATED',
      `Book added: "${book.title}" by ${book.author} (ISBN: ${book.isbn})`
    );

    return book;
  }

  /**
   * Update a book
   */
  static async update(id: string, data: UpdateBookInput, actorId: string) {
    const existingBook = await BookRepository.findById(id);
    if (!existingBook) {
      throw new NotFoundError('Book');
    }

    // If ISBN is being changed, check for duplicates
    if (data.isbn && data.isbn !== existingBook.isbn) {
      const duplicate = await BookRepository.findByIsbn(data.isbn);
      if (duplicate) {
        throw new ConflictError('A book with this ISBN already exists');
      }
    }

    // If quantity is being updated, adjust availableQuantity proportionally
    const updateData: Record<string, unknown> = { ...data };
    if (data.quantity !== undefined && data.quantity !== existingBook.quantity) {
      const diff = data.quantity - existingBook.quantity;
      const newAvailable = existingBook.availableQuantity + diff;
      if (newAvailable < 0) {
        throw new AppError(
          `Cannot reduce quantity below currently issued books. ${existingBook.quantity - existingBook.availableQuantity} books are currently issued.`,
          400
        );
      }
      updateData.availableQuantity = newAvailable;
    }

    const book = await BookRepository.update(id, updateData);

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      'BOOK_UPDATED',
      `Book updated: "${book.title}" (ID: ${book.id})`
    );

    return book;
  }

  /**
   * Delete a book
   */
  static async delete(id: string, actorId: string) {
    const book = await BookRepository.findById(id);
    if (!book) {
      throw new NotFoundError('Book');
    }

    // Check if book has active issues
    if (book.quantity !== book.availableQuantity) {
      throw new AppError(
        'Cannot delete a book that has active issues. Please wait for all copies to be returned.',
        400
      );
    }

    await BookRepository.delete(id);

    // Log activity
    await ActivityLogRepository.create(
      actorId,
      'BOOK_DELETED',
      `Book deleted: "${book.title}" by ${book.author} (ISBN: ${book.isbn})`
    );

    return book;
  }

  /**
   * Get all book categories
   */
  static async getCategories() {
    return BookRepository.getCategories();
  }

  /**
   * Get most borrowed books
   */
  static async getMostBorrowed(limit: number = 10) {
    return BookRepository.getMostBorrowed(limit);
  }
}
