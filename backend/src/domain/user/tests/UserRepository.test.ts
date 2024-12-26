import { PrismaClient, Prisma, User } from '@prisma/client';
import { UserRepository } from '../user.repository';
import { PasswordService } from '../../../utils/hashPassword';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const userMock = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };
  const prismaMock = {
    user: userMock,
  };
  return {
    Prisma: { ModelName: { User: 'User' } },
    PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  };
});

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prismaMock: PrismaClient;

  beforeEach(() => {
    userRepository = new UserRepository();
    prismaMock = new PrismaClient();
  });

  it('should find a user by email', async () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
      isLoggedIn: false,
      loginSecrete: null,
      discountApplicationCount: 0,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(user);

    const result = await userRepository.findUserByEmail('john@example.com');
    expect(result).toEqual(user);
  });

  it('should return null if user is not found by email', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await userRepository.findUserByEmail('nonexistent@example.com');
    expect(result).toBeNull();
  });

  it('should create a user with encrypted password', async () => {
    const userCreateInput: Prisma.UserCreateInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'plainpassword',
      role: 'USER',
    };

    const hashedPassword = 'hashedpassword';
    const passwordService = new PasswordService();
    jest.spyOn(passwordService, 'generateHashPassword').mockResolvedValue(hashedPassword);

    const createdUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      isLoggedIn: false,
      loginSecrete: null,
      discountApplicationCount: 0,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prismaMock.user.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await userRepository.createUserWithPasswordEncryption(userCreateInput);
    expect(result?.password).toBe(hashedPassword);
    expect(result).toEqual(createdUser);
  });


  it('should update user details', async () => {
    const userUpdateArgs: Prisma.UserUpdateArgs = {
      where: { id: '1' },
      data: { name: 'Updated Name' },
    };

    const updatedUser: User = {
      id: '1',
      name: 'Updated Name',
      email: 'john@example.com',
      password: 'hashedpassword',
      isLoggedIn: false,
      loginSecrete: null,
      discountApplicationCount: 0,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prismaMock.user.update as jest.Mock).mockResolvedValue(updatedUser);

    const result = await userRepository.updateUser(userUpdateArgs);
    expect(result).toEqual(updatedUser);
  });
});
