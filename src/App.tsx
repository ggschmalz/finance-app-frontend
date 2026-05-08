import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Transactions } from './pages/Transactions';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Transactions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Rota 404 de fallback (Opcional, mas boa prática) */}
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