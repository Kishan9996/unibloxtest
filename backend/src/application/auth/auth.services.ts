import jwt from 'jsonwebtoken';
import { IJwtUser } from './interface';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from '../../config';
import { UserServices } from '../user';
import { User } from '@prisma/client';
import { promisify } from 'util';

export class AuthServices {
  private userServices: UserServices;
  // Promisify jwt.verify for async/await usage
  private verifyJwt = promisify(jwt.verify);

  constructor() {
    this.userServices = new UserServices();
  }

  public generateJWTTokens(user: IJwtUser): { accessToken: string; refreshToken: string } {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  generateRefreshToken(user: IJwtUser): string {
    const payload = {
      ...user,
    };

    // Generate a token with the custom payload
    return jwt.sign(payload, REFRESH_TOKEN_SECRET!, {
      expiresIn: REFRESH_TOKEN_EXPIRY, // Token expires in 1 hour
    });
  }
  generateAccessToken(user: IJwtUser): string {
    const payload = {
      ...user,
    };
    // Generate a token with the custom payload
    return jwt.sign(payload, ACCESS_TOKEN_SECRET!, {
      expiresIn: ACCESS_TOKEN_EXPIRY, // Token expires in 1 hour
    });
  }

  async loginWithJwtTokenBasedWithRole(data: { email: string; password: string }, role: 'ADMIN' | 'USER') {
    const userInstance = await this.userServices.getUserByEmailAndPassword(data.email, data.password);
    if (!userInstance) {
      return { user: {}, isLoggedIn: false, accessToken: null, refreshToken: null };
    }
    const loginSecrete = await this.userServices.creteLoginSecrete(userInstance.password ?? '');
    const loggedInUser = await this.userServices.setLoginUser(userInstance.id, { loginSecrete });
    if (loggedInUser) {
      const userDetails = {
        loginSecrete,

        id: loggedInUser.id,
        isLoggedIn: loggedInUser.isLoggedIn,
        email: loggedInUser.email,
        name: loggedInUser.name,
        role: loggedInUser.role,
      };
      const tokens = this.generateJWTTokens({
        ...userDetails,
        role: role,
      });
      return { isLoggedIn: true, ...tokens, user: { ...userDetails } };
    }
  }

  public verifyAndFetchTokenDetails(token: string) {
    return jwt.verify(token,ACCESS_TOKEN_SECRET)
  }

  async adminLogin(data: { email: string; password: string }, role: 'ADMIN' | 'USER' = 'ADMIN') {
    return await this.loginWithJwtTokenBasedWithRole(data, role);
  }

  async userLogin(data: { email: string; password: string }, role: 'ADMIN' | 'USER' = 'USER') {
    return await this.loginWithJwtTokenBasedWithRole(data, role);
  }
}
