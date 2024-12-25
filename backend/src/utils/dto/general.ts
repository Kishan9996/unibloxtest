import { RequestHandler } from "express";

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  totalCount?: number;
}
export interface PaginationOptions<T = any> {
  page?: number;
  pageSize?: number;
  filter?: T;
}

export interface CommonPaginationRequestOptions<T = any, F extends string = string> {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: keyof T | any; // Represents a key from the generic type T
  order?: 'asc' | 'desc';
  filters?: {
    [key in F]: string[];
  };
}

export interface RouteDefinition {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  middlewares?: RequestHandler[];
  handler?: string; // Add this property to the interface
}



export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}