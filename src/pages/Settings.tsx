import { useSettings } from '../hooks/useSettings';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';

export function Settings() {
  const { t } = useTranslation();
  const { 
    darkMode, setDarkMode, 
    currency, setCurrency, 
    language, setLanguage, 
    palette, setPalette 
  } = useSettings();

  const sectionClass = "bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700/50 transition-all";
  const labelClass = "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1";
  const selectClass = "w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-brand-500 dark:focus:border-brand-400 rounded-3xl p-5 text-sm font-black text-slate-900 dark:text-white outline-none transition-all appearance-none cursor-pointer shadow-inner";

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-16 gap-4">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter" data-testid="page-title">{t('settings')}</h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mt-2 font-medium">Personalize sua experiência digital.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        {/* Aparência */}
        <div className={sectionClass}>
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 flex items-center justify-center bg-brand-100 dark:bg-brand-900/30 rounded-2xl text-brand-600 dark:text-brand-400 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656L10 17.657" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('appearance')}</h3>
          </div>
          
          <div className="space-y-12">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] border-2 border-transparent">
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('dark_mode')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 font-bold mt-1">Interface dinâmica</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-24 h-12 rounded-full transition-all duration-700 p-1.5 flex items-center shadow-inner ${darkMode ? 'bg-slate-700' : 'bg-brand-100'}`}
              >
                <div className={`w-9 h-9 rounded-full shadow-2xl transform transition-all duration-700 flex items-center justify-center ${darkMode ? 'translate-x-12 bg-slate-900 text-blue-300 rotate-[360deg]' : 'translate-x-0 bg-white text-yellow-500 rotate-0'}`}>
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                  <span className={`my-auto text-[9px] font-black tracking-tighter transition-all duration-700 ${darkMode ? 'opacity-100 scale-100 text-blue-100' : 'opacity-0 scale-50'}`}>LUA</span>
                  <span className={`my-auto text-[9px] font-black tracking-tighter transition-all duration-700 ${!darkMode ? 'opacity-100 scale-100 text-brand-600' : 'opacity-0 scale-50'}`}>SOL</span>
                </div>
              </button>
            </div>

            {/* Color Palette */}
            <div>
              <label className={labelClass}>{t('color_palette')}</label>
              <div className="grid grid-cols-3 gap-5">
                {(['DEFAULT', 'LAVENDER', 'GREEN'] as const).map((p) => (
                  <button 
                    key={p}
                    onClick={() => setPalette(p)}
                    className={`group flex flex-col items-center p-5 rounded-[2rem] border-4 transition-all active:scale-90 ${palette === p ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-xl' : 'border-transparent bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl mb-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all ${p === 'DEFAULT' ? 'bg-blue-600' : p === 'LAVENDER' ? 'bg-violet-600' : 'bg-emerald-600'}`} />
                    <span className="text-[11px] font-black uppercase tracking-tight dark:text-slate-300">
                      {p === 'DEFAULT' ? t('palette_default') : p === 'LAVENDER' ? t('palette_lavender') : t('palette_green')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preferências Regionais */}
        <div className={sectionClass}>
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-12 h-12 flex items-center justify-center bg-brand-100 dark:bg-brand-900/30 rounded-2xl text-brand-600 dark:text-brand-400 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M8 3.935A9 9 0 1116.065 19" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('regional')}</h3>
          </div>
          
          <div className="space-y-10">
            <div className="relative group">
              <label htmlFor="currency" className={labelClass}>{t('currency')}</label>
              <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value as any)} className={selectClass}>
                <option value="BRL">🇧🇷 Real Brasileiro (BRL)</option>
                <option value="USD">🇺🇸 Dólar Americano (USD)</option>
                <option value="EUR">🇪🇺 Euro Europeu (EUR)</option>
              </select>
              <div className="absolute right-6 bottom-5 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="relative group">
              <label htmlFor="language" className={labelClass}>{t('language')}</label>
              <select id="language" value={language} onChange={(e) => setLanguage(e.target.value as any)} className={selectClass}>
                <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                <option value="en-US">🇺🇸 English (United States)</option>
              </select>
              <div className="absolute right-6 bottom-5 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-brand-500/5 dark:bg-brand-400/5 rounded-[2.5rem] border-2 border-brand-500/10 backdrop-blur-sm">
            <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] mb-3">Nota do Sistema</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-bold">As moedas estrangeiras no dashboard são baseadas em conversões diárias em tempo real vindas do Banco Central.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
