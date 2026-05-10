import { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Layout } from '../components/Layout';
import { transactionService } from '../services/transactionService';
import type { Transaction } from '../types/transaction';
import type { ApexOptions } from 'apexcharts';

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewMode, setViewMode] = useState<'BOTH' | 'INCOME' | 'EXPENSE'>('BOTH');

  // Corrigindo ordem de declaração e adicionando useCallback para estabilidade
  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações para o dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Extrair anos únicos das transações para o filtro
  const availableYears = useMemo(() => {
    const years = transactions.map(t => {
      const date = new Date(t.date);
      return isNaN(date.getTime()) ? new Date().getFullYear().toString() : date.getFullYear().toString();
    });
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
    
    // Garantir que o ano atual esteja na lista
    const currentYear = new Date().getFullYear().toString();
    if (!uniqueYears.includes(currentYear)) {
      uniqueYears.push(currentYear);
      uniqueYears.sort((a, b) => b.localeCompare(a));
    }
    
    return uniqueYears;
  }, [transactions]);

  // Processar dados para o gráfico com conversão segura de valores
  const chartData = useMemo(() => {
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    transactions.forEach(t => {
      const date = new Date(t.date);
      if (!isNaN(date.getTime()) && date.getFullYear().toString() === selectedYear) {
        const month = date.getMonth();
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        
        if (t.type === 'INCOME') {
          monthlyIncome[month] += amount;
        } else {
          monthlyExpense[month] += amount;
        }
      }
    });

    const series = [];
    if (viewMode === 'BOTH' || viewMode === 'INCOME') {
      series.push({
        name: 'Entradas',
        data: monthlyIncome,
        color: '#10B981' // Emerald 500
      });
    }
    if (viewMode === 'BOTH' || viewMode === 'EXPENSE') {
      series.push({
        name: 'Saídas',
        data: monthlyExpense,
        color: '#EF4444' // Red 500
      });
    }

    return series;
  }, [transactions, selectedYear, viewMode]);

  // Totais do ano selecionado com conversão segura
  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const date = new Date(t.date);
      if (!isNaN(date.getTime()) && date.getFullYear().toString() === selectedYear) {
        const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
        if (t.type === 'INCOME') acc.income += amount;
        else acc.expense += amount;
      }
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions, selectedYear]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'Inter, sans-serif'
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: MONTHS,
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      labels: {
        formatter: (val) => `R$ ${val.toLocaleString('pt-BR')}`,
        style: { colors: '#64748b' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100]
      }
    },
    tooltip: {
      y: { formatter: (val) => `R$ ${val.toLocaleString('pt-BR')}` }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    },
    legend: { position: 'top', horizontalAlign: 'right' }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 animate-pulse">Carregando dados do dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Financeiro</h2>
          <p className="text-sm text-gray-500 mt-1">Análise de evolução mensal das suas finanças.</p>
        </div>

        <div className="flex items-center space-x-3 bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer px-3 py-1.5"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total de Entradas ({selectedYear})</p>
          <p className="text-2xl font-bold text-emerald-600">R$ {totals.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total de Saídas ({selectedYear})</p>
          <p className="text-2xl font-bold text-red-600">R$ {totals.expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Saldo Líquido</p>
          <p className={`text-2xl font-bold ${totals.income - totals.expense >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            R$ {(totals.income - totals.expense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Gráfico de Evolução */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Evolução Mensal</h3>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('BOTH')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'BOTH' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Ambos
            </button>
            <button
              onClick={() => setViewMode('INCOME')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Entradas
            </button>
            <button
              onClick={() => setViewMode('EXPENSE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Saídas
            </button>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <Chart
            options={chartOptions}
            series={chartData}
            type="area"
            height="100%"
          />
        </div>
      </div>
    </Layout>
  );
}
