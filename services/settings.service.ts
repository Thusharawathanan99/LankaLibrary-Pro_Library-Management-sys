// ============================================================================
// Settings Service — Business Logic
// ============================================================================

import { SettingsRepository } from '@/repositories/settings.repository';
import { ActivityLogRepository } from '@/repositories/activity-log.repository';

export class SettingsService {
  /**
   * Get all settings
   */
  static async getAll() {
    return SettingsRepository.findAll();
  }

  /**
   * Get a setting by key
   */
  static async getByKey(key: string) {
    return SettingsRepository.findByKey(key);
  }

  /**
   * Update a setting (upsert)
   */
  static async update(
    key: string,
    value: string,
    description: string | undefined,
    actorId: string
  ) {
    const setting = await SettingsRepository.upsert(key, value, description);

    await ActivityLogRepository.create(
      actorId,
      'SETTINGS_UPDATED',
      `Setting updated: ${key} = ${value}`
    );

    return setting;
  }

  /**
   * Bulk update settings
   */
  static async bulkUpdate(
    settings: Array<{ key: string; value: string; description?: string }>,
    actorId: string
  ) {
    const results = await Promise.all(
      settings.map((s) => SettingsRepository.upsert(s.key, s.value, s.description))
    );

    await ActivityLogRepository.create(
      actorId,
      'SETTINGS_BULK_UPDATED',
      `${settings.length} settings updated: ${settings.map((s) => s.key).join(', ')}`
    );

    return results;
  }
}
