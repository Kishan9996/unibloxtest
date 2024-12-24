import { Request } from 'express';
import { User as UserInterface } from '@prisma/client';

// Define your custom types for body and query with namespaces overriding
declare global {
  namespace Express {
    interface Request {
      user?: Omit<UserInterface, 'password'>;
    }
  }
}
