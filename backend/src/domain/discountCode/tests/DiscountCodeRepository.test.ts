import { PrismaClient, Prisma, DiscountCode } from '@prisma/client';
import { DiscountCodeRepository } from '../discountCode.repository';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    discountCode: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: { ModelName: { DiscountCode: 'DiscountCode' } },
  };
});

describe('DiscountCodeRepository', () => {
  let discountCodeRepository: DiscountCodeRepository;
  let prismaClientMock: any;

  beforeEach(() => {
    discountCodeRepository = new DiscountCodeRepository();
    prismaClientMock = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDiscountCode', () => {
    it('should create a new discount code', async () => {
      const discountCodeData: Prisma.DiscountCodeCreateArgs = {
        data: {
          name: 'SUMMER2024',
          userId: 'user-123',
          discountValue: 20.0,
        },
      };

      const mockDiscountCode: DiscountCode = {
        id: 'discountCode-123',
        name: 'SUMMER2024',
        isRedeemed: false,
        isApprovedByAdmin: false,
        orderId: null,
        userId: 'user-123',
        discountValue: 20.0,
        createdAt: new Date(),
      };

      (prismaClientMock.discountCode.create as jest.Mock).mockResolvedValue(mockDiscountCode);

      const result = await discountCodeRepository.createDiscountCode(discountCodeData);

      expect(prismaClientMock.discountCode.create).toHaveBeenCalledWith(discountCodeData);
      expect(result).toEqual(mockDiscountCode);
    });
  });

  describe('findManyDiscountCodes', () => {
    it('should find many discount codes', async () => {
      const findManyArgs: Prisma.DiscountCodeFindManyArgs = {
        where: { userId: 'user-123' },
      };

      const mockDiscountCodes: DiscountCode[] = [
        {
          id: 'discountCode-123',
          name: 'SUMMER2024',
          isRedeemed: false,
          isApprovedByAdmin: false,
          orderId: null,
          userId: 'user-123',
          discountValue: 20.0,
          createdAt: new Date(),
        },
      ];

      (prismaClientMock.discountCode.findMany as jest.Mock).mockResolvedValue(mockDiscountCodes);

      const result = await discountCodeRepository.findManyDiscountCodes(findManyArgs);

      expect(prismaClientMock.discountCode.findMany).toHaveBeenCalledWith(findManyArgs);
      expect(result).toEqual(mockDiscountCodes);
    });
  });

  describe('updateDiscountCode', () => {
    it('should update a discount code', async () => {
      const updateArgs: Prisma.DiscountCodeUpdateArgs = {
        where: { id: 'discountCode-123' },
        data: { isApprovedByAdmin: true },
      };

      const mockDiscountCode: DiscountCode = {
        id: 'discountCode-123',
        name: 'SUMMER2024',
        isRedeemed: false,
        isApprovedByAdmin: true,
        orderId: null,
        userId: 'user-123',
        discountValue: 20.0,
        createdAt: new Date(),
      };

      (prismaClientMock.discountCode.update as jest.Mock).mockResolvedValue(mockDiscountCode);

      const result = await discountCodeRepository.updateDiscountCode(updateArgs);

      expect(prismaClientMock.discountCode.update).toHaveBeenCalledWith(updateArgs);
      expect(result).toEqual(mockDiscountCode);
    });
  });

  describe('findUniqueDiscountCode', () => {
    it('should find a unique discount code', async () => {
      const findUniqueArgs: Prisma.DiscountCodeFindUniqueArgs = {
        where: { id: 'discountCode-123' },
      };

      const mockDiscountCode: DiscountCode = {
        id: 'discountCode-123',
        name: 'SUMMER2024',
        isRedeemed: false,
        isApprovedByAdmin: false,
        orderId: null,
        userId: 'user-123',
        discountValue: 20.0,
        createdAt: new Date(),
      };

      (prismaClientMock.discountCode.findUnique as jest.Mock).mockResolvedValue(mockDiscountCode);

      const result = await discountCodeRepository.findUniqueDiscountCode(findUniqueArgs);

      expect(prismaClientMock.discountCode.findUnique).toHaveBeenCalledWith(findUniqueArgs);
      expect(result).toEqual(mockDiscountCode);
    });
  });
});
