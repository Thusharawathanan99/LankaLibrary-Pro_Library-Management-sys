// ============================================================================
// /api/settings — GET (list) & PUT (update)
// ============================================================================

import { NextRequest } from 'next/server';
import { SettingsService } from '@/services/settings.service';
import { updateSettingsSchema, bulkUpdateSettingsSchema } from '@/lib/validators/settings';
import { successResponse } from '@/lib/response';
import { handleApiError } from '@/lib/errors';
import { withAuth } from '@/lib/middleware';
import { Role } from '@prisma/client';

// GET /api/settings — Admin: get all settings
export const GET = withAuth(async (req) => {
  try {
    const settings = await SettingsService.getAll();
    return successResponse(settings, 'Settings fetched successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);

// PUT /api/settings — Admin: update settings
export const PUT = withAuth(async (req) => {
  try {
    const body = await req.json();

    // Check if it's a bulk update
    if (body.settings && Array.isArray(body.settings)) {
      const validated = bulkUpdateSettingsSchema.parse(body);
      const results = await SettingsService.bulkUpdate(validated.settings, req.user.userId);
      return successResponse(results, 'Settings updated successfully');
    }

    // Single setting update
    const validated = updateSettingsSchema.parse(body);
    const setting = await SettingsService.update(
      validated.key,
      validated.value,
      validated.description,
      req.user.userId
    );

    return successResponse(setting, 'Setting updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}, [Role.ADMIN]);
