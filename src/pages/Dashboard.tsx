import { Layout } from '../components/Layout';

export function Dashboard() {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800" data-testid="page-title">Relatórios</h2>
          <p className="text-sm text-gray-500 mt-1">Visão geral e gráficos financeiros.</p>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        Módulo de relatórios em construção...
      </div>
    </Layout>
  );
}