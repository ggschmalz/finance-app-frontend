// src/types/transaction.ts

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  description: string;
  amount: number | string; // Aceita string também porque o Django pode devolver decimais como texto
  type: 'INCOME' | 'EXPENSE';
  category: string;
  subcategory?: string;
  date: string;
  created_at?: string;
}