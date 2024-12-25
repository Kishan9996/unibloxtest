export const productSwaggerSchema = {
  '/product/list': {
    get: {
      summary: 'Get list of products',
      tags: ['Product'],
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        price: {
                          type: 'number',
                        },
                        stock: {
                          type: 'integer',
                        },
                      },
                    },
                  },
                  total: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/product/add': {
    post: {
      summary: 'Add a new product',
      tags: ['Product'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 26,
                  example: 'Product Name',
                },
                price: {
                  type: 'number',
                  example: 99.99,
                },
                stock: {
                  type: 'integer',
                  default: 0,
                  example: 10,
                },
              },
              required: ['name', 'price'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Product created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                  price: {
                    type: 'number',
                  },
                  stock: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Bad Request',
        },
      },
    },
  },
};
