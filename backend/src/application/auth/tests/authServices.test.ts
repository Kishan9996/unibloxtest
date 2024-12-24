import { mockDeep, mockReset } from 'jest-mock-extended';
import jwt from 'jsonwebtoken';
import { UserServices } from '../../user';
import { AuthServices } from '../auth.services';
import { IJwtUser } from '../interface';
import { ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET } from '../../../config';

jest.mock('jsonwebtoken');
jest.mock('../user');

const userServices = mockDeep<UserServices>();
const authServices = new AuthServices();
const mockJwtUser: IJwtUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  isLoggedIn: true,
  loginSecrete: 'hashedLoginSecret',
};

describe('AuthServices', () => {
  beforeEach(() => {
    mockReset(userServices);
    jest.clearAllMocks();
  });

  describe('generateJWTTokens', () => {
    it('should generate access and refresh tokens', () => {
      const user = mockJwtUser;
      
      jwt.sign = jest.fn().mockReturnValue('token'); // Mock jwt.sign to return a mock token

      const tokens = authServices.generateJWTTokens(user);

      expect(tokens).toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      });
      expect(jwt.sign).toHaveBeenCalledTimes(2); // Called twice, once for accessToken and once for refreshToken
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const user = mockJwtUser;

      jwt.sign = jest.fn().mockReturnValue('refreshToken'); // Mock jwt.sign to return a mock token

      const refreshToken = authServices.generateRefreshToken(user);

      expect(refreshToken).toBe('refreshToken');
      expect(jwt.sign).toHaveBeenCalledWith(
        { ...user },
        REFRESH_TOKEN_SECRET,
        expect.objectContaining({ expiresIn: expect.any(String) })
      );
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const user = mockJwtUser;

      jwt.sign = jest.fn().mockReturnValue('accessToken'); // Mock jwt.sign to return a mock token

      const accessToken = authServices.generateAccessToken(user);

      expect(accessToken).toBe('accessToken');
      expect(jwt.sign).toHaveBeenCalledWith(
        { ...user },
        ACCESS_TOKEN_SECRET,
        expect.objectContaining({ expiresIn: expect.any(String) })
      );
    });
  });

  describe('loginWithJwtTokenBasedWithRole', () => {
    it('should return user details and tokens when login is successful', async () => {
      const data = { email: 'test@example.com', password: 'password' };
      const role = 'USER';
      const mockUser = { ...mockJwtUser, password: 'hashedPassword' };

      userServices.getUserByEmailAndPassword = jest.fn().mockResolvedValue(mockUser);
      userServices.creteLoginSecrete = jest.fn().mockResolvedValue('hashedLoginSecret');
      userServices.setLoginUser = jest.fn().mockResolvedValue(mockUser);

      authServices.generateJWTTokens = jest.fn().mockReturnValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const response = await authServices.loginWithJwtTokenBasedWithRole(data, role);

      expect(response).toEqual({
        isLoggedIn: true,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER',
          isLoggedIn: true,
          loginSecrete: 'hashedLoginSecret',
        },
      });
      expect(userServices.getUserByEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
      expect(userServices.setLoginUser).toHaveBeenCalledWith('1', { loginSecrete: 'hashedLoginSecret' });
    });

    it('should return isLoggedIn false and no tokens if login fails', async () => {
      const data = { email: 'test@example.com', password: 'wrongPassword' };
      const role = 'USER';

      userServices.getUserByEmailAndPassword = jest.fn().mockResolvedValue(null); // Mocking user not found

      const response = await authServices.loginWithJwtTokenBasedWithRole(data, role);

      expect(response).toEqual({
        user: {},
        isLoggedIn: false,
        accessToken: null,
        refreshToken: null,
      });
      expect(userServices.getUserByEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'wrongPassword');
    });
  });

  describe('adminLogin', () => {
    it('should successfully log in as admin', async () => {
      const data = { email: 'admin@example.com', password: 'adminPassword' };

      const mockAdminUser = { ...mockJwtUser, role: 'ADMIN' };
      userServices.getUserByEmailAndPassword = jest.fn().mockResolvedValue(mockAdminUser);
      userServices.creteLoginSecrete = jest.fn().mockResolvedValue('hashedLoginSecret');
      userServices.setLoginUser = jest.fn().mockResolvedValue(mockAdminUser);

      authServices.generateJWTTokens = jest.fn().mockReturnValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const response = await authServices.adminLogin(data);

      expect(response).toEqual({
        isLoggedIn: true,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Test User',
          role: 'ADMIN',
          isLoggedIn: true,
          loginSecrete: 'hashedLoginSecret',
        },
      });
    });

    it('should return isLoggedIn false and no tokens if admin login fails', async () => {
      const data = { email: 'admin@example.com', password: 'wrongPassword' };

      userServices.getUserByEmailAndPassword = jest.fn().mockResolvedValue(null); // Mocking user not found

      const response = await authServices.adminLogin(data);

      expect(response).toEqual({
        user: {},
        isLoggedIn: false,
        accessToken: null,
        refreshToken: null,
      });
    });
  });

  describe('userLogin', () => {
    it('should successfully log in as user', async () => {
      const data = { email: 'user@example.com', password: 'userPassword' };

      const mockUser = { ...mockJwtUser, role: 'USER' };
      userServices.getUserByEmailAndPassword = jest.fn().mockResolvedValue(mockUser);
      userServices.creteLoginSecrete = jest.fn().mockResolvedValue('hashedLoginSecret');
      userServices.setLoginUser = jest.fn().mockResolvedValue(mockUser);

      authServices.generateJWTTokens = jest.fn().mockReturnValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      const response = await authServices.userLogin(data);

      expect(response).toEqual({
        isLoggedIn: true,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'USER',
          isLoggedIn: true,
          loginSecrete: 'hashedLoginSecret',
        },
      });
    });

    it('should return isLoggedIn false and no tokens if user login fails', async () => {
      const data = { email: 'user@example.com', password: 'wrongPassword' };

      userServices.getUserByEmailAndPassword = jest.fn().mockResolvedValue(null); // Mocking user not found

      const response = await authServices.userLogin(data);

      expect(response).toEqual({
        user: {},
        isLoggedIn: false,
        accessToken: null,
        refreshToken: null,
      });
    });
  });
});
