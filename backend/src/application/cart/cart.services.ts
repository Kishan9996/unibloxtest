import { Cart, Product } from '@prisma/client';
import { CartRepository } from '../../domain/cart';
import { CheckOutSchemaType, ProductAddTOCartSchemaType } from '../../interface/cart/schema';
import { ProductServices } from '../product';
import { CartItemRepository } from '../../domain/cartItem';
import { OrderRepository } from '../../domain/order';
import { DiscountCodeServices } from '../discountCode';

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
  private discountCodeService: DiscountCodeServices;

  constructor() {
    this.cartRepository = new CartRepository();
    this.cartItemRepository = new CartItemRepository();
    this.orderRepository = new OrderRepository();

    this.productService = new ProductServices();
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
  public async checkoutCart(checkOutData: CheckOutSchemaType, userId: string) {
    const userCart: any = await this.fetchUserCart(checkOutData.cartId, userId);
    if (userCart) {
      const totalAmount = userCart.items.reduce((acc: any, product: any) => acc + product.price, 0);
      let orderCreateArgs: any = {
        userId,
        totalAmount,
        cartId: checkOutData.cartId,
      };
      if (checkOutData.discountCodeId) {
        const discountCode = await this.discountCodeService.fetchApprovedAndNotRedeemedDiscountCodeByUser(
          checkOutData.discountCodeId
        );
        if (discountCode) {
          orderCreateArgs = { ...orderCreateArgs, discountCodeId: discountCode.id };
        }
      }
      // disable cart
      await this.checkOutCartOfUser(checkOutData.cartId);
      return await this.orderRepository.createOrder({
        data: orderCreateArgs,
      });
    }
    return null;
  }
}
