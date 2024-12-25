// base.repository.ts
import { PrismaClient } from '@prisma/client';
import { prismaConnector } from './connection';
import {  ModelNameType} from './types';
import { PaginatedResponse, PaginationOptions } from '../utils/dto/general';


export class BaseRepository {
  protected prisma: PrismaClient;
  protected model: ModelNameType;
  protected defaultPageSize: number;
  protected defaultPage: number;

  constructor(model: ModelNameType) {
    this.prisma = prismaConnector;
    this.model = model;
    this.defaultPageSize = 10;
    this.defaultPage = 1;
  }

  private getModelInstance() {
    // Convert the PascalCase model name to camelCase for PrismaClient access
    const modelName = this.model.charAt(0).toLowerCase() + this.model.slice(1);
    if (!(modelName in this.prisma)) {
      throw new Error(`Model ${modelName} not found in PrismaClient.`);
    }
    return this.prisma?.[modelName as keyof PrismaClient];
  }

  protected async getPaginatedQuerySet<T, FindManyArgs = any>(
    options: PaginationOptions<FindManyArgs>
  ): Promise<PaginatedResponse<T>> {
    try {
      options.page = options.page ?? this.defaultPage;
      options.pageSize = options.pageSize ?? this.defaultPageSize;

      // Retrieve the model instance dynamically
      const modelInstance: any = this.getModelInstance();
      // extract where claus
      const where = Object.getOwnPropertyDescriptor(options?.filter, 'where')?.value ?? {};

      // Calculate total number of records
      const totalRecords = await modelInstance.count({
        where: where,
      });

      // Calculate total number of pages
      const totalPages = Math.ceil(totalRecords / options.pageSize);

      // Calculate the `skip` value
      const skip = (options.page - 1) * options.pageSize;
      // Fetch paginated data
      const data = await modelInstance.findMany({
        skip: skip,
        take: options.pageSize,
        ...options.filter,
      });

      return {
        data,
        totalRecords,
        totalPages,
        currentPage: options.page,
      };
    } catch (error) {
      throw error;
    }
  }
}
