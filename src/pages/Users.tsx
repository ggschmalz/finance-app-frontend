import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import type { User } from '../services/userService';
import { Layout } from '../components/Layout';
import type { UserRole } from '../services/authService';
import { useTranslation } from 'react-i18next';

export function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Erro ao carregar usuários. Verifique se você tem permissão.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  async function handleRoleChange(userId: number, newRole: UserRole) {
    if (!confirm(`Tem certeza que deseja alterar a função para ${newRole}?`)) return;

    try {
      await userService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Erro ao atualizar função.');
      console.error(err);
    }
  }

  async function handleDeleteUser(userId: number) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert('Erro ao excluir usuário.');
      console.error(err);
    }
  }

  return (
    <Layout>
      <div className="px-0 sm:px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="sm:flex sm:items-center mb-6 sm:mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white uppercase tracking-tighter">{t('users')}</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-400 font-medium">
              Lista de todos os usuários registrados no sistema e suas funções.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
            <p className="text-sm text-red-700 dark:text-red-400 font-bold">{error}</p>
          </div>
        )}

        {/* Visualização em Lista (Mobile) */}
        <div className="block sm:hidden space-y-4">
          {loading ? (
            <div className="py-20 text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">Carregando usuários...</div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-sm text-gray-500 dark:text-gray-400">Nenhum usuário encontrado.</div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user.email || user.username || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700/50 flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[9px] uppercase font-black text-slate-400 mb-1.5 tracking-widest">Função</p>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="block w-full rounded-xl border-2 border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-200 text-xs font-bold p-2 focus:border-brand-500 outline-none transition-all"
                    >
                      <option value="UNASSIGNED">Pendente</option>
                      <option value="STANDARD">Padrão</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-black text-slate-400 mb-1.5 tracking-widest">Registro</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">{new Date(user.date_joined).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Visualização em Tabela (Desktop) */}
        <div className="hidden sm:flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow-sm rounded-[2.5rem] border border-gray-100 dark:border-slate-700">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                    <tr>
                      <th className="py-5 pl-4 pr-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sm:pl-8">Nome</th>
                      <th className="px-3 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                      <th className="px-3 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Função</th>
                      <th className="px-3 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data de Registro</th>
                      <th className="relative py-5 pl-3 pr-4 sm:pr-8">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-sm text-gray-500 dark:text-gray-400 font-bold animate-pulse uppercase tracking-widest">
                          Sincronizando usuários...
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight sm:pl-8">
                            {user.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {user.email || user.username || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                              className="block w-40 rounded-xl border-2 border-transparent bg-slate-50 dark:bg-slate-900 text-gray-900 dark:text-gray-200 text-xs font-bold p-2 focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                              <option value="UNASSIGNED">Pendente</option>
                              <option value="STANDARD">Padrão</option>
                              <option value="ADMIN">Administrador</option>
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                            {new Date(user.date_joined).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-[10px] font-black uppercase tracking-widest sm:pr-8">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
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
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center sm:text-right">
          <a
            href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/admin/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400 hover:text-brand-700 bg-brand-50 dark:bg-brand-900/20 px-6 py-3 rounded-2xl transition-all"
          >
            Django Admin &rarr;
          </a>
        </div>
      </div>
    </Layout>
  );
}
