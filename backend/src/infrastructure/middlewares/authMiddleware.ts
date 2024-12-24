import { Response, Request, NextFunction } from 'express';
/**
 * Custom middleware to wrap passport JWT authentication and modify the response.
 */
// Custom authentication middleware
export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    
    // // Check for Google auth middleware activation
    // if (req.isAuthenticated()) {
    //   return next();
    // } else {
    //   // Check for JWT in the Authorization header
    //   const token = req.headers['authorization']?.split(' ')[1]; // Use optional chaining
    //   if (token) {
    //     // Call the passport authenticate method with JWT
    //     passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    //       if (err) {
    //         return res.status(401).json({ message: err.message });
    //       }
    //       if (!user || user.isLoggedIn === false) {
    //         return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    //       }
    //       req.user = user; // Attach the user object to the request
    //       next(); // Proceed to the next middleware or route handler
    //     })(req, res, next); // Pass the request, response, and next to the authenticate method
    //   } else {
    //     return res.status(401).json({ message: 'Unauthorized: No token provided' });
    //   }
    // }
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};
