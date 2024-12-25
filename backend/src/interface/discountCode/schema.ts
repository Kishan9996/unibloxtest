import { z } from 'zod';

const approveDiscountCodeSchema = z.object({
  userId: z.string().min(1, 'cartId is required'),
  id: z.string().optional(),
});

export type ApproveDiscountCodeSchemaType = z.infer<typeof approveDiscountCodeSchema>;

export default { approveDiscountCodeSchema };
