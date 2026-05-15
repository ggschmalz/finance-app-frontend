import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Transactions } from './pages/Transactions';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Waiting } from './pages/Waiting';
import { Users } from './pages/Users';
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Privadas Agrupadas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Transactions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/waiting" element={<Waiting />} />
        </Route>

        {/* Rotas de Admin */}
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/users" element={<Users />} />
        </Route>
        
        {/* Rota de Not Found */}
        <Route path="*" element={
          <div className="h-screen flex items-center justify-center bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-700">Página não encontrada</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
