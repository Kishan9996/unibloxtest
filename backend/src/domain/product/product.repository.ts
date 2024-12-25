import { BaseRepository } from '../../database/base.repository';
import { Prisma, Product } from '@prisma/client';
import { PaginatedResponse, PaginationOptions } from '../../utils/dto/general';

export class ProductRepository extends BaseRepository {
  constructor() {
    super(Prisma.ModelName.Product);
  }

  /**
   * ProductRepository extends the BaseRepository to provide database operations
   * specific to the Product model. It includes methods for creating a new product
   * in the database using Prisma ORM.
   */
  public async createProduct(data: Prisma.ProductCreateArgs): Promise<Product | null> {
    return await this.prisma.product.create(data);
  }

  public async findManyProducts(args: Prisma.ProductFindManyArgs) {
    return await this.prisma.product.findMany(args);
  }

  public async findUniqueProduct(args: Prisma.ProductFindUniqueArgs) {
    return await this.prisma.product.findUnique(args);
  }

  public async getPaginatedProductList(
    options: PaginationOptions<Prisma.ProductFindManyArgs>
  ): Promise<PaginatedResponse<Product>> {
    return await this.getPaginatedQuerySet<Product, Prisma.ProductFindManyArgs>(options);
  }
}
