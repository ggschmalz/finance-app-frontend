import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import type { UserRole } from '../services/authService';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== 'UNASSIGNED' && location.pathname === '/waiting') {
    return <Navigate to="/" replace />;
  }

  if (userRole === 'UNASSIGNED' && location.pathname !== '/waiting') {
    return <Navigate to="/waiting" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
