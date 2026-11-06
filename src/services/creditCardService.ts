import { api } from './api';

export interface CreditCardTransaction {
  id: string;
  invoice: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface CreditCardInvoice {
  id: string;
  description: string;
  due_date: string;
  is_paid: boolean;
  total_amount: number;
  transactions: CreditCardTransaction[];
}

export interface CreateInvoiceDTO {
  description: string;
  due_date: string;
}

export interface CreateCardExpenseDTO {
  invoice: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export const creditCardService = {
  getInvoices: async (): Promise<CreditCardInvoice[]> => {
    const { data } = await api.get<CreditCardInvoice[] | { results: CreditCardInvoice[] }>('/credit-cards/invoices/');
    return Array.isArray(data) ? data : (data.results || []);
  },

  getInvoiceById: async (id: string): Promise<CreditCardInvoice> => {
    const { data } = await api.get<CreditCardInvoice>(`/credit-cards/invoices/${id}/`);
    return data;
  },

  createInvoice: async (payload: CreateInvoiceDTO): Promise<CreditCardInvoice> => {
    const { data } = await api.post<CreditCardInvoice>('/credit-cards/invoices/', payload);
    return data;
  },

  updateInvoice: async (id: string, payload: Partial<CreditCardInvoice>): Promise<CreditCardInvoice> => {
    const { data } = await api.patch<CreditCardInvoice>(`/credit-cards/invoices/${id}/`, payload);
    return data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/credit-cards/invoices/${id}/`);
  },

  createExpense: async (payload: CreateCardExpenseDTO): Promise<CreditCardTransaction> => {
    const { data } = await api.post<CreditCardTransaction>('/credit-cards/transactions/', payload);
    return data;
  },

  updateExpense: async (id: string, payload: Partial<CreateCardExpenseDTO>): Promise<CreditCardTransaction> => {
    const { data } = await api.patch<CreditCardTransaction>(`/credit-cards/transactions/${id}/`, payload);
    return data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/credit-cards/transactions/${id}/`);
  }
};
