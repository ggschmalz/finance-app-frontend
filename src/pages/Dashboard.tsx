import { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Layout } from '../components/Layout';
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

export function Dashboard() {
  const { t } = useTranslation();
  const { currency, darkMode } = useSettings();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewMode, setViewMode] = useState<'BOTH' | 'INCOME' | 'EXPENSE'>('BOTH');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transData, rateData] = await Promise.all([
          transactionService.getAll(),
          currencyService.getLatestRates()
        ]);
        setTransactions(transData);
        setRates(rateData);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const availableYears = useMemo(() => {
    const years = transactions.map(trans => new Date(trans.date).getFullYear().toString());
    const currentYear = new Date().getFullYear().toString();
    return Array.from(new Set([...years, currentYear])).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const chartData = useMemo(() => {
    const income = Array(12).fill(0);
    const expense = Array(12).fill(0);
    transactions.forEach(trans => {
      const d = new Date(trans.date);
      if (d.getFullYear().toString() === selectedYear) {
        const m = d.getMonth();
        const amt = Number(trans.amount);
        if (trans.type === 'INCOME') income[m] += amt;
        else expense[m] += amt;
      }
    });
    const res = [];
    if (viewMode !== 'EXPENSE') res.push({ name: t('income'), data: income, color: '#10b981' });
    if (viewMode !== 'INCOME') res.push({ name: t('expense'), data: expense, color: '#ef4444' });
    return res;
  }, [transactions, selectedYear, viewMode, t]);

  const totals = useMemo(() => {
    return transactions.reduce((acc, trans) => {
      if (new Date(trans.date).getFullYear().toString() === selectedYear) {
        const amt = Number(trans.amount);
        if (trans.type === 'INCOME') acc.inc += amt;
        else acc.exp += amt;
      }
      return acc;
    }, { inc: 0, exp: 0 });
  }, [transactions, selectedYear]);

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

  const formatValue = (v: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(v);

  if (loading) return <Layout><div className="p-32 text-center font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] animate-pulse">Sincronizando Relatórios...</div></Layout>;

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 transition-all">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">{t('dashboard')}</h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium opacity-80">Análise de performance anual.</p>
        </div>
        <div className="relative group">
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 focus:border-brand-500 rounded-[1.5rem] px-6 py-3.5 font-black text-slate-900 dark:text-white shadow-sm outline-none transition-all appearance-none cursor-pointer pr-12">
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 dark:text-slate-600 font-black">▼</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-700 shadow-sm transition-all hover:shadow-lg">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('income')}</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">{formatValue(totals.inc)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-700 shadow-sm transition-all hover:shadow-lg">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('expense')}</p>
          <p className="text-3xl font-black text-red-500 tracking-tighter">{formatValue(totals.exp)}</p>
        </div>
        <div className="bg-brand-600 p-8 rounded-[2.5rem] shadow-2xl shadow-brand-500/20 text-white transition-all transform hover:scale-[1.02]">
          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-3">Total Líquido</p>
          <p className="text-3xl font-black tracking-tighter">{formatValue(totals.inc - totals.exp)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-12">
        {rates && (
          <>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2rem] border-2 border-transparent dark:border-slate-800 flex items-center justify-between shadow-inner">
              <div className="flex items-center space-x-4">
                <span className="text-2xl drop-shadow-sm">🇺🇸</span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Câmbio Comercial<br/><span className="text-brand-600 dark:text-brand-400">Dólar Americano</span></span>
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">R$ {rates.USD.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2rem] border-2 border-transparent dark:border-slate-800 flex items-center justify-between shadow-inner">
              <div className="flex items-center space-x-4">
                <span className="text-2xl drop-shadow-sm">🇪🇺</span>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Câmbio Comercial<br/><span className="text-brand-600 dark:text-brand-400">Euro Europeu</span></span>
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">R$ {rates.EUR.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-[3rem] border border-slate-50 dark:border-slate-700 shadow-sm transition-all mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] text-xs">Evolução Mensal</h3>
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-auto shadow-inner">
            {(['BOTH', 'INCOME', 'EXPENSE'] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)} className={`flex-1 md:flex-none px-6 py-2.5 text-[10px] font-black rounded-xl transition-all duration-300 ${viewMode === m ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-md scale-105' : 'text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                {m === 'BOTH' ? 'AMBOS' : m === 'INCOME' ? 'ENTRADAS' : 'SAÍDAS'}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[400px] w-full"><Chart options={chartOptions} series={chartData} type="area" height="100%" /></div>
      </div>
    </Layout>
  );
}
