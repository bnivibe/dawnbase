// Re-export article types from validation schemas
export type {
  Article,
  ArticleStatus,
  SourceType,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/lib/validations/article";

// API response types

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export interface ApiValidationError {
  error: string;
  details: ValidationErrorItem[];
}
