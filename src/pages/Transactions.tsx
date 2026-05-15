import { useEffect, useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { TransactionTable } from '../components/TransactionTable';
import { Summary } from '../components/Summary';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionFilters } from '../components/TransactionFilters';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { transactionService } from '../services/transactionService';
import { useTranslation } from 'react-i18next';
import type { CreateTransactionDTO } from '../services/transactionService';
import type { Transaction } from '../types/transaction';

const CATEGORY_MAP: Record<string, string[]> = {
  'Moradia': ['Aluguel', 'Energia', 'Água', 'Internet'],
  'Alimentação': ['Supermercado', 'Delivery', 'Restaurante'],
  'Transporte': ['Combustível', 'Uber', 'Transporte Público'],
  'Lazer': ['Cinema', 'Shows', 'Assinaturas'],
  'Saúde': ['Plano de Saúde', 'Farmácia', 'Consultas'],
  'Outros': ['Diversos']
};

export function Transactions() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [subcategoryFilter, setSubcategoryFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower) ||
        (t.subcategory || '').toLowerCase().includes(searchLower) ||
        t.date.includes(searchTerm);

      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;
      const matchesSubcategory = subcategoryFilter === 'ALL' || t.subcategory === subcategoryFilter;
      const matchesYear = yearFilter === 'ALL' || new Date(t.date).getFullYear().toString() === yearFilter;

      return matchesSearch && matchesType && matchesCategory && matchesSubcategory && matchesYear;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter, subcategoryFilter, yearFilter]);

  const clearFilters = () => {
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setSubcategoryFilter('ALL');
    setYearFilter('ALL');
  };

  function handleAttemptCloseModal() {
    if (isFormDirty) setShowCloseConfirm(true);
    else forceCloseModal();
  }

  function forceCloseModal() {
    setIsModalOpen(false);
    setTransactionToEdit(null);
    setIsFormDirty(false);
    setShowCloseConfirm(false);
  }

  function handleEditClick(transaction: Transaction) {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  }

  async function handleSaveTransaction(transactionData: CreateTransactionDTO) {
    try {
      if (transactionToEdit) {
        const updated = await transactionService.update(transactionToEdit.id, transactionData);
        setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await transactionService.create(transactionData);
        setTransactions((prev) => [created, ...prev]);
      }
      forceCloseModal();
    } catch (error) {
      console.error('Erro ao processar transação:', error);
      throw error;
    }
  }

  async function confirmDelete() {
    if (!transactionToDelete) return;
    try {
      await transactionService.delete(transactionToDelete);
      setTransactions((prev) => prev.filter((t) => t.id !== transactionToDelete));
    } catch (error) {
      console.error('Erro ao excluir transação', error);
    } finally {
      setTransactionToDelete(null);
    }
  }

  const hasActiveFilters = typeFilter !== 'ALL' || categoryFilter !== 'ALL' || yearFilter !== 'ALL';

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 gap-4 transition-all">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter" data-testid="page-title">{t('transactions')}</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 font-medium italic opacity-80">Gestão financeira total.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-500/20 flex justify-center items-center space-x-3 active:scale-95"
          data-testid="btn-new-transaction"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">{t('new_transaction')}</span>
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-32 text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] animate-pulse">Sincronizando dados...</div>
      ) : (
        <>
          <Summary transactions={filteredTransactions} />
          
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700/50 mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6 transition-colors">
            <div className="flex-1 w-full relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 group-focus-within:text-brand-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-2 border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold focus:border-brand-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
                data-testid="search-input"
              />
            </div>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all border-2 flex justify-center items-center space-x-3 text-[10px] shadow-sm active:scale-95
                ${hasActiveFilters 
                  ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300' 
                  : 'bg-white dark:bg-slate-700 border-slate-50 dark:border-slate-600 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
              data-testid="btn-open-filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              <span>{t('filters')} {hasActiveFilters && '*'}</span>
            </button>
          </div>

          <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Personalizar Filtros">
            <TransactionFilters 
              typeFilter={typeFilter} setTypeFilter={setTypeFilter}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              subcategoryFilter={subcategoryFilter} setSubcategoryFilter={setSubcategoryFilter}
              yearFilter={yearFilter} setYearFilter={setYearFilter}
              transactions={transactions} 
              categoryMap={CATEGORY_MAP}
            />
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row justify-end gap-4">
              <button onClick={clearFilters} className="w-full sm:w-auto px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all" data-testid="btn-clear-filters">Limpar Tudo</button>
              <button onClick={() => setIsFilterModalOpen(false)} className="w-full sm:w-auto px-12 py-3 text-xs font-black uppercase tracking-widest bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-lg active:scale-95 transition-all" data-testid="btn-apply-filters">Aplicar Filtros</button>
            </div>
          </Modal>
          
          <Modal isOpen={isModalOpen} onClose={handleAttemptCloseModal} title={transactionToEdit ? 'Modificar Registro' : 'Lançar Nova Transação'}>
            <TransactionForm onSubmit={handleSaveTransaction} transactionToEdit={transactionToEdit} setIsFormDirty={setIsFormDirty} />
          </Modal>

          <ConfirmModal isOpen={showCloseConfirm} title="Cancelar Lançamento?" message="Você tem modificações não salvas no formulário. Deseja realmente descartar os dados?" confirmText="Sim, Descartar" onConfirm={forceCloseModal} onCancel={() => setShowCloseConfirm(false)} />
          <ConfirmModal isOpen={transactionToDelete !== null} title="Excluir Definitivamente?" message="Esta operação irá remover o registro permanentemente do banco de dados. Confirmar exclusão?" confirmText="Sim, Excluir" onConfirm={confirmDelete} onCancel={() => setTransactionToDelete(null)} />
          
          <TransactionTable transactions={filteredTransactions} onEdit={handleEditClick} onDelete={(id) => setTransactionToDelete(id)} />
        </>
      )}
    </Layout>
  );
}
