import { PrismaClient, Prisma, Order } from '@prisma/client';
import { OrderRepository } from '../order.repository';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    order: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: { ModelName: { Order: 'Order' } },
  };
});

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;
  let prismaClientMock: any;

  beforeEach(() => {
    orderRepository = new OrderRepository();
    prismaClientMock = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const orderData: Prisma.OrderCreateArgs = {
        data: {
          userId: 'user-123',
          cartId: 'cart-123',
          totalAmount: 100.0,
          amountAfterDiscount: 90.0,
          discountCodeId: 'discountCode-123',
        },
      };

      const mockOrder: Order = {
        id: 'order-123',
        userId: 'user-123',
        cartId: 'cart-123',
        totalAmount: 100.0,
        amountAfterDiscount: 90.0,
        discountCodeId: 'discountCode-123',
        createdAt: new Date(),
      };

      (prismaClientMock.order.create as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderRepository.createOrder(orderData);

      expect(prismaClientMock.order.create).toHaveBeenCalledWith(orderData);
      expect(result).toEqual(mockOrder);
    });
  });
});
