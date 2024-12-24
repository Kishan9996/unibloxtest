import { PrismaClient, User } from "@prisma/client";
import { mockDeep, mockReset } from 'jest-mock-extended';
import { PasswordService } from "../../../utils/hashPassword";
import { UserRepository } from "../user.repository";

jest.mock('../../utils/hashPassword');

const prisma = mockDeep<PrismaClient>();
const passwordService = new PasswordService();
const userRepository = new UserRepository();

describe('UserRepository', () => {
  beforeEach(() => {
    mockReset(prisma);
  });

  describe('findUniqueUser', () => {
    it('should return user when user exists', async () => {
      const user: User = { id: '1', email: 'test@test.com', password: 'hashed', name: 'Test User', isLoggedIn: true, role: "USER" };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await userRepository.findUniqueUser({ where: { id: '1' } });
      expect(result).toEqual(user);
    });

    it('should return null when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.findUniqueUser({ where: { id: '2' } });
      expect(result).toBeNull();
    });
  });

  describe('compareUserPassword', () => {
    it('should return true for matching passwords', async () => {
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(true);

      const result = await userRepository.compareUserPassword('password', 'hashed');
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(false);

      const result = await userRepository.compareUserPassword('password', 'wrong-hash');
      expect(result).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should return updated user without password', async () => {
      const updatedUser = { id: '1', email: 'updated@test.com', name: 'Updated User', isLoggedIn: true, role: "USER" };
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await userRepository.updateUser({ where: { id: '1' }, data: { email: 'updated@test.com' } });
      expect(result).toEqual(updatedUser);
    });

    it('should return null if update fails', async () => {
      prisma.user.update.mockRejectedValue(new Error('Update failed'));

      await expect(userRepository.updateUser({ where: { id: '1' }, data: { email: 'updated@test.com' } })).rejects.toThrow('Update failed');
    });
  });

  describe('createUserWithPasswordEncryption', () => {
    it('should create user with encrypted password', async () => {
      const payload = { email: 'test@test.com', password: 'password', name: 'Test User' };
      const encryptedPassword = 'encrypted-password';
      const createdUser = { id: '1', email: 'test@test.com', password: encryptedPassword, name: 'Test User', isLoggedIn: false, role: "USER" };

      jest.spyOn(passwordService, 'generateHashPassword').mockResolvedValue(encryptedPassword);
      prisma.user.create.mockResolvedValue(createdUser);

      const result = await userRepository.createUserWithPasswordEncryption(payload);
      expect(result).toEqual(createdUser);
    });

    it('should return null if password is missing', async () => {
      const payload = { email: 'test@test.com', name: 'Test User' };

      const result = await userRepository.createUserWithPasswordEncryption(payload);
      expect(result).toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('should return user if found by email', async () => {
      const user: User = { id: '1', email: 'test@test.com', password: 'hashed', name: 'Test User', isLoggedIn: true, role: "USER" };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await userRepository.findUserByEmail('test@test.com');
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.findUserByEmail('notfound@test.com');
      expect(result).toBeNull();
    });
  });

  describe('createPassword', () => {
    it('should return hashed password', async () => {
      const password = 'plain-password';
      const hashedPassword = 'hashed-password';

      jest.spyOn(passwordService, 'generateHashPassword').mockResolvedValue(hashedPassword);

      const result = await userRepository.createPassword(password);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('getUserByEmailAndPassword', () => {
    it('should return user if email and password match', async () => {
      const user: User = { id: '1', email: 'test@test.com', password: 'hashed', name: 'Test User', isLoggedIn: true, role: "USER" };

      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(true);

      const result = await userRepository.getUserByEmailAndPassword('test@test.com', 'password');
      expect(result).toEqual(user);
    });

    it('should return null if email is not found', async () => {
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);

      const result = await userRepository.getUserByEmailAndPassword('notfound@test.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user: User = { id: '1', email: 'test@test.com', password: 'hashed', name: 'Test User', isLoggedIn: true, role: "USER" };

      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(false);

      const result = await userRepository.getUserByEmailAndPassword('test@test.com', 'wrong-password');
      expect(result).toBeNull();
    });
  });
});
