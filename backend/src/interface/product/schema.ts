import { z } from 'zod';

const productCreateSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name must be at least 5 characters long' })
    .max(26, { message: 'Name must be at most 26 characters long' }),
  price: z.number(),
  stock: z.number().default(0),
});

// Export the schema type for use in your application
export type ProductCreateSchemaType = z.infer<typeof productCreateSchema>;

export default { productCreateSchema };
