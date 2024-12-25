import { Cart, Product, User } from '@prisma/client';
import { CartRepository } from '../../domain/cart';
import { CheckOutSchemaType, ProductAddTOCartSchemaType } from '../../interface/cart/schema';
import { ProductServices } from '../product';
import { CartItemRepository } from '../../domain/cartItem';
import { OrderRepository } from '../../domain/order';
import { DiscountCodeServices } from '../discountCode';
import { UserServices } from '../user';
import { DISCOUNT_REP_THRESHOLD } from '../../config';

interface ProductInfo {
  productId: string;
  quantity: number;
  price: number;
}
export class CartServices {
  private cartRepository: CartRepository;
  private cartItemRepository: CartItemRepository;
  private orderRepository: OrderRepository;

  private productService: ProductServices;
  private userService: UserServices;

  private discountCodeService: DiscountCodeServices;

  constructor() {
    this.cartRepository = new CartRepository();
    this.cartItemRepository = new CartItemRepository();
    this.orderRepository = new OrderRepository();

    this.productService = new ProductServices();
    this.userService = new UserServices();

    this.discountCodeService = new DiscountCodeServices();
  }

  public async createCart(userId: string): Promise<Cart | null> {
    const availableCart = await this.cartRepository.findCartByUserId(userId);
    if (availableCart) {
      return availableCart;
    }
    return await this.cartRepository.createCart({
      data: {
        userId,
      },
    });
  }

  public async fetchUserCart(userId: string, cartId: string): Promise<Cart | null> {
    return await this.cartRepository.findUniqueCart({
      where: {
        userId,
        id: cartId,
        checkedOut: false,
      },
      select: {
        id: true,
        userId: true,
        items: {
          select: {
            price: true,
          },
        },
      },
    });
  }

  public async createCartItems(cartId: string, cartData: ProductAddTOCartSchemaType, products: Product[]) {
    const totalPrices = this.combineProductData(cartData, products);
    return await this.cartItemRepository.createManyCartItem({
      data: totalPrices.map((item) => ({ ...item, cartId, price: item.price })),
    });
  }

  combineProductData(quantities: ProductAddTOCartSchemaType, prices: Product[]): ProductInfo[] {
    const priceMap = new Map<string, number>();
    // Map prices by productId (id in the price array)
    prices.forEach((product) => {
      priceMap.set(product.id, product.price);
    });

    // Combine quantity and price information
    return quantities.map((quantity) => {
      const price = priceMap.get(quantity.productId) || 0; // Default to 0 if no price found
      return {
        productId: quantity.productId,
        quantity: quantity.quantity,
        price: price * quantity.quantity,
      };
    });
  }

  public async addToCart(cartData: ProductAddTOCartSchemaType, user: any) {
    // return await this.cartRepository.createCart({ data });
    const userCart = await this.createCart(user.id);
    const areProductWithQuantityAvailable = await this.productService.checkProductsAndQuantityAvailable(cartData);
    if (areProductWithQuantityAvailable.length && userCart) {
      const addedCartData = await this.createCartItems(userCart.id, cartData, areProductWithQuantityAvailable);
      return addedCartData;
    }
    return null;
  }

  async checkOutCartOfUser(id: string) {
    return await this.cartRepository.updateCart({
      where: {
        id,
      },
      data: {
        checkedOut: true,
      },
    });
  }

  applyDiscount(totalPrice: number, discountPercentage: number): number {
    const discountAmount = totalPrice * (discountPercentage / 100);
    const discountedPrice = totalPrice - discountAmount;
    return discountedPrice;
  }

  public async checkoutCart(checkOutData: CheckOutSchemaType, user: User) {
    const userCart: any = await this.fetchUserCart(checkOutData.cartId, user.id);
    if (userCart) {
      const totalAmount = userCart.items.reduce((acc: any, product: any) => acc + product.price, 0);
      let orderCreateArgs: any = {
        userId: user.id,
        totalAmount,
        cartId: checkOutData.cartId,
      };

      // check for discount code
      if (checkOutData.discountCodeId) {
        const discountCode = await this.discountCodeService.fetchApprovedAndNotRedeemedDiscountCodeByUser(
          checkOutData.discountCodeId
        );
        if (discountCode) {
          // create discounted price
          const discountedPrice = this.applyDiscount(totalAmount, discountCode.discountValue);
          // redeem discount code
          await this.discountCodeService.redeemDiscountCode(discountCode.id);
          orderCreateArgs = { ...orderCreateArgs, discountCodeId: discountCode.id, totalAmount: discountedPrice };
        }
      }
      // disable cart
      await this.checkOutCartOfUser(checkOutData.cartId);

      // update  discount applicable count by comparing the previous count matches with threshold otherwise reset
      const discountApplicationCount =
        user.discountApplicationCount === DISCOUNT_REP_THRESHOLD ? 0 : user.discountApplicationCount + 1;

      await this.userService.updateUserDetails({
        where: {
          id: user.id,
        },
        data: {
          discountApplicationCount,
        },
      });

      // create order
      return await this.orderRepository.createOrder({
        data: orderCreateArgs,
      });
    }
    return null;
  }
}
