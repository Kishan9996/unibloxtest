import { z } from 'zod';

const paginatedSchema = z.object({
  page: z.number().min(1).optional(), // Must be greater than or equal to 1 if provided, and optional
  pageSize: z.number().min(1).optional(), // Must be greater than or equal to 1 if provided, and optional
  search: z.string().optional(), // Optional string
  orderBy: z.string().optional(), // Optional, could be validated further if needed
  order: z.enum(['asc', 'desc']).optional(), // Optional, restricted to 'asc' or 'desc'
});
// Export the schema type for use in your application
export type PaginatedSchemaType = z.infer<typeof paginatedSchema>;

export default paginatedSchema;

export const parseStringArray = (value: string): Array<string> => {
  // Use JSON.parse to convert string representation of an array into an actual array
  try {
    return JSON.parse(value);
  } catch (error) {
    // Handle parsing errors
    throw new Error('Invalid format for array. Expected a JSON array format.');
  }
};