import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { creditCardService } from '../services/creditCardService';
import type { CreditCardInvoice, CreditCardTransaction } from '../services/creditCardService';

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<CreditCardInvoice | null>(null);
  const [expenses, setExpenses] = useState<CreditCardTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<CreditCardTransaction | null>(null);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadInvoice(id);
    }
  }, [id]);

  async function loadInvoice(invoiceId: string) {
    try {
      const data = await creditCardService.getInvoiceById(invoiceId);
      setInvoice(data);
      setExpenses(data.transactions || []);
    } catch (error) {
      console.error('Erro ao carregar detalhes da fatura:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalAmount = useMemo(() => {
    if (expenses.length > 0) {
      return expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    }
    return 0;
  }, [expenses]);

  function openNewModal() {
    setEditingExpense(null);
    setDescription('');
    setAmount('');
    setCategory('');
    setDate('');
    setIsModalOpen(true);
  }

  function openEditModal(expense: CreditCardTransaction) {
    setEditingExpense(expense);
    setDescription(expense.description);
    const formatted = Number(expense.amount).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setAmount(formatted);
    setCategory(expense.category);
    setDate(expense.date);
    setIsModalOpen(true);
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) {
      setAmount('');
      return;
    }
    const floatVal = parseInt(digits, 10) / 100;
    setAmount(
      floatVal.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  function parseAmount(raw: string): number {
    if (!raw) return 0;
    if (raw.includes(',')) {
      return parseFloat(raw.replace(/\./g, '').replace(',', '.')) || 0;
    }
    return parseFloat(raw) || 0;
  }

  async function handleSaveExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    const numericAmount = parseAmount(amount);

    try {
      if (editingExpense) {
        const updated = await creditCardService.updateExpense(editingExpense.id, {
          description,
          amount: numericAmount,
          category,
          date
        });
        const merged: CreditCardTransaction = {
          ...editingExpense,
          ...updated,
          amount: Number(updated?.amount ?? numericAmount)
        };
        setExpenses((prev) =>
          prev.map((item) => (item.id === editingExpense.id ? merged : item))
        );
      } else {
        const created = await creditCardService.createExpense({
          invoice: id,
          description,
          amount: numericAmount,
          category,
          date
        });
        const normalized: CreditCardTransaction = {
          ...created,
          amount: Number(created?.amount ?? numericAmount)
        };
        setExpenses((prev) => [...prev, normalized]);
      }
      setIsModalOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error('Erro ao salvar gasto na fatura:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteExpense(expenseId: string) {
    try {
      await creditCardService.deleteExpense(expenseId);
      setExpenses((prev) => prev.filter((item) => item.id !== expenseId));
    } catch (error) {
      console.error('Erro ao excluir gasto da fatura:', error);
    }
  }

  return (
    <Layout>
      <div className="mb-8 flex items-center space-x-4">
        <button
          type="button"
          onClick={() => navigate('/credit-cards')}
          className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            {invoice?.description || 'Detalhes da Fatura'}
          </h2>
          <span className="text-xl font-bold text-slate-400 dark:text-slate-500">
            {invoice?.due_date || ''}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-xs font-black text-slate-300 uppercase tracking-widest animate-pulse">
          Sincronizando dados...
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                Valor Total da Fatura
              </p>
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                R$ {totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              data-testid="btn-new-card-expense"
              onClick={openNewModal}
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-brand-500/20"
            >
              Novo Gasto
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="py-5 px-6">Descrição</th>
                  <th className="py-5 px-6">Categoria</th>
                  <th className="py-5 px-6">Data</th>
                  <th className="py-5 px-6">Valor</th>
                  <th className="py-5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {expense.description}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                      {expense.category}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                      {expense.date}
                    </td>
                    <td className="py-4 px-6 font-black text-red-500">
                      R$ {Number(expense.amount).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        title="Editar"
                        data-testid="btn-edit-expense"
                        onClick={() => openEditModal(expense)}
                        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        title="Excluir"
                        data-testid="btn-delete-expense"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Editar Gasto' : 'Lançar Gasto no Cartão'}
      >
        <form onSubmit={handleSaveExpense} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 ml-2">
              Descrição
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Compra no mercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl p-4 text-sm font-black outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 ml-2">
              Valor
            </label>
            <input
              type="text"
              required
              placeholder="0,00"
              value={amount}
              onChange={handleAmountChange}
              className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl p-4 text-sm font-black outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 ml-2">
              Categoria
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Alimentação"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl p-4 text-sm font-black outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 ml-2">
              Data da Compra
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl p-4 text-sm font-black outline-none"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white font-black uppercase tracking-widest py-4 px-10 rounded-2xl transition-all"
            >
              Salvar Gasto
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
