import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file
interface AppConfig {
  PORT: number;
  HOST: string;
  REACT_APP_LINK: string;
  HTTP: string;
  generateAppLink: () => string;
}

export const APP: AppConfig = {
  PORT: Number(process.env.PORT ?? 5015),
  HOST: process.env.HOST ?? 'localhost',
  REACT_APP_LINK: '',
  HTTP: process.env.HTTP ?? 'http',
  generateAppLink: () => {
    return `${APP.HTTP}://${APP.HOST}:${APP.PORT}`;
  },
};
export const BACKEND_SERVER_URL = process.env.BACKEND_SERVER_URL ?? '';

interface SwaggerCredentials {
  SWAGGER_USERNAME: string;
  SWAGGER_PASSWORD: string;
}

export const SWAGGER_CREDENTIALS: SwaggerCredentials = {
  SWAGGER_USERNAME: process.env.SWAGGER_USERNAME || 'admin',
  SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD || 'admin',
};

export const BASE_PATH = '/api';
export const VERSION = 'v1';
export const API_BASE_PATH = `${BASE_PATH}/${VERSION}`;
export const SESSION_SECRATE = process.env.SESSION_SECRATE ?? '';

export const JWT_SECRET = process.env.JWT_SECRET ?? '';
export const passwordCarSet = process.env.PASSWORD_CAR_SET ?? '';

export const PASSWORD_SALT_ROUND = Number(process.env.PASSWORD_SALT_ROUND) ?? 20;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

export const ACCESS_TOKEN_EXPIRY = '8h'; // You can set your desired expiry
export const FORGOT_PASSWORD_TOKEN_EXPIRY = '1h'; // You can set your desired expiry

export const REFRESH_TOKEN_EXPIRY = '7d'; // You can set your desired expiry
export const FORGOT_PASSWORD_URL = process.env.FORGOT_PASSWORD_URL ?? '';

export const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
