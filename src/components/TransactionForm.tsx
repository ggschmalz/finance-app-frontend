import { useState } from 'react';
import type { CreateTransactionDTO } from '../services/transactionService';

interface TransactionFormProps {
  onSubmit: (transaction: CreateTransactionDTO) => Promise<void>;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        description,
        amount: Number(amount), // Garante que o valor vá como número para a API
        category,
        date,
        type,
      });

      // Limpa os campos após o sucesso
      setDescription('');
      setAmount('');
      setCategory('');
      setDate('');
      setType('EXPENSE');
    } catch (error) {
      console.error('Erro ao enviar transação', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white rounded-lg shadow p-6 mb-8"
      data-testid="transaction-form"
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Nova Transação</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Conta de Luz"
            data-testid="input-description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
          <input
            type="number"
            required
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 150.00"
            data-testid="input-amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Moradia"
            data-testid="input-category"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            data-testid="input-date"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="INCOME"
              checked={type === 'INCOME'}
              onChange={() => setType('INCOME')}
              className="text-green-600 focus:ring-green-500"
              data-testid="radio-income"
            />
            <span className="text-sm font-medium text-gray-700">Entrada</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="EXPENSE"
              checked={type === 'EXPENSE'}
              onChange={() => setType('EXPENSE')}
              className="text-red-600 focus:ring-red-500"
              data-testid="radio-expense"
            />
            <span className="text-sm font-medium text-gray-700">Saída</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50 transition-colors"
          data-testid="submit-button"
        >
          {isSubmitting ? 'Salvando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}