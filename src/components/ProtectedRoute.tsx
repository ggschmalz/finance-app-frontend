import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export function ProtectedRoute() {
  // Se não estiver autenticado, redireciona para a tela de login
  if (!authService.isAuthenticated()) {
    console.log("Usuário não autenticado. Redirecionando para /login");
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza a rota filha via <Outlet />
  return <Outlet />;
}
