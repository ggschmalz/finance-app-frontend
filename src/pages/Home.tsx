import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const operationalCards = [
    {
      id: 'card-dashboard',
      title: 'Relatório',
      description: 'Acompanhe indicadores anuais, balanço consolidado e evolução mensal.',
      path: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'card-transactions',
      title: 'Transações',
      description: 'Gerencie receitas, despesas, filtros avançados e lançamentos contábeis.',
      path: '/transactions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'card-credit-cards',
      title: 'Cartões de Crédito',
      description: 'Controle de faturas mensais, compras individuais e regime de vencimentos.',
      path: '/credit-cards',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'card-settings',
      title: 'Configurações',
      description: 'Personalize moeda, idioma e temas de exibição visual da sua conta.',
      path: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-10">
        {/* Cabeçalho de Boas-Vindas */}
        <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span
                data-testid="user-role-badge"
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                }`}
              >
                {isAdmin ? 'Administrador' : 'Usuário Padrão'}
              </span>
            </div>
            <h2
              data-testid="welcome-heading"
              className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter"
            >
              Olá, {user?.name || 'Usuário'}! O que você deseja fazer hoje?
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
              Selecione uma das funcionalidades abaixo para gerenciar suas finanças com agilidade.
            </p>
          </div>
        </div>

        {/* Grid de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operationalCards.map((card) => (
            <button
              key={card.id}
              data-testid={card.id}
              onClick={() => navigate(card.path)}
              className="group text-left bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="flex items-start justify-between w-full">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Acessar →
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </button>
          ))}

          {/* Card Administrativo: apenas para role ADMIN */}
          {isAdmin && (
            <button
              data-testid="card-users"
              onClick={() => navigate('/users')}
              className="group text-left bg-gradient-to-br from-purple-500/5 via-white to-purple-500/10 dark:from-purple-950/20 dark:via-slate-800 dark:to-purple-950/30 p-8 rounded-[2rem] border-2 border-purple-200 dark:border-purple-800/40 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="flex items-start justify-between w-full">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/40 rounded-2xl group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                  Gestão Admin →
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  Gestão de Usuários
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Controle administrativo de contas, aprovação de acessos e atribuição de papéis.
                </p>
              </div>
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
