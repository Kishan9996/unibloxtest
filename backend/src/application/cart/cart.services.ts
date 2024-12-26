import { Cart, Product, User } from '@prisma/client';
import { CartRepository } from '../../domain/cart';
import {
  CheckOutSchemaType,
  ProductAddTOCartSchemaType,
  ProductRemoveTOCartSchemaType,
  UpdateCartItemSchemaType,
} from '../../interface/cart/schema';
import { ProductServices } from '../product';
import { CartItemRepository } from '../../domain/cartItem';
import { OrderRepository } from '../../domain/order';
import { DiscountCodeServices } from '../discountCode';
import { UserServices } from '../user';
import { DISCOUNT_REP_THRESHOLD } from '../../config';
type StockItem = {
  id: string;
  stock: number;
};

type ProductItem = {
  productId: string;
  quantity: number;
};

export type UpdatedStockItem = {
  id: string;
  stock: number;
};

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

  public async createCart(userId: string) {
    const availableCart = await this.cartRepository.findCartByUserId(userId);
    if (availableCart) {
      return availableCart;
    }
    return await this.cartRepository.createCart({
      data: {
        userId,
      },
      select: {
        items: true,
        id: true,
        checkedOut: true,
        userId: true,
      },
    });
  }

  public updateStock(stockArray: StockItem[], productArray: ProductItem[]): UpdatedStockItem[] {
    return stockArray.map((stockItem) => {
      // Find the matching product for the current stock item
      const product = productArray.find((p) => p.productId === stockItem.id);

      if (product) {
        // Subtract quantity from stock if a match is found
        const updatedStock: UpdatedStockItem = {
          id: stockItem.id,
          stock: stockItem.stock - product.quantity,
        };
        return updatedStock;
      } else {
        // No matching productId, return the original stock item
        return { id: stockItem.id, stock: stockItem.stock };
      }
    });
  }
  public async fetchUserCart(userId: string, cartId: string): Promise<Cart | null> {
    const cart = await this.cartRepository.findUniqueCart({
      where: {
        id: cartId,
        userId,
        checkedOut: false,
      },
      select: {
        id: true,
        userId: true,
        items: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });
    return cart;
  }

  public async createCartItem(cartId: string, cartData: ProductAddTOCartSchemaType, product: Product) {
    const getExistingCartItem = await this.cartItemRepository.findUniqueCartItem({
      where: {
        cartId,
        productId: product.id,
      },
    });
    let totalQuantity = cartData.quantity;
    let totalPrice = product.price * cartData.quantity;
    if (getExistingCartItem) {
      totalQuantity = totalQuantity + getExistingCartItem.quantity;
      totalPrice = totalPrice + getExistingCartItem.price;
      return await this.cartItemRepository.updateCartItem({
        where: {
          id: getExistingCartItem.id,
          cartId,
          productId: product.id,
        },
        data: {
          price: totalPrice,
          quantity: totalQuantity,
        },
      });
    }
    return await this.cartItemRepository.createCartItem({
      data: {
        cartId,
        productId: cartData.productId,
        price: totalPrice,
        quantity: totalQuantity,
      },
    });
  }

  public async addToCart(cartData: ProductAddTOCartSchemaType, user: any) {
    const areProductWithQuantityAvailable = await this.productService.checkProductsAndQuantityAvailable(cartData);
    const userCart: any = await this.createCart(user.id);
    const cartItem = userCart.items.find((item: any) => item.productId === cartData.productId);
    if (
      areProductWithQuantityAvailable &&
      cartItem &&
      cartItem.quantity + cartData.quantity > areProductWithQuantityAvailable?.stock
    ) {
      return null;
    }
    if (areProductWithQuantityAvailable && userCart) {
      const addedCartData = await this.createCartItem(userCart.id, cartData, areProductWithQuantityAvailable);
      return addedCartData;
    }
    return null;
  }

  public async removeToCart(cartData: ProductRemoveTOCartSchemaType, user: any) {
    const userCart: any = await this.createCart(user.id);
    const cartItem = userCart.items.find((item: any) => item.id === cartData.cartItemId);
    if (cartItem) {
      return await this.cartItemRepository.deleteCartItem({
        where: {
          id: cartData.cartItemId,
        },
      });
    }
    return null;
  }

  public async updateQuantityToCartItem(cartData: UpdateCartItemSchemaType, user: any) {
    const userCart: any = await this.createCart(user.id);
    const cartItem = userCart.items.find((item: any) => item.id === cartData.cartItemId);
    if (cartItem) {
      const areProductWithQuantityAvailable = await this.productService.checkProductsAndQuantityAvailable({
        productId: cartItem.productId,
        quantity: 0,
      });
      if (areProductWithQuantityAvailable) {
        return await this.cartItemRepository.updateCartItem({
          where: {
            id: cartData.cartItemId,
            cartId: userCart.id,
          },
          data: {
            quantity: cartData.quantity,
            price: cartData.quantity * areProductWithQuantityAvailable?.price,
          },
        });
      }
    }
    return null;
  }

  public async getCartWithItems(user: any) {
    return await this.cartRepository.findUniqueCart({
      where: {
        userId: user.id,
        checkedOut: false,
      },
      select: {
        id: true,
        userId: true,
        items: {
          select: {
            id: true,
            price: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
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
    const userCart: any = await this.fetchUserCart(user.id, checkOutData.cartId);
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
          orderCreateArgs = {
            ...orderCreateArgs,
            discountCodeId: discountCode.id,
            amountAfterDiscount: discountedPrice,
          };
        }
      }
      // disable cart
      await this.checkOutCartOfUser(checkOutData.cartId);

      // update  discount applicable count by comparing the previous count matches with threshold otherwise reset
      const discountApplicationCount =
        user.discountApplicationCount >= DISCOUNT_REP_THRESHOLD ? 0 : user.discountApplicationCount + 1;

      await this.userService.updateUserDetails({
        where: {
          id: user.id,
        },
        data: {
          discountApplicationCount,
        },
      });

      // update quantities of each products which are in cart
      const existingProductsQuantities: any = await this.productService.findProductsById(
        userCart.items.map((item: any) => item.productId)
      );

      const updatedStocks = this.updateStock(existingProductsQuantities, userCart.items);
      await this.productService.updateQuantitiesOfProductsById(updatedStocks);
      // create order
      return await this.orderRepository.createOrder({
        data: orderCreateArgs,
      });
    }
    return null;
  }

  async clearCartItems(cartId: string, userId: string) {
    const userCart: any = await this.fetchUserCart(userId, cartId);
    if (!userCart) {
      return null;
    }
    return await this.cartItemRepository.deleteManyCartItems({
      where: {
        cartId,
      },
    });
  }
}
