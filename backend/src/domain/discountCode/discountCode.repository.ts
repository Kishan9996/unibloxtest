import { BaseRepository } from '../../database/base.repository';
import { Prisma, DiscountCode } from '@prisma/client';

export class DiscountCodeRepository extends BaseRepository {
  constructor() {
    super(Prisma.ModelName.DiscountCode);
  }

  public async createDiscountCode(data: Prisma.DiscountCodeCreateArgs): Promise<DiscountCode | null> {
    return await this.prisma.discountCode.create(data);
  }

  public async findManyDiscountCodes(data: Prisma.DiscountCodeFindManyArgs) {
    return await this.prisma.discountCode.findMany(data);
  }

  public async updateDiscountCode(data: Prisma.DiscountCodeUpdateArgs): Promise<DiscountCode | null> {
    return await this.prisma.discountCode.update(data);
  }

  public async findUniqueDiscountCode(data: Prisma.DiscountCodeFindUniqueArgs) {
    return await this.prisma.discountCode.findUnique(data);
  }
}
