import type { Transaction } from '../types/transaction';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';

interface SummaryProps {
  transactions: Transaction[];
}

export function Summary({ transactions }: SummaryProps) {
  const { t } = useTranslation();
  const { currency } = useSettings();

  const summary = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.type === 'INCOME') {
        acc.income += amount;
        acc.total += amount;
      } else {
        acc.expense += amount;
        acc.total -= amount;
      }
      return acc;
    },
    { income: 0, expense: 0, total: 0 }
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
      {/* Card de Entradas */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors" data-testid="card-income">
        <header className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-4">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">{t('income')}</span>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </header>
        <strong className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 tracking-tight" data-testid="summary-income">
          {formatCurrency(summary.income)}
        </strong>
      </div>

      {/* Card de Saídas */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors" data-testid="card-expense">
        <header className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-4">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">{t('expense')}</span>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
            </svg>
          </div>
        </header>
        <strong className="text-2xl sm:text-3xl font-black text-red-500 dark:text-red-400 tracking-tight" data-testid="summary-expense">
          {summary.expense === 0 ? formatCurrency(0) : `- ${formatCurrency(summary.expense)}`}
        </strong>
      </div>

      {/* Card de Total */}
      <div 
        className={`${summary.total >= 0 ? 'bg-brand-600 shadow-brand-500/30' : 'bg-red-600 dark:bg-red-700 shadow-red-500/30'} rounded-[2rem] p-6 sm:p-8 shadow-xl text-white sm:col-span-2 lg:col-span-1 transition-all duration-500`} 
        data-testid="card-total"
      >
        <header className="flex items-center justify-between mb-4">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] opacity-80">{t('total_balance')}</span>
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </header>
        <strong className="text-2xl sm:text-4xl font-black tracking-tighter" data-testid="summary-total">
          {formatCurrency(summary.total)}
        </strong>
      </div>
    </div>
  );
}
