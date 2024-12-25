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
  '/cart/cart-items': {
    get: {
      summary: 'Retrieve cart items',
      tags: ['Cart'],
      description: 'Fetches a list of items in the cart.',
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                      description: 'Unique identifier for the cart item',
                    },
                    name: {
                      type: 'string',
                      description: 'Name of the cart item',
                    },
                    quantity: {
                      type: 'integer',
                      description: 'Quantity of the item in the cart',
                    },
                    price: {
                      type: 'number',
                      format: 'float',
                      description: 'Price of the item',
                    },
                  },
                  required: ['id', 'name', 'quantity', 'price'],
                },
              },
            },
          },
        },
        '400': {
          description: 'Bad request',
        },
        '500': {
          description: 'Internal server error',
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
  '/cart/remove-item': {
    post: {
      summary: 'Remove a cart item',
      tags: ['Cart'],

      description: 'Removes an item from the cart.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                cartItemId: {
                  type: 'string',
                  description: 'The ID of the cart item to remove',
                  minLength: 1,
                },
              },
              required: ['cartItemId'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Item successfully removed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'Confirmation message',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Invalid request payload',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  },
  '/cart/update-quantity': {
    patch: {
      summary: 'Update cart item quantity',
      tags: ['Cart'],

      description: 'Updates the quantity of an item in the cart.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                cartItemId: {
                  type: 'string',
                  description: 'The ID of the cart item',
                  minLength: 1,
                },
                quantity: {
                  type: 'number',
                  description: 'The new quantity for the cart item',
                  minimum: 1,
                },
              },
              required: ['cartItemId', 'quantity'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Quantity successfully updated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'Confirmation message',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Invalid request payload',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  },
};
