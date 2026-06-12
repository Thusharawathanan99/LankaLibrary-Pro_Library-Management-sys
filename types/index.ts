// ============================================================================
// Shared TypeScript Types & Interfaces
// ============================================================================

import { Role, IssueStatus, FineStatus, NotificationType } from '@prisma/client';

// Re-export Prisma enums for convenience
export { Role, IssueStatus, FineStatus, NotificationType };

// ============================================================================
// JWT / Auth Types
// ============================================================================

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Query / Filter Types
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface BookFilters extends PaginationParams {
  search?: string;
  category?: string;
  author?: string;
  available?: boolean;
}

export interface UserFilters extends PaginationParams {
  search?: string;
  role?: Role;
}

export interface IssueFilters extends PaginationParams {
  userId?: string;
  bookId?: string;
  status?: IssueStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface FineFilters extends PaginationParams {
  userId?: string;
  status?: FineStatus;
}

export interface ReportDateRange {
  startDate: Date;
  endDate: Date;
}

// ============================================================================
// Service Input Types
// ============================================================================

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  phone?: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  quantity: number;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  isbn?: string;
  category?: string;
  publisher?: string;
  quantity?: number;
}

export interface IssueBookInput {
  userId: string;
  bookId: string;
}

export interface ReturnBookInput {
  issueId: string;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}

export interface UpdateSettingsInput {
  key: string;
  value: string;
  description?: string;
}

// ============================================================================
// Report Types
// ============================================================================

export interface DailyReport {
  date: string;
  totalIssued: number;
  totalReturned: number;
  issues: Array<{
    id: string;
    bookTitle: string;
    userName: string;
    status: IssueStatus;
  }>;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalIssued: number;
  totalReturned: number;
  totalOverdue: number;
  totalFinesCollected: number;
}

export interface OverdueReport {
  totalOverdue: number;
  issues: Array<{
    id: string;
    bookTitle: string;
    userName: string;
    userEmail: string;
    dueDate: Date;
    overdueDays: number;
    estimatedFine: number;
  }>;
}

export interface MostBorrowedReport {
  books: Array<{
    bookId: string;
    title: string;
    author: string;
    category: string;
    totalIssues: number;
  }>;
}

export interface ActiveUsersReport {
  users: Array<{
    userId: string;
    name: string;
    email: string;
    totalIssues: number;
    currentlyBorrowed: number;
  }>;
}
