export const authSwagger = {
  '/api/v1/auth/admin/login': {
    post: {
      summary: 'Admin login',
      operationId: 'adminLogin',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'admin@example.com',
                },
                password: {
                  type: 'string',
                  minLength: 6,
                  example: 'password123',
                },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Admin successfully logged in',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                  },
                  refreshToken: {
                    type: 'string',
                  },
                  user: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/v1/auth/login': {
    post: {
      summary: 'User login',
      operationId: 'userLogin',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  minLength: 6,
                  example: 'password123',
                },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'User successfully logged in',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                  },
                  refreshToken: {
                    type: 'string',
                  },
                  user: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/v1/auth/sign-up': {
    post: {
      summary: 'User sign-up',
      operationId: 'userSignUp',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'newuser@example.com',
                },
                name: {
                  type: 'string',
                  example: 'New User',
                },
                password: {
                  type: 'string',
                  minLength: 6,
                  example: 'password123',
                },
              },
              required: ['email', 'name', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'User successfully signed up and logged in',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string',
                  },
                  refreshToken: {
                    type: 'string',
                  },
                  user: {
                    type: 'object',
                    properties: {
                      email: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
