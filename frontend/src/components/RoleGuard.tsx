import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  userRole?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles, userRole }) => {
  const location = useLocation();

  // Normalize roles for comparison (handle both uppercase and lowercase)
  const normalizedUserRole = userRole?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  if (!normalizedUserRole || !normalizedAllowedRoles.includes(normalizedUserRole)) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;