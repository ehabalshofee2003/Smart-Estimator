import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  // إذا غير مسجل، أعدوه لصفحة الدخول فوراً
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // إذا مسجل، اعرضوا الصفحة
  return <>{children}</>;
};

export default ProtectedRoute;