import { api } from './api';
import type { Transaction, TransactionType } from '../types/transaction';

// Definindo o tipo para criação (omitindo o ID que vem do banco)
export type CreateTransactionDTO = Omit<Transaction, 'id'>;

export const transactionService = {
  // Buscar todas as transações
  getAll: async (): Promise<Transaction[]> => {
    const { data } = await api.get<Transaction[]>('/transactions');
    return data;
  },

  // Criar uma nova transação
  create: async (transaction: CreateTransactionDTO): Promise<Transaction> => {
    const { data } = await api.post<Transaction>('/transactions', transaction);
    return data;
  },

  // Deletar uma transação
  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  // Buscar resumo (Opcional, mas ótimo para o Dashboard)
  getSummary: async () => {
    const { data } = await api.get('/transactions/summary');
    return data;
  }
};