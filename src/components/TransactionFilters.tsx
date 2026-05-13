import { useMemo } from 'react';
import type { Transaction } from '../types/transaction';
import { useTranslation } from 'react-i18next';

interface FiltersProps {
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  subcategoryFilter: string;
  setSubcategoryFilter: (val: string) => void;
  yearFilter: string;
  setYearFilter: (val: string) => void;
  transactions: Transaction[];
  categoryMap: Record<string, string[]>;
}

export function TransactionFilters({
  typeFilter, setTypeFilter,
  categoryFilter, setCategoryFilter,
  subcategoryFilter, setSubcategoryFilter,
  yearFilter, setYearFilter,
  transactions, categoryMap
}: FiltersProps) {
  const { t } = useTranslation();

  const availableYears = useMemo(() => {
    const years = transactions.map(t => new Date(t.date).getFullYear().toString());
    const currentYear = new Date().getFullYear().toString();
    const uniqueYears = Array.from(new Set([...years, currentYear])).sort((a, b) => b.localeCompare(a));
    return uniqueYears;
  }, [transactions]);

  const availableSubcategories = categoryFilter !== 'ALL' ? categoryMap[categoryFilter] || [] : [];

  const selectClass = "w-full border-2 border-slate-50 dark:border-slate-700 rounded-2xl p-4 text-sm font-black bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer shadow-inner";

  return (
    <div className="space-y-4" data-testid="filter-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        <div className="relative group">
          <label htmlFor="filter-type" className="block text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-2">Tipo</label>
          <select id="filter-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass} data-testid="filter-type">
            <option value="ALL" className="dark:bg-slate-900">Todos</option>
            <option value="INCOME" className="dark:bg-slate-900">{t('income')}</option>
            <option value="EXPENSE" className="dark:bg-slate-900">{t('expense')}</option>
          </select>
          <div className="absolute right-5 bottom-4 pointer-events-none text-slate-300 dark:text-slate-600">▼</div>
        </div>

        <div className="relative group">
          <label htmlFor="filter-year" className="block text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-2">Ano</label>
          <select id="filter-year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className={selectClass} data-testid="filter-year">
            <option value="ALL" className="dark:bg-slate-900">Todos</option>
            {availableYears.map(year => (
              <option key={year} value={year} className="dark:bg-slate-900">{year}</option>
            ))}
          </select>
          <div className="absolute right-5 bottom-4 pointer-events-none text-slate-300 dark:text-slate-600">▼</div>
        </div>

        <div className="relative group">
          <label htmlFor="filter-category" className="block text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-2">Categoria</label>
          <select id="filter-category" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setSubcategoryFilter('ALL'); }} className={selectClass} data-testid="filter-category">
            <option value="ALL" className="dark:bg-slate-900">Todas</option>
            {Object.keys(categoryMap).map(cat => (
              <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
            ))}
          </select>
          <div className="absolute right-5 bottom-4 pointer-events-none text-slate-300 dark:text-slate-600">▼</div>
        </div>

        <div className="relative group">
          <label htmlFor="filter-subcategory" className="block text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-2">Subcategoria</label>
          <select id="filter-subcategory" value={subcategoryFilter} onChange={(e) => setSubcategoryFilter(e.target.value)} disabled={categoryFilter === 'ALL'} className={`${selectClass} disabled:opacity-30 disabled:grayscale`} data-testid="filter-subcategory">
            <option value="ALL" className="dark:bg-slate-900">Todas</option>
            {availableSubcategories.map(sub => (
              <option key={sub} value={sub} className="dark:bg-slate-900">{sub}</option>
            ))}
          </select>
          <div className="absolute right-5 bottom-4 pointer-events-none text-slate-300 dark:text-slate-600">▼</div>
        </div>

      </div>
    </div>
  );
}
