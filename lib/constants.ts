// ============================================================================
// System Constants
// ============================================================================

/** Fine charged per overdue day (in currency units) */
export const DEFAULT_FINE_PER_DAY = 5;

/** Default loan period in days */
export const DEFAULT_LOAN_DAYS = 14;

/** Maximum books a single user can borrow at once */
export const MAX_BOOKS_PER_USER = 5;

/** bcrypt hashing rounds */
export const BCRYPT_ROUNDS = 12;

/** JWT token expiry duration */
export const JWT_EXPIRY = '7d';

/** Default pagination settings */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

/** System settings keys (used in SystemSettings table) */
export const SETTINGS_KEYS = {
  FINE_PER_DAY: 'fine_per_day',
  LOAN_DAYS: 'loan_days',
  MAX_BOOKS_PER_USER: 'max_books_per_user',
  LIBRARY_NAME: 'library_name',
  LIBRARY_EMAIL: 'library_email',
  LIBRARY_PHONE: 'library_phone',
} as const;
