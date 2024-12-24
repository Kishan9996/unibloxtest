import { mockDeep, mockReset } from 'jest-mock-extended';
import { Request, Response } from 'express';
import schema from '../schema';
import { AuthController } from '../auth.controller';
import { AuthServices } from '../../../application/auth';
import { UserServices } from '../../../application/user';
import { HttpStatusCodes } from '../../../const/constant';

UserServices

// Mocks
jest.mock('../../application/user');
jest.mock('../../application/auth');

const userServices = mockDeep<UserServices>();
const authServices = mockDeep<AuthServices>();
const authController = new AuthController();
const mockRequest = (body = {}) => ({ body } as Request);
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('AuthController', () => {
  beforeEach(() => {
    mockReset(userServices);
    mockReset(authServices);
  });

  describe('adminLogin', () => {
    it('should return success when admin logs in successfully', async () => {
      const req = mockRequest({ email: 'admin@example.com', password: 'password' });
      const res = mockResponse();
      const mockData = {
        isLoggedIn: true,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      };
      authServices.adminLogin = jest.fn().mockResolvedValue(mockData);

      await authController.adminLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_OK.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.success.admin_logged_in,
        data: mockData,
      });
    });

    it('should return error when admin login fails', async () => {
      const req = mockRequest({ email: 'admin@example.com', password: 'wrongPassword' });
      const res = mockResponse();
      authServices.adminLogin = jest.fn().mockResolvedValue({ isLoggedIn: false });

      await authController.adminLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.error.user_not_exists,
      });
    });

    it('should return error when an exception occurs', async () => {
      const req = mockRequest({ email: 'admin@example.com', password: 'password' });
      const res = mockResponse();
      authServices.adminLogin = jest.fn().mockRejectedValue(new Error('Some error'));

      await authController.adminLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.error.user_un_authorized,
      });
    });
  });

  describe('login', () => {
    it('should return success when user logs in successfully', async () => {
      const req = mockRequest({ email: 'user@example.com', password: 'password' });
      const res = mockResponse();
      const mockData = {
        isLoggedIn: true,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'USER',
        },
      };
      authServices.userLogin = jest.fn().mockResolvedValue(mockData);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_OK.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.success.user_logged_in,
        data: mockData,
      });
    });

    it('should return error when user login fails', async () => {
      const req = mockRequest({ email: 'user@example.com', password: 'wrongPassword' });
      const res = mockResponse();
      authServices.userLogin = jest.fn().mockResolvedValue({ isLoggedIn: false });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.error.user_not_exists,
      });
    });

    it('should return error when an exception occurs', async () => {
      const req = mockRequest({ email: 'user@example.com', password: 'password' });
      const res = mockResponse();
      authServices.userLogin = jest.fn().mockRejectedValue(new Error('Some error'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.error.user_un_authorized,
      });
    });
  });

  describe('signUp', () => {
    it('should return success when user signs up successfully', async () => {
      const req = mockRequest({
        email: 'newuser@example.com',
        password: 'password',
        name: 'New User',
      });
      const res = mockResponse();
      const mockUser = {
        id: '1',
        email: 'newuser@example.com',
        name: 'New User',
        password: 'hashedPassword',
      };
      const mockTokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      userServices.createUser = jest.fn().mockResolvedValue(mockUser);
      userServices.creteLoginSecrete = jest.fn().mockResolvedValue('hashedLoginSecret');
      userServices.setLoginUser = jest.fn().mockResolvedValue(mockUser);
      authServices.generateJWTTokens = jest.fn().mockReturnValue(mockTokens);

      await authController.signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_OK.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.success.user_signup_success,
        data: { ...mockTokens, user: { ...mockUser, loginSecrete: 'hashedLoginSecret' } },
      });
    });

    it('should return error when user sign-up fails', async () => {
      const req = mockRequest({
        email: 'newuser@example.com',
        password: 'password',
        name: 'New User',
      });
      const res = mockResponse();
      userServices.createUser = jest.fn().mockResolvedValue(null);

      await authController.signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.error.user_not_exists,
      });
    });

    it('should return error when an exception occurs during sign-up', async () => {
      const req = mockRequest({
        email: 'newuser@example.com',
        password: 'password',
        name: 'New User',
      });
      const res = mockResponse();
      userServices.createUser = jest.fn().mockRejectedValue(new Error('Some error'));

      await authController.signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(res.json).toHaveBeenCalledWith({
        message: authController.responseMessages.error.user_un_authorized,
      });
    });
  });
});
