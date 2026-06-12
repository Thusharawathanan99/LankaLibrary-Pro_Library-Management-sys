// ============================================================================
// Fine Validation Schemas
// ============================================================================

import { z } from 'zod';

export const updateFineSchema = z.object({
  status: z.enum(['PAID', 'UNPAID'], {
    required_error: 'Fine status is required',
    invalid_type_error: 'Status must be either PAID or UNPAID',
  }),
});

export const fineFilterSchema = z.object({
  userId: z.string().optional(),
  status: z.enum(['PAID', 'UNPAID']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type UpdateFineInput = z.infer<typeof updateFineSchema>;
export type FineFilterInput = z.infer<typeof fineFilterSchema>;
