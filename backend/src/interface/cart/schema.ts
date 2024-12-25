import { z } from "zod";

const productItemSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  quantity: z.number().positive("Quantity must be a positive number"),
});

const productAddTOCartSchema = z.array(productItemSchema);

// Export the schema type for use in your application
export type ProductAddTOCartSchemaType = z.infer<typeof productAddTOCartSchema>;

export default { productAddTOCartSchema };
