import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { creditCardService } from '../services/creditCardService';
import type { CreditCardInvoice } from '../services/creditCardService';

export function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<CreditCardInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) loadInvoice(id);
  }, [id]);

  async function loadInvoice(invoiceId: string) {
    try {
      const data = await creditCardService.getInvoiceById(invoiceId);
      setInvoice(data);
    } catch (error) {
      console.error('Erro ao carregar detalhes da fatura:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !description.trim() || !amount) return;
    setIsSubmitting(true);
    try {
      const parsedAmount = parseFloat(amount.replace(',', '.'));
      const created = await creditCardService.createExpense({
        invoice: id,
        description: description.trim(),
        amount: parsedAmount,
        category,
        date
      });
      setInvoice((prev) => {
        if (!prev) return null;
        const updatedTransactions = [...(prev.transactions || []), created];
        const newTotal = updatedTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
        return {
          ...prev,
          total_amount: newTotal,
          transactions: updatedTransactions
        };
      });
      setDescription('');
      setAmount('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao lançar gasto:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteExpense(expenseId: string) {
    try {
      await creditCardService.deleteExpense(expenseId);
      setInvoice((prev) => {
        if (!prev) return null;
        const updatedTransactions = (prev.transactions || []).filter((t) => t.id !== expenseId);
        const newTotal = updatedTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);
        return {
          ...prev,
          total_amount: newTotal,
          transactions: updatedTransactions
        };
      });
    } catch (error) {
      console.error('Erro ao excluir gasto:', error);
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/credit-cards')}
              className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 text-slate-500"
              title="Voltar para faturas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                Detalhes da Fatura
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                {invoice?.description} • Vencimento: {invoice?.due_date}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-500/20 flex justify-center items-center space-x-3 active:scale-95"
            data-testid="btn-add-expense"
          >
            <span className="text-xs">Lançar Gasto</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-32 text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] animate-pulse">
            Sincronizando faturas...
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Acumulado</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  R$ {Number(invoice?.total_amount || 0).toFixed(2)}
                </p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                invoice?.is_paid
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                {invoice?.is_paid ? 'Pago' : 'Pendente'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="pb-4">Descrição</th>
                    <th className="pb-4">Categoria</th>
                    <th className="pb-4">Data</th>
                    <th className="pb-4 text-right">Valor</th>
                    <th className="pb-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {(invoice?.transactions || []).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 font-bold text-slate-900 dark:text-white text-sm">{t.description}</td>
                      <td className="py-4 text-xs font-semibold text-slate-500">{t.category}</td>
                      <td className="py-4 text-xs font-semibold text-slate-400">{t.date}</td>
                      <td className="py-4 text-right font-black text-slate-900 dark:text-white text-sm">
                        R$ {Number(t.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(t.id)}
                          className="px-3 py-1 rounded-xl text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          title="Excluir Gasto"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Novo Gasto na Fatura"
        >
          <form onSubmit={handleAddExpense} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-2">Descrição</label>
              <input
                type="text"
                required
                placeholder="Ex: Uber, Restaurante"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-sm font-black focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-2">Valor (R$)</label>
              <input
                type="text"
                required
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-sm font-black focus:border-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-2">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-sm font-black focus:border-brand-500 outline-none"
              >
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Saúde">Saúde</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-black text-slate-400 mb-2">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 text-sm font-black focus:border-brand-500 outline-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-600 hover:bg-brand-700 text-white font-black uppercase tracking-widest py-4 px-10 rounded-2xl transition-all shadow-xl shadow-brand-500/20"
              >
                Adicionar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
