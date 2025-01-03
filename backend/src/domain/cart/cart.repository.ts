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

  public async updateCart(data: Prisma.CartUpdateArgs): Promise<Cart | null> {
    return await this.prisma.cart.update(data);
  }
  public async findCartByUserId(userId: string) {
    return await this.prisma.cart.findFirst({
      where: {
        userId,
        checkedOut: false,
      },
      select: {
        items: true,
        id: true,
        checkedOut: true,
        userId: true,
      },
    });
  }

  public async findUniqueCart(data: Prisma.CartFindFirstArgs) {
    return await this.prisma.cart.findFirst(data);
  }
}
