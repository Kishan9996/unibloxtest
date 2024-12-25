// base.repository.ts
import { PrismaClient } from '@prisma/client';
import { prismaConnector } from './connection';
import { ModelNameType } from './types';

export class BaseRepository {
  protected prisma: PrismaClient;
  protected model: ModelNameType;

  constructor(model: ModelNameType) {
    this.prisma = prismaConnector;
    this.model = model;
  }
}
