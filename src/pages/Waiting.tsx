import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

export function Waiting() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-10 px-6 shadow-xl rounded-3xl sm:px-10 text-center border border-gray-100 dark:border-slate-700">
          <div className="w-20 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-3xl flex items-center justify-center text-brand-600 dark:text-brand-400 mx-auto mb-8 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Olá, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {t('waiting')}
          </p>
          <div className="bg-brand-50 dark:bg-slate-700/50 rounded-2xl p-5 mb-10 border border-brand-100 dark:border-slate-600">
            <p className="text-xs text-brand-700 dark:text-brand-300 font-bold uppercase tracking-widest">
              Status: Pendente
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-black uppercase tracking-widest text-white bg-brand-600 hover:bg-brand-700 transition-all active:scale-95"
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
