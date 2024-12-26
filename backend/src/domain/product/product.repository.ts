import { BaseRepository } from '../../database/base.repository';
import { Prisma, Product } from '@prisma/client';

export class ProductRepository extends BaseRepository {
  constructor() {
    super(Prisma.ModelName.Product);
  }

  public async createProduct(data: Prisma.ProductCreateArgs): Promise<Product | null> {
    return await this.prisma.product.create(data);
  }

  public async findManyProducts(args: Prisma.ProductFindManyArgs) {
    return await this.prisma.product.findMany(args);
  }

  public async findUniqueProduct(args: Prisma.ProductFindUniqueArgs) {
    return await this.prisma.product.findUnique(args);
  }

  public async updateManyProducts(args: Prisma.ProductUpdateArgs) {
    return await this.prisma.product.update(args);
  }
}
