import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom'; // <- IMPORTAÇÃO NOVA

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  
  // Função para aplicar as classes CSS corretas dependendo se o link está ativo ou não
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white font-medium shadow-md' 
        : 'hover:bg-slate-800 hover:text-white text-slate-300 font-medium'
    }`;

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* ... (O header continua exatamente igual) ... */}
      <header className="h-16 bg-white shadow-sm z-20 flex items-center justify-between px-6 border-b border-gray-200" data-testid="global-header">
        <div className="flex items-center space-x-3">
          {/* Logo MonetizAI */}
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold" data-testid="logo-icon">
            M
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight" data-testid="app-name">MonetizAI</h1>
        </div>
        
        {/* Seção de Perfil de Usuário (Mock para Multi-usuário) */}
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors" data-testid="user-profile-menu">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900" data-testid="user-name">Usuário Teste</p>
            <p className="text-xs text-gray-500" data-testid="user-role">Administrador</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200" data-testid="user-avatar">
            UT
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR DE NAVEGAÇÃO ATUALIZADA */}
        <aside className="w-64 bg-slate-900 flex flex-col shadow-inner" data-testid="sidebar">
          <nav className="flex-1 px-4 py-6 space-y-2">
            
            <NavLink to="/" className={navLinkClass} data-testid="nav-transactions">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Transações</span>
            </NavLink>
            
            <NavLink to="/dashboard" className={navLinkClass} data-testid="nav-dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Relatórios</span>
            </NavLink>

            <NavLink to="/settings" className={navLinkClass} data-testid="nav-settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Configurações</span>
            </NavLink>

          </nav>
        </aside>

        {/* ... (Main Content continua igual) ... */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8" data-testid="main-content-area">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}