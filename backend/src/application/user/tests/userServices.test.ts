import { PrismaClient, User } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { PasswordService } from '../../../utils/hashPassword';
import { UserServices } from '../user.services';
import { UserRepository } from '../../../domain/user';
import { UserWithoutPassword } from '../../../domain/user/types';

jest.mock('../../utils/hashPassword');

const prisma = mockDeep<PrismaClient>();
const userRepository = mockDeep<UserRepository>();
const passwordService = new PasswordService();
const userServices = new UserServices();

describe('UserServices', () => {
  beforeEach(() => {
    mockReset(prisma);
    mockReset(userRepository);
  });

  describe('getUserByEmailAndPassword', () => {
    it('should return user if credentials are correct', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'USER',
        isLoggedIn: false,
      };

      userRepository.getUserByEmailAndPassword = jest.fn().mockResolvedValue(mockUser);

      const user = await userServices.getUserByEmailAndPassword('test@example.com', 'password');

      expect(user).toEqual(mockUser);
      expect(userRepository.getUserByEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('should return null if credentials are incorrect', async () => {
      userRepository.getUserByEmailAndPassword = jest.fn().mockResolvedValue(null);

      const user = await userServices.getUserByEmailAndPassword('test@example.com', 'wrongPassword');

      expect(user).toBeNull();
      expect(userRepository.getUserByEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'wrongPassword');
    });
  });

  describe('updateUserLoggedInDetails', () => {
    it('should update user logged-in status and return updated user', async () => {
      const userId = '1';
      const data = { email: 'updated-email@example.com' };
      const mockUpdatedUser: UserWithoutPassword = {
        id: '1',
        email: 'updated-email@example.com',
        role: 'USER',
        isLoggedIn: true,
      };

      userRepository.updateUser = jest.fn().mockResolvedValue(mockUpdatedUser);

      const updatedUser = await userServices.updateUserLoggedInDetails(userId, data);

      expect(updatedUser).toEqual(mockUpdatedUser);
      expect(userRepository.updateUser).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          ...data,
          isLoggedIn: true,
        },
      });
    });

    it('should return null if update fails', async () => {
      const userId = '1';
      const data = { email: 'updated-email@example.com' };

      userRepository.updateUser = jest.fn().mockResolvedValue(null);

      const updatedUser = await userServices.updateUserLoggedInDetails(userId, data);

      expect(updatedUser).toBeNull();
      expect(userRepository.updateUser).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          ...data,
          isLoggedIn: true,
        },
      });
    });
  });

  describe('setLoginUser', () => {
    it('should set user as logged in and return updated user', async () => {
      const userId = '1';
      const data = { email: 'user@example.com' };
      const mockUpdatedUser: UserWithoutPassword = {
        id: '1',
        email: 'user@example.com',
        role: 'USER',
        isLoggedIn: true,
      };

      // Mock the `updateUserLoggedInDetails` method to return the updated user
      userServices.updateUserLoggedInDetails = jest.fn().mockResolvedValue(mockUpdatedUser);

      const updatedUser = await userServices.setLoginUser(userId, data);

      expect(updatedUser).toEqual(mockUpdatedUser);
      expect(userServices.updateUserLoggedInDetails).toHaveBeenCalledWith(userId, data);
    });

    it('should return null if setting login user fails', async () => {
      const userId = '1';
      const data = { email: 'user@example.com' };

      // Mock the `updateUserLoggedInDetails` method to return null
      userServices.updateUserLoggedInDetails = jest.fn().mockResolvedValue(null);

      const updatedUser = await userServices.setLoginUser(userId, data);

      expect(updatedUser).toBeNull();
      expect(userServices.updateUserLoggedInDetails).toHaveBeenCalledWith(userId, data);
    });
  });

  describe('updateUserDetails', () => {
    it('should return updated user details', async () => {
      const updateArgs = { where: { id: '1' }, data: { email: 'new-email@example.com' } };
      const mockUpdatedUser: User = {
        id: '1',
        email: 'new-email@example.com',
        password: 'hashedPassword',
        role: 'USER',
        isLoggedIn: false,
      };

      userRepository.updateUser = jest.fn().mockResolvedValue(mockUpdatedUser);

      const updatedUser = await userServices.updateUserDetails(updateArgs);

      expect(updatedUser).toEqual(mockUpdatedUser);
      expect(userRepository.updateUser).toHaveBeenCalledWith(updateArgs);
    });

    it('should return null if update fails', async () => {
      const updateArgs = { where: { id: '1' }, data: { email: 'new-email@example.com' } };
      userRepository.updateUser = jest.fn().mockResolvedValue(null);

      const updatedUser = await userServices.updateUserDetails(updateArgs);

      expect(updatedUser).toBeNull();
      expect(userRepository.updateUser).toHaveBeenCalledWith(updateArgs);
    });
  });

  describe('checkPassportJwtUserIsValid', () => {
    it('should return user if JWT is valid', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'USER',
        isLoggedIn: false,
      };
      const userUniqueProps = { email: 'test@example.com' };
      const jwtPayload = { loginSecrete: 'secret' };

      userRepository.findUniqueUser = jest.fn().mockResolvedValue(mockUser);
      userRepository.compareUserPassword = jest.fn().mockResolvedValue(true);

      const user = await userServices.checkPassportJwtUserIsValid(userUniqueProps, jwtPayload);

      expect(user).toEqual(mockUser);
      expect(userRepository.findUniqueUser).toHaveBeenCalledWith({ where: userUniqueProps });
      expect(userRepository.compareUserPassword).toHaveBeenCalledWith('hashedPassword', jwtPayload.loginSecrete);
    });

    it('should throw an error if user is not found', async () => {
      const userUniqueProps = { email: 'test@example.com' };
      const jwtPayload = { loginSecrete: 'secret' };

      userRepository.findUniqueUser = jest.fn().mockResolvedValue(null);

      await expect(userServices.checkPassportJwtUserIsValid(userUniqueProps, jwtPayload)).rejects.toThrow(
        'User is not logged in'
      );
    });

    it('should throw an error if JWT is invalid', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'USER',
        isLoggedIn: false,
      };
      const userUniqueProps = { email: 'test@example.com' };
      const jwtPayload = { loginSecrete: 'wrongSecret' };

      userRepository.findUniqueUser = jest.fn().mockResolvedValue(mockUser);
      userRepository.compareUserPassword = jest.fn().mockResolvedValue(false);

      await expect(userServices.checkPassportJwtUserIsValid(userUniqueProps, jwtPayload)).rejects.toThrow(
        'User is not logged in'
      );
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const payload = { email: 'new-user@example.com', password: 'password' };
      const mockUser: User = {
        id: '2',
        email: 'new-user@example.com',
        password: 'hashedPassword',
        role: 'USER',
        isLoggedIn: false,
      };

      userRepository.createUserWithPasswordEncryption = jest.fn().mockResolvedValue(mockUser);

      const user = await userServices.createUser(payload);

      expect(user).toEqual(mockUser);
      expect(userRepository.createUserWithPasswordEncryption).toHaveBeenCalledWith({
        ...payload,
        role: 'USER',
        isLoggedIn: false,
      });
    });

    it('should return null if user creation fails', async () => {
      const payload = { email: 'new-user@example.com', password: 'password' };
      userRepository.createUserWithPasswordEncryption = jest.fn().mockResolvedValue(null);

      const user = await userServices.createUser(payload);

      expect(user).toBeNull();
      expect(userRepository.createUserWithPasswordEncryption).toHaveBeenCalledWith({
        ...payload,
        role: 'USER',
        isLoggedIn: false,
      });
    });
  });

  describe('compareLoginSecrete', () => {
    it('should return true if the secrets match', async () => {
      userRepository.compareUserPassword = jest.fn().mockResolvedValue(true);

      const result = await userServices.compareLoginSecrete('secret', 'secret');

      expect(result).toBe(true);
      expect(userRepository.compareUserPassword).toHaveBeenCalledWith('secret', 'secret');
    });

    it('should return false if the secrets do not match', async () => {
      userRepository.compareUserPassword = jest.fn().mockResolvedValue(false);

      const result = await userServices.compareLoginSecrete('secret', 'wrongSecret');

      expect(result).toBe(false);
      expect(userRepository.compareUserPassword).toHaveBeenCalledWith('secret', 'wrongSecret');
    });
  });

  describe('createLoginSecrete', () => {
    it('should return a hashed secret', async () => {
      const mockHashedSecret = 'hashedSecret';
      userRepository.createPassword = jest.fn().mockResolvedValue(mockHashedSecret);

      const result = await userServices.creteLoginSecrete('secret');

      expect(result).toBe(mockHashedSecret);
      expect(userRepository.createPassword).toHaveBeenCalledWith('secret');
    });
  });
});
