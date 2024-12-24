import { BACKEND_SERVER_URL } from '../../config';

export const swaggerDoc: any = {
  openapi: '3.0.0',
  info: {
    title: 'Tool',
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
    parameters: {
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string', // adjust type as per your actual ID type
        },
        description: 'ID of the entity details',
      },
    },
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
  paths: {},
};
