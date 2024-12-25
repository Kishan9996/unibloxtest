import { DiscountCodeRepository } from '../../domain/discountCode';
import { DISCOUNT_REP_THRESHOLD } from '../../config';
import { ApproveDiscountCodeSchemaType } from '../../interface/discountCode/schema';
import { UserServices } from '../user/user.services';
import { User } from '@prisma/client';
import { RoleType } from '../../utils/dto/general';

export class DiscountCodeServices {
  private discountCodeRepository: DiscountCodeRepository;
  private userServices: UserServices;

  constructor() {
    this.discountCodeRepository = new DiscountCodeRepository();
    this.userServices = new UserServices();
  }

  async applyForDiscountCode(user: any) {
    return await this.discountCodeRepository.createDiscountCode({
      data: {
        userId: user.id,
      },
    });
  }

  async fetchApprovedAndNotRedeemedDiscountCodeByUser(id: string) {
    return await this.discountCodeRepository.findUniqueDiscountCode({
      where: {
        id,
        isApprovedByAdmin: true,
        isRedeemed: false,
      },
    });
  }

  async redeemDiscountCode(id: string) {
    return await this.discountCodeRepository.updateDiscountCode({
      where: {
        id,
      },
      data: {
        isRedeemed: true,
      },
    });
  }

  async fetchDiscountCodesWithUser(whereClaus: Record<any, any>) {
    return await this.discountCodeRepository.findManyDiscountCodes({
      where: whereClaus,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        isRedeemed: true,
        isApprovedByAdmin: true,
        user: {
          select: {
            id: true,
            name: true,
            discountApplicationCount: true,
          },
        },
      },
    });
  }

  async fetchDiscountCodesWithUserForAdmin() {
    return await this.fetchDiscountCodesWithUser({});
  }
  async fetchDiscountCodesWithUsersForUser(user: any) {
    return await this.fetchDiscountCodesWithUser({
      userId: user.id,
      isRedeemed: false,
    });
  }
  async approveForDiscountCode(data: ApproveDiscountCodeSchemaType) {
    const { userId, id } = data;
    
    const user = await this.userServices.findUserById(userId);
    console.log(user);
    const discountCode = await this.discountCodeRepository.findUniqueDiscountCode({
      where: {
        id,
        isRedeemed: false,
        isApprovedByAdmin: false,
      },
    });
    if (user && user.discountApplicationCount >= DISCOUNT_REP_THRESHOLD && discountCode) {
      return await this.discountCodeRepository.updateDiscountCode({
        where: {
          id,
        },
        data: {
          isApprovedByAdmin: true,
        },
      });
    }
    return null;
  }
}
