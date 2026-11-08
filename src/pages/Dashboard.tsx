import { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Layout } from '../components/Layout';
import { api } from '../services/api';
import { transactionService } from '../services/transactionService';
import { currencyService } from '../services/currencyService';
import type { ExchangeRates } from '../services/currencyService';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import type { Transaction } from '../types/transaction';
import type { ApexOptions } from 'apexcharts';

const MONTHS_KEYS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface DashboardResponse {
  year?: number | string;
  summary?: {
    total_income: number;
    total_expense: number;
    balance: number;
  };
  monthly_evolution?: Array<{
    month: number;
    income: number;
    expense: number;
  }>;
  category_distribution?: Array<{
    category: string;
    amount: number;
  }>;
  years?: string[];
}

export function Dashboard() {
  const { t } = useTranslation();
  const { currency, darkMode } = useSettings();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewMode, setViewMode] = useState<'BOTH' | 'INCOME' | 'EXPENSE'>('BOTH');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transData, rateData, dashRes] = await Promise.allSettled([
          transactionService.getAll(),
          currencyService.getLatestRates(),
          api.get<DashboardResponse>(`/dashboard/?year=${selectedYear}`).then((r) => r.data)
        ]);

        if (transData.status === 'fulfilled') setTransactions(transData.value);
        if (rateData.status === 'fulfilled') setRates(rateData.value);
        if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedYear]);

  const availableYears = useMemo(() => {
    const yearsFromTransactions = transactions.map((trans) =>
      trans.date ? trans.date.split('-')[0] : new Date().getFullYear().toString()
    );
    const yearsFromApi = dashboardData?.years || [];
    const currentYear = new Date().getFullYear().toString();
    return Array.from(new Set([...yearsFromTransactions, ...yearsFromApi, currentYear])).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [transactions, dashboardData]);

  const chartData = useMemo(() => {
    if (dashboardData?.monthly_evolution && dashboardData.monthly_evolution.length > 0) {
      const income = Array(12).fill(0);
      const expense = Array(12).fill(0);
      dashboardData.monthly_evolution.forEach((item) => {
        const idx = item.month - 1;
        if (idx >= 0 && idx < 12) {
          income[idx] = Number(item.income || 0);
          expense[idx] = Number(item.expense || 0);
        }
      });
      const res = [];
      if (viewMode !== 'EXPENSE') res.push({ name: t('income'), data: income, color: '#10b981' });
      if (viewMode !== 'INCOME') res.push({ name: t('expense'), data: expense, color: '#ef4444' });
      return res;
    }

    const income = Array(12).fill(0);
    const expense = Array(12).fill(0);
    transactions.forEach((trans) => {
      if (!trans.date) return;
      const [year, monthStr] = trans.date.split('-');
      if (year === selectedYear) {
        const m = parseInt(monthStr, 10) - 1;
        const amt = Number(trans.amount);
        if (m >= 0 && m < 12) {
          if (trans.type === 'INCOME') income[m] += amt;
          else expense[m] += amt;
        }
      }
    });
    const res = [];
    if (viewMode !== 'EXPENSE') res.push({ name: t('income'), data: income, color: '#10b981' });
    if (viewMode !== 'INCOME') res.push({ name: t('expense'), data: expense, color: '#ef4444' });
    return res;
  }, [dashboardData, transactions, selectedYear, viewMode, t]);

  const totals = useMemo(() => {
    if (dashboardData?.summary) {
      const inc = Number(dashboardData.summary.total_income || 0);
      const exp = Number(dashboardData.summary.total_expense || 0);
      const bal =
        dashboardData.summary.balance !== undefined
          ? Number(dashboardData.summary.balance)
          : inc - exp;
      return { inc, exp, bal };
    }

    const computed = transactions.reduce(
      (acc, trans) => {
        if (!trans.date) return acc;
        const [year] = trans.date.split('-');
        if (year === selectedYear) {
          const amt = Number(trans.amount);
          if (trans.type === 'INCOME') acc.inc += amt;
          else acc.exp += amt;
        }
        return acc;
      },
      { inc: 0, exp: 0 }
    );
    return {
      inc: computed.inc,
      exp: computed.exp,
      bal: computed.inc - computed.exp
    };
  }, [dashboardData, transactions, selectedYear]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      animations: { enabled: true, speed: 800 }
    },
    theme: { mode: darkMode ? 'dark' : 'light' },
    stroke: { curve: 'smooth', width: 4 },
    grid: { borderColor: darkMode ? '#334155' : '#f1f5f9', strokeDashArray: 4 },
    xaxis: {
      categories: MONTHS_KEYS,
      labels: { style: { colors: darkMode ? '#94a3b8' : '#64748b', fontWeight: 600 } }
    },
    yaxis: {
      labels: {
        formatter: (v) => v.toLocaleString(),
        style: { colors: darkMode ? '#94a3b8' : '#64748b', fontWeight: 600 }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: darkMode ? '#e2e8f0' : '#1e293b' },
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100]
      }
    }
  };

  const formatValue = (v: number) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(v);

  if (loading) {
    return (
      <Layout>
        <div className="p-32 text-center font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] animate-pulse">
          Sincronizando Relatórios...
        </div>
      </Layout>
    );
  }

  const categoryDistribution = dashboardData?.category_distribution || [];

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 transition-all">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
            {t('dashboard')}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium opacity-80">
            Análise de performance anual.
          </p>
        </div>
        <div className="relative group">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 focus:border-brand-500 rounded-[1.5rem] px-6 py-3.5 font-black text-slate-900 dark:text-white shadow-sm outline-none transition-all appearance-none cursor-pointer pr-12"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 dark:text-slate-600 font-black">
            ▼
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-700 shadow-sm transition-all hover:shadow-lg">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            {t('income')}
          </p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">
            {formatValue(totals.inc)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-700 shadow-sm transition-all hover:shadow-lg">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            {t('expense')}
          </p>
          <p className="text-3xl font-black text-red-500 tracking-tighter">
            {formatValue(totals.exp)}
          </p>
        </div>
        <div className="bg-brand-600 p-8 rounded-[2.5rem] shadow-2xl shadow-brand-500/20 text-white transition-all transform hover:scale-[1.02]">
          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-3">
            Total Líquido
          </p>
          <p className="text-3xl font-black tracking-tighter">{formatValue(totals.bal)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-12">
        {rates && (
          <>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2rem] border-2 border-transparent dark:border-slate-800 flex items-center justify-between shadow-inner">
              <div className="flex items-center space-x-4">
                <span className="text-2xl drop-shadow-sm">🇺🇸</span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  Câmbio Comercial
                  <br />
                  <span className="text-brand-600 dark:text-brand-400">Dólar Americano</span>
                </span>
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                R$ {rates.USD.toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2rem] border-2 border-transparent dark:border-slate-800 flex items-center justify-between shadow-inner">
              <div className="flex items-center space-x-4">
                <span className="text-2xl drop-shadow-sm">🇪🇺</span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  Câmbio Comercial
                  <br />
                  <span className="text-brand-600 dark:text-brand-400">Euro Europeu</span>
                </span>
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                R$ {rates.EUR.toFixed(2)}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-[3rem] border border-slate-50 dark:border-slate-700 shadow-sm transition-all mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] text-xs">
            Evolução Mensal
          </h3>
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-auto shadow-inner">
            {(['BOTH', 'INCOME', 'EXPENSE'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`flex-1 md:flex-none px-6 py-2.5 text-[10px] font-black rounded-xl transition-all duration-300 ${
                  viewMode === m
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-md scale-105'
                    : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {m === 'BOTH' ? 'AMBOS' : m === 'INCOME' ? 'ENTRADAS' : 'SAÍDAS'}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[400px] w-full">
          <Chart options={chartOptions} series={chartData} type="area" height="100%" />
        </div>
      </div>

      {categoryDistribution.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-[3rem] border border-slate-50 dark:border-slate-700 shadow-sm transition-all mb-12">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] text-xs mb-6">
            Distribuição por Categoria
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryDistribution.map((item) => (
              <div
                key={item.category}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/50 flex justify-between items-center"
              >
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {item.category}
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {formatValue(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
