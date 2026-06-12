// ============================================================================
// Issue Validation Schemas
// ============================================================================

import { z } from 'zod';

export const issueBookSchema = z.object({
  userId: z
    .string()
    .min(1, 'User ID is required'),
  bookId: z
    .string()
    .min(1, 'Book ID is required'),
});

export const returnBookSchema = z.object({
  issueId: z
    .string()
    .min(1, 'Issue ID is required'),
});

export const issueFilterSchema = z.object({
  userId: z.string().optional(),
  bookId: z.string().optional(),
  status: z.enum(['ISSUED', 'RETURNED', 'OVERDUE']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type IssueBookInput = z.infer<typeof issueBookSchema>;
export type ReturnBookInput = z.infer<typeof returnBookSchema>;
export type IssueFilterInput = z.infer<typeof issueFilterSchema>;
