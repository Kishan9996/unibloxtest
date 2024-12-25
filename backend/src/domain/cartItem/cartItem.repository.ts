import { BaseRepository } from '../../database/base.repository';
import { Prisma } from '@prisma/client';
export class CartItemRepository extends BaseRepository {
  constructor() {
    super(Prisma.ModelName.CartItem);
  }

  public async createManyCartItem(data: Prisma.CartItemCreateManyArgs): Promise<Prisma.BatchPayload> {
    return await this.prisma.cartItem.createMany(data);
  }
}
