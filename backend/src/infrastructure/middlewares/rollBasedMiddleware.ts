// middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { RoleType } from '../../utils/dto/general';

export const requireRoleMiddleware = (roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the user is authenticated and has the required role
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }
    const roleObj = Object.getOwnPropertyDescriptor(req?.user, 'role');
    if (roleObj && !roles.includes(roleObj.value)) {
      return res.status(403).json({ message: 'Forbidden. You do not have access to this resource.' });
    }
    next();
  };
};
