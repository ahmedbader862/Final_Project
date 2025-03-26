import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Component, isAdminRoute = false, ...rest }) => {
  const userState = useSelector((state) => state.UserData['UserState']);

  // Check if user is authenticated (assuming 'uid' exists when logged in)
  const isAuthenticated = userState && userState.uid && userState.uid !== "who know";

  // Check if user is an admin (you might need to adjust this based on your Redux state structure)
  const isAdmin = isAuthenticated && userState.role === 'admin'; // Example: assuming 'role' field exists

  if (isAdminRoute) {
    // For admin routes, check both authentication and admin privileges
    return isAuthenticated && isAdmin ? <Component {...rest} /> : <Navigate to="/signin" />;
  }

  // For regular protected routes (e.g., Cart), only check authentication
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;