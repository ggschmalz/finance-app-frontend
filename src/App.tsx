import { useEffect, useState } from 'react';
import { TransactionTable } from './components/TransactionTable';
import { Summary } from './components/Summary';
import { TransactionForm } from './components/TransactionForm';
import { Modal } from './components/Modal';
import { ConfirmModal } from './components/ConfirmModal'; // <- NOVO
import { transactionService } from './services/transactionService';
import type { CreateTransactionDTO } from './services/transactionService';
import type { Transaction } from './types/transaction';

export function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados Principais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  
  // Estados de Validação (Item 1 e 2)
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

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

  // Tentar fechar o modal principal (valida se tem dados não salvos)
  function handleAttemptCloseModal() {
    if (isFormDirty) {
      setShowCloseConfirm(true);
    } else {
      forceCloseModal();
    }
  }

  // Força o fechamento real
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

  // Executa a exclusão de fato
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira MonetizAI</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
          >
            + Nova Transação
          </button>
        </header>
        
        <main>
          {loading ? (
            <div className="text-center py-10">Carregando dados...</div>
          ) : (
            <>
              <Summary transactions={transactions} />
              
              {/* Modal do Formulário */}
              <Modal 
                isOpen={isModalOpen} 
                onClose={handleAttemptCloseModal} // Agora intercepta o fechamento
                title={transactionToEdit ? 'Editar Transação' : 'Nova Transação'}
              >
                <TransactionForm 
                  onSubmit={handleSaveTransaction} 
                  transactionToEdit={transactionToEdit}
                  setIsFormDirty={setIsFormDirty}
                />
              </Modal>

              {/* Modal de Confirmação de Perda de Dados (Fechar sem salvar) */}
              <ConfirmModal
                isOpen={showCloseConfirm}
                title="Descartar alterações?"
                message="Você tem alterações não salvas. Tem certeza que deseja fechar? Os dados serão perdidos."
                confirmText="Sim, descartar"
                onConfirm={forceCloseModal}
                onCancel={() => setShowCloseConfirm(false)}
              />

              {/* Modal de Confirmação de Exclusão */}
              <ConfirmModal
                isOpen={transactionToDelete !== null}
                title="Excluir Transação"
                message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
                confirmText="Excluir"
                onConfirm={confirmDelete}
                onCancel={() => setTransactionToDelete(null)}
              />
              
              <TransactionTable 
                transactions={transactions} 
                onEdit={handleEditClick}
                onDelete={(id) => setTransactionToDelete(id)} // Abre o modal em vez de usar window.confirm
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;