import { BACKEND_SERVER_URL } from '../../config';
import { authSwagger } from '../../interface/auth/auth.swagger';

export const swaggerDoc: any = {
  openapi: '3.0.0',
  info: {
    title: 'Test',
    version: '1.0.0',
  },
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {},
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: BACKEND_SERVER_URL,
    },
  ],
  tags: [],
  paths: {
    ...authSwagger,
  },
};
