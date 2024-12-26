import { DiscountCodeServices } from '../discountCode.services';

describe('DiscountCodeServices', () => {
  // Successfully create new discount code with generated coupon name for user
  it('should create discount code with generated coupon name when user applies for discount', async () => {
    const mockUser = { id: 'user-123' };

    const mockGeneratedCode = 'ABC123';

    jest.spyOn(require('../../../utils/general'), 'generateCouponCode').mockReturnValue(mockGeneratedCode);

    const discountCodeServices = new DiscountCodeServices();

    const mockCreatedCode: any = {
      id: 'discount-123',
      name: mockGeneratedCode,
      userId: mockUser.id,
    };

    jest.spyOn(discountCodeServices['discountCodeRepository'], 'createDiscountCode').mockResolvedValue(mockCreatedCode);

    const result = await discountCodeServices.applyForDiscountCode(mockUser);

    expect(result).toEqual(mockCreatedCode);

    expect(discountCodeServices['discountCodeRepository'].createDiscountCode).toHaveBeenCalledWith({
      data: {
        userId: mockUser.id,
        name: mockGeneratedCode,
      },
    });
  });

  // Attempt to redeem already redeemed discount code
  it('should return null when attempting to redeem an already redeemed discount code', async () => {
    const discountCodeId = 'discount-123';

    const discountCodeServices = new DiscountCodeServices();

    jest.spyOn(discountCodeServices['discountCodeRepository'], 'findUniqueDiscountCode').mockResolvedValue({
      id: discountCodeId,
      isRedeemed: true,
      isApprovedByAdmin: true,
    } as any);

    const result = await discountCodeServices.fetchApprovedAndNotRedeemedDiscountCodeByUser(discountCodeId);

    expect(result).toBeNull;

    expect(discountCodeServices['discountCodeRepository'].findUniqueDiscountCode).toHaveBeenCalledWith({
      where: {
        id: discountCodeId,
        isApprovedByAdmin: true,
        isRedeemed: false,
      },
    });
  });
});
