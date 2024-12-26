import { AuthServices } from '../../../application/auth';
import { UserServices } from '../../../application/user';
import { HttpStatusCodes } from '../../../const/constant';
import { AuthController } from '../auth.controller';
import { Request, Response } from 'express';

// Mock the AuthServices and UserServices
jest.mock('../../../application/auth');
jest.mock('../../../application/user');

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthServices: jest.Mocked<AuthServices>;
  let mockUserServices: jest.Mocked<UserServices>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockAuthServices = new AuthServices() as jest.Mocked<AuthServices>;
    mockUserServices = new UserServices() as jest.Mocked<UserServices>;
    authController = new AuthController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('adminLogin', () => {
    it('should return success when admin login is successful', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'admin@example.com', password: 'password123' },
      };

      // Corrected mock return value for successful login
      mockAuthServices.adminLogin.mockResolvedValue({
        isLoggedIn: true,
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'ADMIN',
          loginSecrete: 'adminSecret',
          isLoggedIn: true,
        },
        accessToken: 'dummyAccessToken',
        refreshToken: 'dummyRefreshToken',
      });

      await authController.adminLogin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_OK.value);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Admin logged in successfully',
        data: {
          accessToken: 'dummyAccessToken',
          refreshToken: 'dummyRefreshToken',
          user: {
            id: '1',
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'ADMIN',
          },
        },
      });
    });

    it('should return error when admin login fails', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'admin@example.com', password: 'wrongpassword' },
      };

      // Return a default object structure to satisfy the type requirement
      mockAuthServices.adminLogin.mockResolvedValue({
        isLoggedIn: false,
        user: {},
        accessToken: null,
        refreshToken: null,
      });

      await authController.adminLogin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User does not exist',
      });
    });
  });
  describe('login', () => {
    it('should return success when user login is successful', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'user@example.com', password: 'password123' },
      };
  
      // Corrected return value to include missing properties
      mockAuthServices.userLogin.mockResolvedValue({
        isLoggedIn: true,
        user: {
          id: '2',
          email: 'user@example.com',
          name: 'User',
          role: 'USER',
          loginSecrete: 'userSecret', // Added missing property
          isLoggedIn: true, // Added missing property
        },
        accessToken: 'userAccessToken',
        refreshToken: 'userRefreshToken',
      });
  
      await authController.login(mockRequest as Request, mockResponse as Response);
  
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_OK.value);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User logged in successfully',
        data: {
          accessToken: 'userAccessToken',
          refreshToken: 'userRefreshToken',
          user: {
            id: '2',
            email: 'user@example.com',
            name: 'User',
            role: 'USER',
            loginSecrete: 'userSecret', // Added missing property to match the expected return type
            isLoggedIn: true, // Added missing property to match the expected return type
          },
        },
      });
    });
  
    it('should return error when user login fails', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'user@example.com', password: 'wrongpassword' },
      };
  
      // Return a default object structure to match expected type for failed login
      mockAuthServices.userLogin.mockResolvedValue({
        isLoggedIn: false,
        user: {},
        accessToken: null,
        refreshToken: null,
      });
  
      await authController.login(mockRequest as Request, mockResponse as Response);
  
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User does not exist',
      });
    });
  });

  describe('signUp', () => {
    it('should return success when user sign-up is successful', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'newuser@example.com', password: 'password123' },
      };

      // Mock createUser to return a full user object with all required fields
      mockUserServices.createUser.mockResolvedValue({
        id: '1',
        email: 'newuser@example.com',
        password: 'password123',
        isLoggedIn: true,
        loginSecrete: 'test',
        name: 'New User', // Add name
        discountApplicationCount: 0, // Add discountApplicationCount
        role: 'USER', // Add role
        createdAt: new Date(), // Add createdAt
        updatedAt: new Date(), // Add updatedAt
      });

      mockAuthServices.generateJWTTokens.mockReturnValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      // Fixed the return type to match what is expected
      mockUserServices.setLoginUser.mockResolvedValue({} as any);

      await authController.signUp(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_OK.value);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User sign-up successful',
        data: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
          user: {
            id: '1', // Ensure ID is a string (since it's mocked as string)
            email: 'newuser@example.com',
            name: 'New User', // Include name in the response data
          },
        },
      });
    });

    it('should return error when user sign-up fails', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'newuser@example.com', password: 'password123' },
      };

      mockUserServices.createUser.mockResolvedValue(null);

      await authController.signUp(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.STATUS_UNAUTHORIZED.value);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not created',
      });
    });
  });
});
