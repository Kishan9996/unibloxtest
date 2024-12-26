import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../../config";
import { AuthServices } from "../auth.services";
import jwt from 'jsonwebtoken';
import { IJwtUser } from "../interface";

describe('AuthServices', () => {

    // Generate valid access and refresh tokens with correct user payload
    it('should generate valid access and refresh tokens when provided valid user data', () => {
      const authServices = new AuthServices();

      const mockUser: IJwtUser = {
        id: '123',
        name: 'Test User',
        email: 'test@test.com',
        role: 'USER',
        loginSecrete: 'secret123',
        isLoggedIn: true
      };

      const { accessToken, refreshToken } = authServices.generateJWTTokens(mockUser);

      const decodedAccess = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as IJwtUser;
      const decodedRefresh = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as IJwtUser;

      expect(decodedAccess.id).toBe(mockUser.id);
      expect(decodedAccess.email).toBe(mockUser.email);
      expect(decodedAccess.role).toBe(mockUser.role);

      expect(decodedRefresh.id).toBe(mockUser.id);
      expect(decodedRefresh.email).toBe(mockUser.email);
      expect(decodedRefresh.role).toBe(mockUser.role);
    });

    // Handle login attempt with invalid email/password combination
    it('should return unsuccessful login response when credentials are invalid', async () => {
      const authServices = new AuthServices();
      const mockUserServices = jest.spyOn(authServices['userServices'], 'getUserByEmailAndPassword');
      mockUserServices.mockResolvedValue(null);

      const loginData = {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      };

      const result = await authServices.userLogin(loginData);

      expect(result).toEqual({
        user: {},
        isLoggedIn: false,
        accessToken: null,
        refreshToken: null
      });

      expect(mockUserServices).toHaveBeenCalledWith(loginData.email, loginData.password);
    });
});
