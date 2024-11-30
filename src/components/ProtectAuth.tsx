import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const ProtectedAuth = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
export { ProtectedLayout, ProtectedAuth };