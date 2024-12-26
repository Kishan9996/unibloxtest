import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';


// Protected Admin Route Component
const ProtectedAdminRoute = ({ element, ...rest }) => {
  const { currentUser } = useAuthStore();

  // Check if the user is logged in and is an admin
  const isAdmin = currentUser?.isLoggedIn && currentUser?.role === 'ADMIN';

  // If user is an admin, render the protected route; otherwise, redirect to login
  return isAdmin ? element : <Navigate to="/login" />;
};

export default ProtectedAdminRoute;