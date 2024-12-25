import { BaseRepository } from '../../database/base.repository';
import { Prisma } from '@prisma/client';
export class CartItemRepository extends BaseRepository {
  constructor() {
    super(Prisma.ModelName.CartItem);
  }

  public async createCartItem(data: Prisma.CartItemCreateArgs) {
    return await this.prisma.cartItem.create(data);
  }

  public async deleteCartItem(data: Prisma.CartItemDeleteArgs) {
    return await this.prisma.cartItem.delete(data);
  }

  public async findUniqueCartItem(data: Prisma.CartItemFindUniqueArgs) {
    return await this.prisma.cartItem.findUnique(data);
  }

  public async updateCartItem(data: Prisma.CartItemUpdateArgs) {
    return await this.prisma.cartItem.update(data);
  }
}
