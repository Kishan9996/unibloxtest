import { z } from 'zod';

const checkOutSchema = z.object({
  cartId: z.string().min(1, 'cartId is required'),
  discountCodeId: z.string().optional(),
  totalAmount: z.number().nonnegative('totalAmount must be a non-negative number'),
});

const productAddTOCartSchema = z.object({
  productId: z.string().min(1, 'productId is required'),
  quantity: z.number().positive('Quantity must be a positive number'),
});

const productRemoveTOCartSchema = z.object({
  cartItemId: z.string().min(1, 'productId is required'),
});

const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1, 'productId is required'),
  quantity: z.number().positive('Quantity must be a positive number'),
});

// Export the schema type for use in your application
export type ProductAddTOCartSchemaType = z.infer<typeof productAddTOCartSchema>;
export type CheckOutSchemaType = z.infer<typeof checkOutSchema>;
export type ProductRemoveTOCartSchemaType = z.infer<typeof productRemoveTOCartSchema>;
export type UpdateCartItemSchemaType = z.infer<typeof updateCartItemSchema>;

export default { productAddTOCartSchema, checkOutSchema, productRemoveTOCartSchema, updateCartItemSchema };
