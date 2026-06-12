// ============================================================================
// Settings Validation Schemas
// ============================================================================

import { z } from 'zod';

export const updateSettingsSchema = z.object({
  key: z
    .string()
    .min(1, 'Key is required')
    .max(100, 'Key must not exceed 100 characters')
    .trim(),
  value: z
    .string()
    .min(1, 'Value is required')
    .max(500, 'Value must not exceed 500 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional(),
});

export const bulkUpdateSettingsSchema = z.object({
  settings: z.array(updateSettingsSchema).min(1, 'At least one setting is required'),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type BulkUpdateSettingsInput = z.infer<typeof bulkUpdateSettingsSchema>;
