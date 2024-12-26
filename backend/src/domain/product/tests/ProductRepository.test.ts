import { PrismaClient, Prisma, Product } from '@prisma/client';
import { ProductRepository } from '../product.repository';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    Prisma: { ModelName: { Product: 'Product' } },
  };
});

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let prismaClientMock: any;

  beforeEach(() => {
    productRepository = new ProductRepository();
    prismaClientMock = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData: Prisma.ProductCreateArgs = {
        data: {
          name: 'Laptop',
          price: 1200.0,
          stock: 10,
        },
      };

      const mockProduct: Product = {
        id: 'product-123',
        name: 'Laptop',
        price: 1200.0,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.createProduct(productData);

      expect(prismaClientMock.product.create).toHaveBeenCalledWith(productData);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findManyProducts', () => {
    it('should find many products', async () => {
      const findManyArgs: Prisma.ProductFindManyArgs = {
        where: { stock: { gt: 0 } },
      };

      const mockProducts: Product[] = [
        {
          id: 'product-123',
          name: 'Laptop',
          price: 1200.0,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prismaClientMock.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productRepository.findManyProducts(findManyArgs);

      expect(prismaClientMock.product.findMany).toHaveBeenCalledWith(findManyArgs);
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findUniqueProduct', () => {
    it('should find a unique product', async () => {
      const findUniqueArgs: Prisma.ProductFindUniqueArgs = {
        where: { id: 'product-123' },
      };

      const mockProduct: Product = {
        id: 'product-123',
        name: 'Laptop',
        price: 1200.0,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.findUniqueProduct(findUniqueArgs);

      expect(prismaClientMock.product.findUnique).toHaveBeenCalledWith(findUniqueArgs);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateManyProducts', () => {
    it('should update a product', async () => {
      const updateArgs: Prisma.ProductUpdateArgs = {
        where: { id: 'product-123' },
        data: { stock: 5 },
      };

      const mockProduct: Product = {
        id: 'product-123',
        name: 'Laptop',
        price: 1200.0,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientMock.product.update as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.updateManyProducts(updateArgs);

      expect(prismaClientMock.product.update).toHaveBeenCalledWith(updateArgs);
      expect(result).toEqual(mockProduct);
    });
  });
});
