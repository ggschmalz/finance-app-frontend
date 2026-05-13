import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const roleLabels: Record<string, string> = {
    'ADMIN': 'Administrador',
    'STANDARD': 'Padrão',
    'UNASSIGNED': 'Pendente'
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center gap-3 sm:gap-6">
      <div className="text-right hidden md:block">
        <p className="text-sm font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
          {user?.name || 'Usuário'}
        </p>
        <p className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
          {user?.role ? roleLabels[user.role] : 'Membro'}
        </p>
      </div>
      
      <div className="flex items-center gap-3 md:border-l md:pl-6 md:border-slate-100 dark:md:border-slate-700/50">
        <div className="relative group cursor-pointer" onClick={() => navigate('/settings')}>
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt={user.name} 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border-2 border-white dark:border-slate-800 object-cover shadow-md group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-black border-2 border-white dark:border-slate-800 text-sm sm:text-base shadow-md group-hover:scale-105 transition-transform">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm"></div>
        </div>

        <button 
          onClick={handleLogout}
          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-xl active:scale-90"
          title={t('logout')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
