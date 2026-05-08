import { useEffect, useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { TransactionTable } from '../components/TransactionTable';
import { Summary } from '../components/Summary';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionFilters } from '../components/TransactionFilters';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { transactionService } from '../services/transactionService';
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  
  // Estados de Validação
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  // Estados dos Filtros
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
      {/* Cabeçalho da Seção de Transações */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800" data-testid="page-title">Controle de Transações</h2>
          <p className="text-sm text-gray-500 mt-1">Gerencie suas entradas e saídas financeiras.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm flex items-center space-x-2"
          data-testid="btn-new-transaction"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Nova Transação</span>
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">A carregar dados...</div>
      ) : (
        <>
          <Summary transactions={filteredTransactions} />
          
          {/* Barra de Busca Rápida e Botão de Filtros */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Pesquisar por descrição, categoria, data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                data-testid="search-input"
              />
            </div>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`px-4 py-2 rounded-md font-medium transition-colors border flex items-center space-x-2
                ${hasActiveFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              data-testid="btn-open-filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              <span>Filtros {hasActiveFilters && '*'}</span>
            </button>
          </div>

          <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Filtros Avançados">
            <TransactionFilters 
              typeFilter={typeFilter} setTypeFilter={setTypeFilter}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              subcategoryFilter={subcategoryFilter} setSubcategoryFilter={setSubcategoryFilter}
              yearFilter={yearFilter} setYearFilter={setYearFilter}
              transactions={transactions} 
              categoryMap={CATEGORY_MAP}
            />
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
              <button onClick={clearFilters} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" data-testid="btn-clear-filters">Limpar Filtros</button>
              <button onClick={() => setIsFilterModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors" data-testid="btn-apply-filters">Aplicar</button>
            </div>
          </Modal>
          
          <Modal isOpen={isModalOpen} onClose={handleAttemptCloseModal} title={transactionToEdit ? 'Editar Transação' : 'Nova Transação'}>
            <TransactionForm onSubmit={handleSaveTransaction} transactionToEdit={transactionToEdit} setIsFormDirty={setIsFormDirty} />
          </Modal>

          <ConfirmModal isOpen={showCloseConfirm} title="Descartar alterações?" message="Tem alterações não guardadas. Tem a certeza de que deseja fechar? Os dados serão perdidos." confirmText="Sim, descartar" onConfirm={forceCloseModal} onCancel={() => setShowCloseConfirm(false)} />
          <ConfirmModal isOpen={transactionToDelete !== null} title="Excluir Transação" message="Tem a certeza de que deseja excluir esta transação? Esta ação não pode ser desfeita." confirmText="Excluir" onConfirm={confirmDelete} onCancel={() => setTransactionToDelete(null)} />
          
          <TransactionTable transactions={filteredTransactions} onEdit={handleEditClick} onDelete={(id) => setTransactionToDelete(id)} />
        </>
      )}
    </Layout>
  );
}