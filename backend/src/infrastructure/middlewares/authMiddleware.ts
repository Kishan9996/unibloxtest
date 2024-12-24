import { Response, Request, NextFunction } from 'express';
import { UserServices } from '../../application/user/user.services';
import { AuthServices } from '../../application/auth';
/**
 * Custom middleware to wrap passport JWT authentication and modify the response.
 */
// Custom authentication middleware
export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authServices = new AuthServices()
    const userServices = new UserServices()

    // Check for JWT in the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Use optional chaining to safely access the token
    if (token) {
      try {
        // Decode and verify the JWT
        const decoded = authServices.verifyAndFetchTokenDetails(token); // Replace 'your-secret-key' with your actual secret key

        // Extract the necessary details from the decoded token (e.g., email, id, loginSecrete)
        const jwtPayload = decoded as { email: string; id: string; loginSecrete: string };

        // Call the user service to check if the user is valid
        const user = await userServices.checkPassportJwtUserIsValid(
          { email: jwtPayload?.email, id: jwtPayload?.id },
          { loginSecrete: jwtPayload?.loginSecrete }
        );
        if (user) {
          req.user = user; // Attach the user object to the request
          return next(); // Proceed to the next middleware or route handler
        } else {
          return res.status(401).json({ message: 'Unauthorized: Invalid user' });
        }
      } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token or user check failed' });
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};