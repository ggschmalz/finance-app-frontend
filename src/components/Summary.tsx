import type { Transaction } from '../types/transaction';

interface SummaryProps {
  transactions: Transaction[];
}

export function Summary({ transactions }: SummaryProps) {
  const summary = transactions.reduce(
    (acc, transaction) => {
      // Converte explicitamente para número para evitar bugs com strings da API
      const amount = Number(transaction.amount);

      if (transaction.type === 'INCOME') {
        acc.income += amount;
        acc.total += amount;
      } else {
        acc.expense += amount;
        acc.total -= amount;
      }
      return acc;
    },
    { income: 0, expense: 0, total: 0 }
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card de Entradas */}
      <div className="bg-white rounded-lg p-6 shadow" data-testid="card-income">
        <header className="flex items-center justify-between text-gray-600 mb-4">
          <span>Entradas</span>
        </header>
        <strong className="text-2xl font-normal text-green-600" data-testid="summary-income">
          {formatCurrency(summary.income)}
        </strong>
      </div>

      {/* Card de Saídas */}
      <div className="bg-white rounded-lg p-6 shadow" data-testid="card-expense">
        <header className="flex items-center justify-between text-gray-600 mb-4">
          <span>Saídas</span>
        </header>
        <strong className="text-2xl font-normal text-red-600" data-testid="summary-expense">
          {summary.expense === 0 ? formatCurrency(0) : `- ${formatCurrency(summary.expense)}`}
        </strong>
      </div>

      {/* Card de Total */}
      <div 
        className={`${summary.total >= 0 ? 'bg-blue-600' : 'bg-red-600'} rounded-lg p-6 shadow text-white`} 
        data-testid="card-total"
      >
        <header className="flex items-center justify-between mb-4">
          <span>Total</span>
        </header>
        <strong className="text-2xl font-normal" data-testid="summary-total">
          {formatCurrency(summary.total)}
        </strong>
      </div>
    </div>
  );
}