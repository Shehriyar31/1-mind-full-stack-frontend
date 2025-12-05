import { Navigate } from 'react-router-dom';

// Protected route for admin pages
export const AdminRoute = ({ children }) => {
  const adminLoggedIn = localStorage.getItem('adminLoggedIn');
  
  if (!adminLoggedIn) {
    return <Navigate to="/Users/Login" replace />;
  }
  
  return children;
};

// Protected route for user pages
export const UserRoute = ({ children }) => {
  const userLoggedIn = localStorage.getItem('userLoggedIn');
  
  if (!userLoggedIn) {
    return <Navigate to="/Users/Login" replace />;
  }
  
  return children;
};

// Protected route for any authenticated user (admin or user)
export const AuthRoute = ({ children }) => {
  const userLoggedIn = localStorage.getItem('userLoggedIn');
  const adminLoggedIn = localStorage.getItem('adminLoggedIn');
  
  if (!userLoggedIn && !adminLoggedIn) {
    return <Navigate to="/Users/Login" replace />;
  }
  
  return children;
};