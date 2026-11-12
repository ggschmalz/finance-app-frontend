import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { creditCardService } from '../services/creditCardService';
import type { CreditCardInvoice } from '../services/creditCardService';

export function CreditCards() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<CreditCardInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      const data = await creditCardService.getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Erro ao carregar faturas de cartão:', error);
    } finally {
      setLoading(false);
    }
  }

  const sortedInvoices = useMemo(() => {
    return [...invoices].sort((a, b) => (b.due_date || '').localeCompare(a.due_date || ''));
  }, [invoices]);

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || !dueDate) return;
    setIsSubmitting(true);
    try {
      const created = await creditCardService.createInvoice({
        description: description.trim(),
        due_date: dueDate
      });
      setInvoices((prev) => [created, ...prev]);
      setDescription('');
      setDueDate('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTogglePaid(invoice: CreditCardInvoice) {
    try {
      const newStatus = !invoice.is_paid;
      await creditCardService.updateInvoice(invoice.id, {
        is_paid: newStatus
      });
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoice.id ? { ...inv, is_paid: newStatus } : inv))
      );
    } catch (error) {
      console.error('Erro ao atualizar status da fatura:', error);
    }
  }

  async function handleDeleteInvoice(id: string) {
    try {
      await creditCardService.deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error('Erro ao excluir fatura:', error);
    }
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 gap-4 transition-all">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
            Cartões de Crédito
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1 font-medium italic opacity-80">
            Gestão de faturas e controle mensal de vencimentos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-500/20 flex justify-center items-center space-x-3 active:scale-95"
          data-testid="btn-new-invoice"
        >
          <span className="text-xs">Nova Fatura</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-32 text-xs font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] animate-pulse">
          Sincronizando dados...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedInvoices.map((invoice) => (
            <div
              key={invoice.id}
              data-testid="invoice-card"
              className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {invoice.description}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">
                    Vencimento: {invoice.due_date}
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    invoice.is_paid
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  {invoice.is_paid ? 'Pago' : 'Pendente'}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                  Total da Fatura
                </p>
                <p
                  data-testid="invoice-total"
                  className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter"
                >
                  R$ {Number(invoice.total_amount || 0).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  type="button"
                  data-testid="btn-toggle-payment"
                  onClick={() => handleTogglePaid(invoice)}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  {invoice.is_paid ? 'Marcar como Pendente' : 'Marcar como Pago'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/credit-cards/invoice/${invoice.id}`)}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-brand-600 hover:bg-brand-700 text-white transition-all"
                >
                  Ver Detalhes
                </button>
                <button
                  type="button"
                  data-testid="btn-delete-invoice"
                  onClick={() => handleDeleteInvoice(invoice.id)}
                  className="ml-auto px-3 py-2.5 rounded-xl text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Excluir Fatura"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Fatura de Cartão"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 ml-2">
              Descrição da Fatura
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Fatura Novembro 2026"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl p-4 text-sm font-black focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 ml-2">
              Data de Vencimento
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white rounded-2xl p-4 text-sm font-black focus:border-brand-500 outline-none transition-all"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand-600 hover:bg-brand-700 text-white font-black uppercase tracking-widest py-4 px-10 rounded-2xl transition-all shadow-xl shadow-brand-500/20"
            >
              Criar Fatura
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
