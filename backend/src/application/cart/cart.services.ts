import { Cart } from '@prisma/client';
import { CartRepository } from '../../domain/cart';
import { ProductAddTOCartSchemaType } from '../../interface/cart/schema';
import { ProductServices } from '../product';
import { CartItemRepository } from '../../domain/cartItem';
import { OrderRepository } from '../../domain/order';

export class CartServices {
  private cartRepository: CartRepository;
  private cartItemRepository: CartItemRepository;
  private orderRepository: OrderRepository;

  private productService: ProductServices;

  constructor() {
    this.cartRepository = new CartRepository();
    this.cartItemRepository = new CartItemRepository();
    this.orderRepository = new OrderRepository();

    this.productService = new ProductServices();
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
    return await this.cartRepository.findUniqueCart(cartId, userId);
  }
  public async createCartItems(cartId: string, cartData: ProductAddTOCartSchemaType) {
    return await this.cartItemRepository.createManyCartItem({
      data: cartData.map((item) => ({ ...item, cartId })),
    });
  }

  public async addToCart(cartData: ProductAddTOCartSchemaType, user: any) {
    // return await this.cartRepository.createCart({ data });
    const userCart = await this.createCart(user.id);
    const areProductWithQuantityAvailable = await this.productService.checkProductsAndQuantityAvailable(cartData);
    if (areProductWithQuantityAvailable && userCart) {
      const addedCartData = await this.createCartItems(userCart.id, cartData);
      return addedCartData;
    }
    return null;
  }

  public async checkoutCart(cartId: string, user: any) {
    const userCart = await this.fetchUserCart(cartId, user.id);
    if (userCart) {
      await this.orderRepository
      return userCart;
    }
  }
}
