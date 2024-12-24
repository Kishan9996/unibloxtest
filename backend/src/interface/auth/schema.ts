import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' }) // Custom message for required email
    .email({ message: 'Invalid email format' }), // Custom message for invalid email format
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }), // Custom message for password length
});

// Zod schema for the User model
const userSignUpSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});
// Export the schema type for use in your application
export type LoginSchemaType = z.infer<typeof loginSchema>;

// Export the schema type for use in your application
export type UserSignUpSchemaType = z.infer<typeof userSignUpSchema>;

export default { loginSchema, userSignUpSchema };
