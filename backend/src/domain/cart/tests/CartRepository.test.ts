import { PrismaClient, Prisma, Cart } from '@prisma/client';
import { CartRepository } from '../cart.repository';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    cart: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: { ModelName: { Cart: 'Cart' } },
  };
});

describe('CartRepository', () => {
  let cartRepository: CartRepository;
  let prismaClientMock: any;

  beforeEach(() => {
    cartRepository = new CartRepository();
    prismaClientMock = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCart', () => {
    it('should create a new cart', async () => {
      const cartData: Prisma.CartCreateArgs = {
        data: { userId: 'user-123', checkedOut: false },
      };

      const mockCart: Cart = {
        id: 'cart-123',
        userId: 'user-123',
        checkedOut: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.cart.create as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartRepository.createCart(cartData);

      expect(prismaClientMock.cart.create).toHaveBeenCalledWith(cartData);
      expect(result).toEqual(mockCart);
    });
  });

  describe('updateCart', () => {
    it('should update an existing cart', async () => {
      const cartData: Prisma.CartUpdateArgs = {
        where: { id: 'cart-123' },
        data: { checkedOut: true },
      };

      const mockCart: Cart = {
        id: 'cart-123',
        userId: 'user-123',
        checkedOut: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.cart.update as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartRepository.updateCart(cartData);

      expect(prismaClientMock.cart.update).toHaveBeenCalledWith(cartData);
      expect(result).toEqual(mockCart);
    });
  });

  describe('findCartByUserId', () => {
    it('should find the first cart by userId that is not checked out', async () => {
      const userId = 'user-123';

      const mockCart = {
        id: 'cart-123',
        userId: 'user-123',
        checkedOut: false,
        items: [],
      };

      (prismaClientMock.cart.findFirst as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartRepository.findCartByUserId(userId);

      expect(prismaClientMock.cart.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          checkedOut: false,
        },
        select: {
          items: true,
          id: true,
          checkedOut: true,
          userId: true,
        },
      });
      expect(result).toEqual(mockCart);
    });
  });

  describe('findUniqueCart', () => {
    it('should find a unique cart by criteria', async () => {
      const criteria: Prisma.CartFindFirstArgs = {
        where: { id: 'cart-123' },
      };

      const mockCart = {
        id: 'cart-123',
        userId: 'user-123',
        checkedOut: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.cart.findFirst as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartRepository.findUniqueCart(criteria);

      expect(prismaClientMock.cart.findFirst).toHaveBeenCalledWith(criteria);
      expect(result).toEqual(mockCart);
    });
  });
});
