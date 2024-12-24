import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';

interface ValidateOptions<T> {
  schema: ZodSchema<T>; // The Zod schema to validate against
  validateQuery?: boolean; // Flag to indicate if the query should be validated
}
export const zodSchemaValidator = <T>({ schema, validateQuery = false }: ValidateOptions<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate either the query or the body based on the flag
      if (validateQuery) {
        req.query = schema.parse(req.query) as any; // Validate query parameters
      } else {
        req.body = schema.parse(req.body); // Validate request body
      }
      next(); // Proceed if validation passes
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const errors: any = error.errors.map((error: any) => ({
          path: error.path.join(','),
          message: error.message,
        }));
        let firstError: string = errors?.[0]?.message;
        if (!errors?.[0]?.message.includes(errors?.[0]?.path)) {
          firstError = errors?.[0]?.path + ':' + errors?.[0]?.message;
        }
        const firstErrorMessage = error.errors[0] || 'Validation failed';
        return res.status(400).json({
          success: false,
          data: null,
          message: firstError,
          timestamp: new Date().toISOString(),
        });
      }
      // Handle unexpected errors
      return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  };
};
