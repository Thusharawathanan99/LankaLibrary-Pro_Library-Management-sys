// ============================================================================
// Book Validation Schemas
// ============================================================================

import { z } from 'zod';

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim(),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(255, 'Author must not exceed 255 characters')
    .trim(),
  isbn: z
    .string()
    .min(10, 'ISBN must be at least 10 characters')
    .max(17, 'ISBN must not exceed 17 characters')
    .trim(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must not exceed 100 characters')
    .trim(),
  publisher: z
    .string()
    .min(1, 'Publisher is required')
    .max(255, 'Publisher must not exceed 255 characters')
    .trim(),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(10000, 'Quantity must not exceed 10000'),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).max(255).trim().optional(),
  author: z.string().min(1).max(255).trim().optional(),
  isbn: z.string().min(10).max(17).trim().optional(),
  category: z.string().min(1).max(100).trim().optional(),
  publisher: z.string().min(1).max(255).trim().optional(),
  quantity: z.number().int().min(0).max(10000).optional(),
});

export const searchBookSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  available: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type SearchBookInput = z.infer<typeof searchBookSchema>;
