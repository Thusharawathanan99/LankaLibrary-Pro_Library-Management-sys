// ============================================================================
// Settings Repository — Data Access Layer
// ============================================================================

import prisma from '@/lib/prisma';

export class SettingsRepository {
  /**
   * Find setting by key
   */
  static async findByKey(key: string) {
    return prisma.systemSettings.findUnique({
      where: { key },
    });
  }

  /**
   * Find all settings
   */
  static async findAll() {
    return prisma.systemSettings.findMany({
      orderBy: { key: 'asc' },
    });
  }

  /**
   * Upsert a setting (create or update)
   */
  static async upsert(key: string, value: string, description?: string) {
    return prisma.systemSettings.upsert({
      where: { key },
      create: { key, value, description },
      update: { value, ...(description !== undefined && { description }) },
    });
  }

  /**
   * Get setting value with fallback
   */
  static async getValue(key: string, fallback: string): Promise<string> {
    const setting = await prisma.systemSettings.findUnique({
      where: { key },
    });
    return setting?.value ?? fallback;
  }

  /**
   * Get numeric setting value with fallback
   */
  static async getNumericValue(key: string, fallback: number): Promise<number> {
    const setting = await prisma.systemSettings.findUnique({
      where: { key },
    });
    if (!setting) return fallback;
    const parsed = parseFloat(setting.value);
    return isNaN(parsed) ? fallback : parsed;
  }

  /**
   * Delete a setting
   */
  static async delete(key: string) {
    return prisma.systemSettings.delete({
      where: { key },
    });
  }
}
