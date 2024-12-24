import { BaseRepository } from '../../database/base.repository';
import { Prisma, Product } from '@prisma/client';

export class ProductRepository extends BaseRepository {

  constructor() {
    super(Prisma.ModelName.Product);
  }
}
