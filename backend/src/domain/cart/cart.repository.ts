import { BaseRepository } from '../../database/base.repository';
import { Prisma, Cart } from '@prisma/client';

export class CartRepository extends BaseRepository {
  constructor() {
    super(Prisma.ModelName.Cart);
  }

  /**
   * CartRepository extends the BaseRepository to provide database operations
   * specific to the Cart model. It includes methods for creating a new cart
   * in the database using Prisma ORM.
   */
  public async createCart(data: Prisma.CartCreateArgs): Promise<Cart | null> {
    return await this.prisma.cart.create(data);
  }
  public async findCartByUserId(userId: string): Promise<Cart | null> {
    return await this.prisma.cart.findFirst({
      where: {
        userId,
      },
    });
  }

  public async findUniqueCart(id: string, userId: string) {
    return await this.prisma.cart.findUnique({
      where: {
        id,
        userId,
      },
    });
  }
}
