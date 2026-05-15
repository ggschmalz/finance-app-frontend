import React, { useState } from 'react';
import type { Transaction } from '../types/transaction';
import { useSettings } from '../hooks/useSettings';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const { currency } = useSettings();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-colors duration-500">
      {/* Visualização em Lista (Mobile) */}
      <div className="block lg:hidden divide-y divide-slate-100 dark:divide-slate-700">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-5 active:bg-slate-50 dark:active:bg-slate-900/50 transition-colors" onClick={() => toggleRow(transaction.id)}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">{transaction.description}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{formatDate(transaction.date)}</p>
              </div>
              <p className={`text-sm font-black ${transaction.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                {transaction.type === 'EXPENSE' ? '- ' : ''}{formatCurrency(Number(transaction.amount))}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase tracking-widest bg-brand-500/10 dark:bg-brand-400/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-lg">
                {transaction.category}
              </span>
              <div className="flex space-x-6">
                <button onClick={(e) => { e.stopPropagation(); onEdit(transaction); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-brand-500 transition-colors">Editar</button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors">Excluir</button>
              </div>
            </div>

            {expandedRows[transaction.id] && (
              <div className="mt-5 pt-5 border-t border-slate-50 dark:border-slate-700 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Subcategoria</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{transaction.subcategory || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Identificador</p>
                  <p className="text-[10px] font-mono text-slate-400">#{transaction.id.substring(0, 6)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="p-16 text-center">
            <p className="text-xs font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>

      {/* Visualização em Tabela (Desktop) */}
      <table className="hidden lg:table min-w-full divide-y divide-slate-100 dark:divide-slate-700">
        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
          <tr>
            <th className="w-12 px-6 py-5"></th>
            <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</th>
            <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
            <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
            <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-50 dark:divide-slate-700 transition-colors">
          {transactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <tr 
                className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 cursor-pointer transition-colors"
                onClick={() => toggleRow(transaction.id)}
              >
                <td className="px-6 py-5 text-center">
                  <span className={`inline-block text-[10px] transition-all ${expandedRows[transaction.id] ? 'rotate-90 text-brand-500 scale-125' : 'text-slate-300 group-hover:text-slate-400'}`}>
                    ▶
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {transaction.description}
                </td>
                <td className={`px-6 py-5 whitespace-nowrap text-sm font-black ${transaction.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {transaction.type === 'EXPENSE' ? '- ' : ''}{formatCurrency(Number(transaction.amount))}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-[10px] font-black uppercase tracking-widest">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(transaction); }} className="text-slate-400 dark:text-slate-500 hover:text-brand-500 transition-colors mr-6">Editar</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); }} className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors">Excluir</button>
                </td>
              </tr>
              
              {expandedRows[transaction.id] && (
                <tr className="bg-slate-50/30 dark:bg-slate-900/40">
                  <td colSpan={5} className="px-20 py-8">
                    <div className="flex gap-16">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Categoria</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{transaction.category}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Subcategoria</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{transaction.subcategory || 'Sem subcategoria'}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Hash de Controle</p>
                        <p className="text-[10px] font-mono text-slate-400">{transaction.id}</p>
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
