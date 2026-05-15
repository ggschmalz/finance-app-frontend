import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../hooks/useSettings';
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

interface TransactionFormProps {
  onSubmit: (transaction: CreateTransactionDTO) => Promise<void>;
  transactionToEdit?: Transaction | null;
  setIsFormDirty: (isDirty: boolean) => void;
}

export function TransactionForm({ onSubmit, transactionToEdit, setIsFormDirty }: TransactionFormProps) {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setDescription('');
    setAmount('');
    setCategory('');
    setSubcategory('');
    setDate('');
    setType('EXPENSE');
  }, []);

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      const formattedAmount = Number(transactionToEdit.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      setAmount(formattedAmount);
      setCategory(transactionToEdit.category);
      setSubcategory(transactionToEdit.subcategory || '');
      setDate(transactionToEdit.date);
      setType(transactionToEdit.type);
    } else {
      resetForm();
    }
    setIsFormDirty(false);
  }, [transactionToEdit, setIsFormDirty, resetForm]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
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

  const inputClass = "w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl p-4 text-sm font-black focus:border-brand-500 dark:focus:border-brand-400 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700";

  return (
    <form onSubmit={handleSubmit} data-testid="transaction-form" className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 ml-2">Descrição</label>
          <input id="description" type="text" required placeholder="Ex: Compra no mercado" value={description} onChange={(e) => trackChange(setDescription, e.target.value)} className={inputClass} data-testid="input-description" />
        </div>

        <div>
          <label htmlFor="amount" className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 ml-2">Valor ({currency})</label>
          <input id="amount" type="text" required placeholder="0,00" value={amount} onChange={handleAmountChange} className={inputClass} data-testid="input-amount" />
        </div>

        <div>
          <label htmlFor="date" className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 ml-2">Data</label>
          <input id="date" type="date" required value={date} onChange={(e) => trackChange(setDate, e.target.value)} className={inputClass} data-testid="input-date" />
        </div>

        <div>
          <label htmlFor="category" className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 ml-2">Categoria</label>
          <select id="category" required value={category} onChange={(e) => { trackChange(setCategory, e.target.value); setSubcategory(''); }} className={inputClass} data-testid="select-category">
            <option value="" disabled className="dark:bg-slate-900">Selecione...</option>
            {Object.keys(CATEGORY_MAP).map(cat => (
              <option key={cat} value={cat} className="dark:bg-slate-900">{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subcategory" className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 ml-2">Subcategoria</label>
          <select id="subcategory" required disabled={!category} value={subcategory} onChange={(e) => trackChange(setSubcategory, e.target.value)} className={`${inputClass} disabled:opacity-30 disabled:grayscale`} data-testid="select-subcategory">
            <option value="" disabled className="dark:bg-slate-900">{category ? 'Selecione...' : 'Escolha a categoria'}</option>
            {availableSubcategories.map(sub => (
              <option key={sub} value={sub} className="dark:bg-slate-900">{sub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-8 mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-center sm:justify-start space-x-10">
          <label htmlFor="type-income" className="flex items-center space-x-3 cursor-pointer group">
            <input id="type-income" type="radio" name="type" value="INCOME" checked={type === 'INCOME'} onChange={() => { setType('INCOME'); setIsFormDirty(true); }} className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 border-slate-200 dark:border-slate-700 dark:bg-slate-900" data-testid="radio-income" />
            <span className={`text-xs font-black tracking-widest transition-colors ${type === 'INCOME' ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-500'}`}>{t('income').toUpperCase()}</span>
          </label>
          
          <label htmlFor="type-expense" className="flex items-center space-x-3 cursor-pointer group">
            <input id="type-expense" type="radio" name="type" value="EXPENSE" checked={type === 'EXPENSE'} onChange={() => { setType('EXPENSE'); setIsFormDirty(true); }} className="w-5 h-5 text-red-500 focus:ring-red-500 border-slate-200 dark:border-slate-700 dark:bg-slate-900" data-testid="radio-expense" />
            <span className={`text-xs font-black tracking-widest transition-colors ${type === 'EXPENSE' ? 'text-red-500' : 'text-slate-400 group-hover:text-slate-500'}`}>{t('expense').toUpperCase()}</span>
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className={`w-full sm:w-auto ${transactionToEdit ? 'bg-orange-500 hover:bg-orange-600' : 'bg-brand-600 hover:bg-brand-700'} text-white font-black uppercase tracking-widest py-4 px-12 rounded-2xl disabled:opacity-50 transition-all active:scale-95 shadow-xl shadow-brand-500/20`} data-testid="submit-button">
          {isSubmitting ? '...' : (transactionToEdit ? 'Atualizar' : 'Confirmar')}
        </button>
      </div>
    </form>
  );
}
