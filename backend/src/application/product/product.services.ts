import { Product } from '@prisma/client';
import { ProductRepository } from '../../domain/product';
import { ProductCreateSchemaType } from '../../interface/product/schema';
import { ProductAddTOCartSchemaType } from '../../interface/cart/schema';
import { UpdatedStockItem } from '../cart/cart.services';

export class ProductServices {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  public async createProduct(data: ProductCreateSchemaType): Promise<Product | null> {
    return await this.productRepository.createProduct({ data });
  }

  public async fetchPaginatedProducts(): Promise<Product[]> {
    return await this.productRepository.findManyProducts({
      select: { id: true, price: true, stock: true, name: true },
      orderBy: {
        createdAt: 'desc',
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
    const availableProducts = await this.productRepository.findUniqueProduct({
      where: {
        id: productData.productId,
      },
      select: {
        id: true,
        stock: true,
        price: true,
      },
    });
    return availableProducts;
  }

  public async updateQuantitiesOfProductsById(data: UpdatedStockItem[]) {
    try {
      for (const element of data) {
        await this.productRepository.updateManyProducts({
          where: {
            id: element.id,
          },
          data: {
            stock: element.stock,
          },
        });
      }
      return true;
    } catch (error) {
      return false
    }
 
  }
}
