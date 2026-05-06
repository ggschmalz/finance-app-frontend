import { useEffect, useState } from 'react';
import { TransactionTable } from './components/TransactionTable';
import { Summary } from './components/Summary';
import { TransactionForm } from './components/TransactionForm';
import type { transactionService, CreateTransactionDTO } from './services/transactionService';
import type { Transaction } from './types/transaction';

export function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadTransactions();
  }, []);

  // Nova função para lidar com o cadastro
  async function handleCreateTransaction(newTransaction: CreateTransactionDTO) {
    try {
      // Envia para o backend (JSON Server)
      const createdTransaction = await transactionService.create(newTransaction);
      
      // Atualiza o estado local do frontend adicionando o novo item no final da lista
      setTransactions((prevTransactions) => [...prevTransactions, createdTransaction]);
    } catch (error) {
      console.error('Erro ao processar nova transação:', error);
      throw error; // Repassa o erro para o formulário tratar (remover o loading)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira SAGUI</h1>
        </header>
        
        <main>
          {loading ? (
            <div data-testid="global-loading" className="text-center py-10">Carregando dados...</div>
          ) : (
            <>
              <Summary transactions={transactions} />
              
              {/* Renderizamos o formulário injetando a função de criar */}
              <TransactionForm onSubmit={handleCreateTransaction} />
              
              <TransactionTable transactions={transactions} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;