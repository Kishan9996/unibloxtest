import { BaseRepository } from '../../database/base.repository';
import { Prisma, Order } from '@prisma/client';

export class OrderRepository extends BaseRepository {
  constructor() {
    super(Prisma.ModelName.Order);
  }

  async createOrder(args: Prisma.OrderCreateArgs) {
    return await this.prisma.order.create(args);
  }
}
