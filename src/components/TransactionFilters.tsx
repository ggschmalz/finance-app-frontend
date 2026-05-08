import { useMemo } from 'react';
import type { Transaction } from '../types/transaction'; // <-- Tipagem importada

interface FiltersProps {
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  subcategoryFilter: string;
  setSubcategoryFilter: (val: string) => void;
  yearFilter: string;
  setYearFilter: (val: string) => void;
  transactions: Transaction[]; // <-- 'any[]' substituído por 'Transaction[]'
  categoryMap: Record<string, string[]>;
}

export function TransactionFilters({
  typeFilter, setTypeFilter,
  categoryFilter, setCategoryFilter,
  subcategoryFilter, setSubcategoryFilter,
  yearFilter, setYearFilter,
  transactions, categoryMap
}: FiltersProps) {

  const availableYears = useMemo(() => {
    const years = transactions.map(t => new Date(t.date).getFullYear().toString());
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const availableSubcategories = categoryFilter !== 'ALL' ? categoryMap[categoryFilter] || [] : [];

  return (
    <div className="space-y-4" data-testid="filter-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Filtro de Tipo */}
        <div>
          <label htmlFor="filter-type" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tipo</label>
          <select id="filter-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white" data-testid="filter-type">
            <option value="ALL">Todos os Tipos</option>
            <option value="INCOME">Entradas</option>
            <option value="EXPENSE">Saídas</option>
          </select>
        </div>

        {/* Filtro de Ano */}
        <div>
          <label htmlFor="filter-year" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ano</label>
          <select id="filter-year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white" data-testid="filter-year">
            <option value="ALL">Todos os Anos</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Categoria */}
        <div>
          <label htmlFor="filter-category" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Categoria</label>
          <select id="filter-category" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setSubcategoryFilter('ALL'); }} className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white" data-testid="filter-category">
            <option value="ALL">Todas as Categorias</option>
            {Object.keys(categoryMap).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Filtro de Subcategoria */}
        <div>
          <label htmlFor="filter-subcategory" className="block text-xs font-semibold text-gray-500 uppercase mb-1">Subcategoria</label>
          <select id="filter-subcategory" value={subcategoryFilter} onChange={(e) => setSubcategoryFilter(e.target.value)} disabled={categoryFilter === 'ALL'} className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white disabled:bg-gray-100" data-testid="filter-subcategory">
            <option value="ALL">Todas as Subcategorias</option>
            {availableSubcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}