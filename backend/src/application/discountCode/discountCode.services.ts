import { DiscountCodeRepository } from '../../domain/discountCode';
import { DISCOUNT_REP_THRESHOLD } from '../../config';
import { ApproveDiscountCodeSchemaType } from '../../interface/discountCode/schema';
import { UserServices } from '../user/user.services';
import { generateCouponCode } from '../../utils/general';

export class DiscountCodeServices {
  private discountCodeRepository: DiscountCodeRepository;
  private userServices: UserServices;

  constructor() {
    this.discountCodeRepository = new DiscountCodeRepository();
    this.userServices = new UserServices();
  }

  async applyForDiscountCode(user: any) {
    const name = generateCouponCode();
    return await this.discountCodeRepository.createDiscountCode({
      data: {
        userId: user.id,
        name,
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
    const result: any = await this.discountCodeRepository.findManyDiscountCodes({
      where: whereClaus,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        isRedeemed: true,
        discountValue: true,
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
    return result.map((item: any) => ({
      ...item,
      isApproval: item.user.discountApplicationCount >= DISCOUNT_REP_THRESHOLD,
    }));
  }

  async fetchDiscountCodesWithUserForAdmin() {
    return await this.fetchDiscountCodesWithUser({});
  }
  async fetchDiscountCodesWithUsersForUser(user: any) {
    return await this.fetchDiscountCodesWithUser({
      userId: user.id,
      isRedeemed: false,
      isApprovedByAdmin: true,
    });
  }
  async approveForDiscountCode(data: ApproveDiscountCodeSchemaType) {
    const { userId, id } = data;
    const user = await this.userServices.findUserById(userId);

    const discountCode = await this.discountCodeRepository.findUniqueDiscountCode({
      where: {
        id,
        isRedeemed: false,
        isApprovedByAdmin: false,
      },
    });
    if (discountCode && user && user.discountApplicationCount >= DISCOUNT_REP_THRESHOLD) {
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
