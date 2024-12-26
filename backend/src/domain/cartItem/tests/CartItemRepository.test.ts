import { PrismaClient, Prisma, CartItem } from '@prisma/client';
import { CartItemRepository } from '../cartItem.repository';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    cartItem: {
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: { ModelName: { CartItem: 'CartItem' } },
  };
});

describe('CartItemRepository', () => {
  let cartItemRepository: CartItemRepository;
  let prismaClientMock: any;

  beforeEach(() => {
    cartItemRepository = new CartItemRepository();
    prismaClientMock = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCartItem', () => {
    it('should create a new cart item', async () => {
      const cartItemData: Prisma.CartItemCreateArgs = {
        data: {
          cartId: 'cart-123',
          productId: 'product-123',
          price: 100,
          quantity: 2,
        },
      };

      const mockCartItem: CartItem = {
        id: 'cartItem-123',
        cartId: 'cart-123',
        productId: 'product-123',
        price: 100,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.cartItem.create as jest.Mock).mockResolvedValue(mockCartItem);

      const result = await cartItemRepository.createCartItem(cartItemData);

      expect(prismaClientMock.cartItem.create).toHaveBeenCalledWith(cartItemData);
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('deleteCartItem', () => {
    it('should delete a cart item', async () => {
      const deleteArgs: Prisma.CartItemDeleteArgs = {
        where: { id: 'cartItem-123' },
      };

      const mockCartItem: CartItem = {
        id: 'cartItem-123',
        cartId: 'cart-123',
        productId: 'product-123',
        price: 100,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.cartItem.delete as jest.Mock).mockResolvedValue(mockCartItem);

      const result = await cartItemRepository.deleteCartItem(deleteArgs);

      expect(prismaClientMock.cartItem.delete).toHaveBeenCalledWith(deleteArgs);
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('deleteManyCartItems', () => {
    it('should delete many cart items', async () => {
      const deleteManyArgs: Prisma.CartItemDeleteManyArgs = {
        where: { cartId: 'cart-123' },
      };

      const mockDeleteResult = { count: 3 };

      (prismaClientMock.cartItem.deleteMany as jest.Mock).mockResolvedValue(mockDeleteResult);

      const result = await cartItemRepository.deleteManyCartItems(deleteManyArgs);

      expect(prismaClientMock.cartItem.deleteMany).toHaveBeenCalledWith(deleteManyArgs);
      expect(result).toEqual(mockDeleteResult);
    });
  });

  describe('findUniqueCartItem', () => {
    it('should find a unique cart item', async () => {
      const findArgs: Prisma.CartItemFindFirstArgs = {
        where: { id: 'cartItem-123' },
      };

      const mockCartItem: CartItem = {
        id: 'cartItem-123',
        cartId: 'cart-123',
        productId: 'product-123',
        price: 100,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.cartItem.findFirst as jest.Mock).mockResolvedValue(mockCartItem);

      const result = await cartItemRepository.findUniqueCartItem(findArgs);

      expect(prismaClientMock.cartItem.findFirst).toHaveBeenCalledWith(findArgs);
      expect(result).toEqual(mockCartItem);
    });
  });

  describe('updateCartItem', () => {
    it('should update a cart item', async () => {
      const updateArgs: Prisma.CartItemUpdateArgs = {
        where: { id: 'cartItem-123' },
        data: { quantity: 5 },
      };

      const mockCartItem: CartItem = {
        id: 'cartItem-123',
        cartId: 'cart-123',
        productId: 'product-123',
        price: 100,
        quantity: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.cartItem.update as jest.Mock).mockResolvedValue(mockCartItem);

      const result = await cartItemRepository.updateCartItem(updateArgs);

      expect(prismaClientMock.cartItem.update).toHaveBeenCalledWith(updateArgs);
      expect(result).toEqual(mockCartItem);
    });
  });
});
