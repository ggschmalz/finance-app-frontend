import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Transactions } from './pages/Transactions';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
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

export default App;
