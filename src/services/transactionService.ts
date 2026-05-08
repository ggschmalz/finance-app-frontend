import axios from 'axios';
import type { Transaction } from '../types/transaction';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const { data } = await api.get<Transaction[]>('/transactions/');
    return data;
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