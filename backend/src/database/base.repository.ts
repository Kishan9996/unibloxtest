// base.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { prismaConnector } from './connection';
import {  ModelNameType} from './types';


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
}
