import React, { useState } from 'react';
import type { Transaction } from '../types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200" data-testid="transaction-table">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10 px-6 py-3"></th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200" data-testid="transaction-list">
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <tr 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => toggleRow(transaction.id)}
                data-testid={`transaction-row-${transaction.id}`}
              >
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block transform transition-transform ${expandedRows[transaction.id] ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {transaction.description}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'EXPENSE' ? '- ' : ''}{formatCurrency(Number(transaction.amount))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(transaction); }} className="text-indigo-600 hover:text-indigo-900 mr-3" data-testid={`btn-edit-${transaction.id}`}>Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); }} className="text-red-600 hover:text-red-900" data-testid={`btn-delete-${transaction.id}`}>Excluir</button>
                </td>
              </tr>
              
              {/* Linha Detalhada (Colapsável) */}
              {expandedRows[transaction.id] && (
                <tr className="bg-gray-50" data-testid={`details-row-${transaction.id}`}>
                  <td colSpan={5} className="px-12 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-500 block uppercase text-xs">Categoria</span>
                        <span className="text-gray-900" data-testid={`detail-category-${transaction.id}`}>{transaction.category}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500 block uppercase text-xs">Subcategoria</span>
                        <span className="text-gray-900" data-testid={`detail-subcategory-${transaction.id}`}>
                          {transaction.subcategory || 'Sem subcategoria'}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}