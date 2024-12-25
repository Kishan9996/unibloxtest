import { Product } from '@prisma/client';
import { ProductRepository } from '../../domain/product';
import { ProductCreateSchemaType } from '../../interface/product/schema';
import { CommonPaginationRequestOptions, PaginatedResponse } from '../../utils/dto/general';
import { ProductAddTOCartSchemaType } from '../../interface/cart/schema';

export class ProductServices {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async createProduct(data: ProductCreateSchemaType): Promise<Product | null> {
    return await this.productRepository.createProduct({ data });
  }

  public async fetchPaginatedProducts(
    options: CommonPaginationRequestOptions<Product>
  ): Promise<PaginatedResponse<Product>> {
    return await this.productRepository.getPaginatedProductList({
      page: options.page,
      pageSize: options.pageSize,
      filter: {
        where: {
          name: {
            contains: options.search,
          },
        },
        select: { id: true, price: true, stock: true, name: true },
        orderBy: {
          createdAt: 'desc',
        },
      },
    });
  }

  public async findProductsById(productIds: string[]) {
    return await this.productRepository.findManyProducts({
      where: {
        id: {
          in: productIds,
        },
      },
    });
  }

  public async checkProductsAndQuantityAvailable(productData: ProductAddTOCartSchemaType) {
    const productConditions = productData.map((item) => ({
      id: item.productId,
      quantity: { gte: item.quantity },
    }));
    const availableProducts = await this.productRepository.findManyProducts({
      where: {
        OR: productConditions,
      },
    });
    return availableProducts;
  }
}
