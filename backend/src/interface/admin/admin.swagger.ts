export const adminSwaggerSchema = {
  '/admin/list-users': {
    get: {
      summary: 'Fetch discount codes',
      tags: ['Admin'],
      description:
        'Retrieve a Lists count of items purchased, total purchase amount, list of discount codes and total discount amount with users.',
      responses: {
        '200': {
          description: 'Successful response with a list of discount codes',
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
                          description: 'Unique identifier for the discount code',
                        },
                        code: {
                          type: 'string',
                          description: 'The discount code',
                        },
                        description: {
                          type: 'string',
                          description: 'Description of the discount code',
                        },
                        discountPercentage: {
                          type: 'number',
                          description: 'The discount percentage offered by this code',
                        },
                        validFrom: {
                          type: 'string',
                          format: 'date-time',
                          description: "Start date of the discount code's validity",
                        },
                        validTo: {
                          type: 'string',
                          format: 'date-time',
                          description: "End date of the discount code's validity",
                        },
                      },
                    },
                  },
                  total: {
                    type: 'integer',
                    description: 'Total number of discount codes available',
                  },
                },
              },
            },
          },
        },
        '400': {
          description: 'Invalid request parameters',
        },
      },
    },
  },
};
