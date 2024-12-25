export const discountSwaggerSchema = {
  '/discount/apply': {
    get: {
      summary: 'Apply discount or coupon',
      tags: ['Discount'],
      parameters: [
        {
          name: 'code',
          in: 'query',
          description: 'Discount or coupon code to apply',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                  },
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
  '/discount/list': {
    get: {
      summary: 'Get list of items or discounts',
      tags: ['Discount'],
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number, must be greater than or equal to 1',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
          },
        },
        {
          name: 'pageSize',
          in: 'query',
          description: 'Number of items per page, must be greater than or equal to 1',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
          },
        },
      ],
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
                        description: {
                          type: 'string',
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
  '/discount/approve': {
    post: {
      summary: 'Approve discount code',
      tags: ['Discount'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  minLength: 1,
                  example: 'user123',
                },
                id: {
                  type: 'string',
                  example: 'discount456',
                },
              },
              required: ['userId'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Discount code approved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                  },
                  message: {
                    type: 'string',
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
