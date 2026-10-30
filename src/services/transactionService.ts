import { api } from './api';
import type { Transaction } from '../types/transaction';

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  subcategory?: string;
  date: string;
}

export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    const { data } = await api.get<Transaction[] | { results: Transaction[] }>('/transactions/');
    return Array.isArray(data) ? data : (data.results || []);
  },

  create: async (transaction: CreateTransactionDTO): Promise<Transaction> => {
    const { data } = await api.post<Transaction>('/transactions/', transaction);
    return data;
  },

  update: async (id: string, transaction: CreateTransactionDTO): Promise<Transaction> => {
    const { data } = await api.put<Transaction>(`/transactions/${id}/`, transaction);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}/`);
  },
};