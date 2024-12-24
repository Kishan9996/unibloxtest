import { prismaConnector } from "./connection";

// Transaction decorator function
export function AtomicTransaction() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value; // Original method
      // Wrapping the original method with a transaction
      descriptor.value = async function (...args: any[]) {
        try {
          // Using Prisma transaction within the decorated method
          const result = await prismaConnector.$transaction(async (tx) => {
            // Inject the transaction into the method's arguments
            return originalMethod.apply(this, [...args, tx]);
          });
          return result;
        } catch (error) {
          console.error('Transaction failed:', error);
          throw new Error('Transaction failed');
        }
      };
      return descriptor;
    };
  }