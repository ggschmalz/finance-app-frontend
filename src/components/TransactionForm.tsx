import { useState, useEffect } from 'react';
import type { CreateTransactionDTO } from '../services/transactionService';
import type { Transaction } from '../types/transaction';

// Dicionário de Categorias e Subcategorias
const CATEGORY_MAP: Record<string, string[]> = {
  'Moradia': ['Aluguel', 'Energia', 'Água', 'Internet'],
  'Alimentação': ['Supermercado', 'Delivery', 'Restaurante'],
  'Transporte': ['Combustível', 'Uber', 'Transporte Público'],
  'Lazer': ['Cinema', 'Shows', 'Assinaturas'],
  'Saúde': ['Plano de Saúde', 'Farmácia', 'Consultas'],
  'Outros': ['Diversos']
};

interface TransactionFormProps {
  onSubmit: (transaction: CreateTransactionDTO) => Promise<void>;
  transactionToEdit?: Transaction | null;
  setIsFormDirty: (isDirty: boolean) => void;
}

export function TransactionForm({ onSubmit, transactionToEdit, setIsFormDirty }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      // Formata o valor que vem do banco para o padrão brasileiro no input
      const formattedAmount = Number(transactionToEdit.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      setAmount(formattedAmount);
      setCategory(transactionToEdit.category);
      setSubcategory(transactionToEdit.subcategory || '');
      setDate(transactionToEdit.date);
      setType(transactionToEdit.type);
    } else {
      resetForm();
    }
    setIsFormDirty(false); // Reseta a flag de alterações ao carregar
  }, [transactionToEdit, setIsFormDirty]);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setSubcategory('');
    setDate('');
    setType('EXPENSE');
  };

  // Função para aplicar a MÁSCARA de Moeda (Item 4)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (!rawValue) {
      setAmount('');
      return;
    }
    const floatValue = parseInt(rawValue, 10) / 100;
    setAmount(floatValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setIsFormDirty(true);
  };

  const trackChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value);
    setIsFormDirty(true);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Converte a string "1.000,50" de volta para o float 1000.50 do backend
    const numericAmount = Number(amount.replace(/\./g, '').replace(',', '.'));

    try {
      await onSubmit({
        description,
        amount: numericAmount,
        category,
        subcategory,
        date,
        type,
      });
      resetForm();
      setIsFormDirty(false);
    } catch (error) {
      console.error('Erro ao enviar', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSubcategories = category ? CATEGORY_MAP[category] || [] : [];

  return (
    <form onSubmit={handleSubmit} data-testid="transaction-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input type="text" required placeholder="Ex: Compra no mercado" value={description} onChange={(e) => trackChange(setDescription, e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500" data-testid="input-description" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
          <input type="text" required placeholder="0,00" value={amount} onChange={handleAmountChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500" data-testid="input-amount" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input type="date" required value={date} onChange={(e) => trackChange(setDate, e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500" data-testid="input-date" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select required value={category} onChange={(e) => { trackChange(setCategory, e.target.value); setSubcategory(''); }} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 bg-white" data-testid="select-category">
            <option value="" disabled>Selecione uma categoria...</option>
            {Object.keys(CATEGORY_MAP).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
          <select required disabled={!category} value={subcategory} onChange={(e) => trackChange(setSubcategory, e.target.value)} className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 bg-white disabled:bg-gray-100" data-testid="select-subcategory">
            <option value="" disabled>{category ? 'Selecione uma subcategoria...' : 'Escolha a categoria primeiro'}</option>
            {availableSubcategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="type" value="INCOME" checked={type === 'INCOME'} onChange={() => trackChange(setType, 'INCOME')} className="text-green-600 focus:ring-green-500" data-testid="radio-income" />
            <span className="text-sm font-medium text-gray-700">Entrada</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="type" value="EXPENSE" checked={type === 'EXPENSE'} onChange={() => trackChange(setType, 'EXPENSE')} className="text-red-600 focus:ring-red-500" data-testid="radio-expense" />
            <span className="text-sm font-medium text-gray-700">Saída</span>
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className={`${transactionToEdit ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-6 rounded-md disabled:opacity-50 transition-colors`} data-testid="submit-button">
          {isSubmitting ? 'Salvando...' : (transactionToEdit ? 'Atualizar' : 'Adicionar')}
        </button>
      </div>
    </form>
  );
}