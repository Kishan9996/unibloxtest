import { DiscountCodeRepository } from '../../domain/discountCode';
import { DISCOUNT_REP_THRESHOLD } from '../../config';
import { ApproveDiscountCodeSchemaType } from '../../interface/discountCode/schema';
import { UserServices } from '../user/user.services';

export class DiscountCodeServices {
  private discountCodeRepository: DiscountCodeRepository;
  private userServices: UserServices;

  constructor() {
    this.discountCodeRepository = new DiscountCodeRepository();
    this.userServices = new UserServices();
  }

  async applyForDiscountCode() {
    return await this.discountCodeRepository.createDiscountCode({});
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
