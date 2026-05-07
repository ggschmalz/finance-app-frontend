import type { Transaction } from '../types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200" data-testid="transaction-list">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500" data-testid="empty-state-message">
                Nenhuma transação encontrada.
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id} data-testid={`transaction-row-${transaction.id}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`desc-${transaction.id}`}>{transaction.description}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`} data-testid={`amount-${transaction.id}`}>
                  {transaction.type === 'EXPENSE' ? '- ' : ''}{formatCurrency(Number(transaction.amount))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-testid={`category-${transaction.id}`}>{transaction.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-testid={`date-${transaction.id}`}>{formatDate(transaction.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onEdit(transaction)} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    data-testid={`btn-edit-${transaction.id}`}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onDelete(transaction.id)} 
                    className="text-red-600 hover:text-red-900"
                    data-testid={`btn-delete-${transaction.id}`}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}