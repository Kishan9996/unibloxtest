export const cartSwaggerSchema = {
  '/cart/add': {
    post: {
      summary: 'Add product to cart',
      tags: ['Cart'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                  minLength: 1,
                  description: 'ID of the product to add to the cart',
                  example: 'product123',
                },
                quantity: {
                  type: 'number',
                  minimum: 1,
                  description: 'Quantity of the product to add to the cart',
                  example: 2,
                },
              },
              required: ['productId', 'quantity'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Product added to cart successfully',
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
          description: 'Invalid request body',
        },
      },
    },
  },
  '/cart/checkout': {
    post: {
      summary: 'Checkout the cart',
      tags: ['Cart'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                cartId: {
                  type: 'string',
                  minLength: 1,
                  description: 'ID of the cart to checkout',
                  example: 'cart789',
                },
                discountCodeId: {
                  type: 'string',
                  description: 'Optional ID of the discount code to apply',
                  example: 'discount456',
                },
                totalAmount: {
                  type: 'number',
                  minimum: 0,
                  description: 'Total amount for the checkout, must be non-negative',
                  example: 99.99,
                },
              },
              required: ['cartId', 'totalAmount'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Checkout completed successfully',
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
                  orderId: {
                    type: 'string',
                    description: 'ID of the created order',
                    example: 'order12345',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Invalid request body',
        },
      },
    },
  },
};
