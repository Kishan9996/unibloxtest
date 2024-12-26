import { CartServices } from '../cart.services';
import { CartRepository } from '../../../domain/cart';
import { CartItemRepository } from '../../../domain/cartItem';
import { OrderRepository } from '../../../domain/order';
import { ProductServices } from '../../product';
import { DiscountCodeServices } from '../../discountCode';
import { UserServices } from '../../user';

// Mocking dependencies
jest.mock('../../../domain/cart');
jest.mock('../../../domain/cartItem');
jest.mock('../../../domain/order');
jest.mock('../../product');
jest.mock('../../discountCode');
jest.mock('../../user');
describe('CartServices', () => {
  let cartServices: CartServices;
  let cartRepositoryMock: jest.Mocked<CartRepository>;
  let cartItemRepositoryMock: jest.Mocked<CartItemRepository>;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let productServiceMock: jest.Mocked<ProductServices>;
  let discountCodeServiceMock: jest.Mocked<DiscountCodeServices>;
  let userServiceMock: jest.Mocked<UserServices>;

  beforeEach(() => {
    // Mock the repository methods
    cartRepositoryMock = {
      findCartByUserId: jest.fn(),
      createCart: jest.fn(),
      findUniqueCart: jest.fn(),
    } as unknown as jest.Mocked<CartRepository>;

    cartItemRepositoryMock = {
      findUniqueCartItem: jest.fn(),
      createCartItem: jest.fn(),
    } as unknown as jest.Mocked<CartItemRepository>;

    orderRepositoryMock = {} as jest.Mocked<OrderRepository>;
    productServiceMock = {} as jest.Mocked<ProductServices>;
    discountCodeServiceMock = {} as jest.Mocked<DiscountCodeServices>;
    userServiceMock = {} as jest.Mocked<UserServices>;

    cartServices = new CartServices();
  });

  it('should create a new cart if none exists for user', async () => {
    const userId = '1';

    // Ensure that `findCartByUserId` returns null, indicating no cart exists
    cartRepositoryMock.findCartByUserId.mockResolvedValue(null);

    // Mock the `createCart` method to return a newly created cart
    const createdCart = {
      id: '1',
      userId,
      checkedOut: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    cartRepositoryMock.createCart.mockResolvedValue(createdCart);

    // Test the method
    const cart = await cartServices.createCart(userId);

    // Validate that the cart has the expected properties
    expect(cart).toHaveProperty('id', '1');
    expect(cartRepositoryMock.createCart).toHaveBeenCalledWith({
      data: { userId },
      select: { items: true, id: true, checkedOut: true, userId: true },
    });
  });

  it('should return existing cart if already exists', async () => {
    const userId = '1';
    const existingCart = {
      id: '1',
      userId,
      items: [],
      checkedOut: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ensure that `findCartByUserId` returns the existing cart
    cartRepositoryMock.findCartByUserId.mockResolvedValue(existingCart);

    // Test the method
    const cart = await cartServices.createCart(userId);

    // Validate that the existing cart is returned
    expect(cart).toEqual(existingCart);
  });

  it('should fetch user cart', async () => {
    const userId = '1';
    const cartId = '1';

    const cart = {
      id: '1',
      userId,
      checkedOut: false,
      items: [{ price: 100, quantity: 1, productId: 'prod1' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock `findUniqueCart` to return a valid cart
    cartRepositoryMock.findUniqueCart.mockResolvedValue(cart);

    // Test the method
    const fetchedCart = await cartServices.fetchUserCart(userId, cartId);

    // Validate the fetched cart
    expect(fetchedCart).toEqual(cart);
  });

  it('should create a cart item', async () => {
    const cartId = '1';
    const cartData = { productId: 'prod1', quantity: 1 };

    const product = {
      id: 'prod1',
      price: 100,
      name: 'Product 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      stock: 10,
    };

    const newCartItem = {
      id: '1',
      cartId,
      productId: 'prod1',
      price: 100,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mock `findUniqueCartItem` to return null (no item exists yet)
    cartItemRepositoryMock.findUniqueCartItem.mockResolvedValue(null);

    // Mock `createCartItem` to return the newly created cart item
    cartItemRepositoryMock.createCartItem.mockResolvedValue(newCartItem);

    // Test the method
    const cartItem = await cartServices.createCartItem(cartId, cartData, product);

    // Validate the created cart item
    expect(cartItem).toEqual(newCartItem);
  });
});
