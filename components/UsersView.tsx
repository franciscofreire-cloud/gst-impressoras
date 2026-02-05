
import React, { useState } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, X, Edit2, Save, Key } from 'lucide-react';
import { User, UserRole } from '../types';

interface UsersViewProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'isAuthenticated'>) => void;
  onUpdateUser: (id: string, data: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
  activeUserId: string;
}

const UsersView: React.FC<UsersViewProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser, activeUserId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user' as UserRole
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;
    onAddUser(formData);
    setFormData({ username: '', password: '', role: 'user' });
    setIsAdding(false);
  };

  const handleStartEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({
      username: user.username,
      password: user.password || '',
      role: user.role
    });
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onUpdateUser(editingId, {
        username: formData.username,
        password: formData.password,
        role: formData.role
      });
      setEditingId(null);
      setFormData({ username: '', password: '', role: 'user' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Acessos Cadastrados</h3>
        <button
          onClick={() => {
            setEditingId(null);
            setIsAdding(true);
            setFormData({ username: '', password: '', role: 'user' });
          }}
          className="flex items-center gap-2 bg-pcce text-white px-4 py-2 rounded-lg hover:bg-pcce-success transition-all font-bold"
        >
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pcce/10 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-4 text-pcce">
            {editingId ? <Edit2 size={18} /> : <UserPlus size={18} />}
            <h4 className="font-bold">{editingId ? 'Editar Perfil / Nova Senha' : 'Criar Novo Acesso'}</h4>
          </div>
          <form onSubmit={e => { e.preventDefault(); editingId ? handleSaveEdit() : handleSubmit(e); }} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Usuário</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pcce outline-none"
                value={formData.username}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <Key size={12} />
                {editingId ? 'Nova Senha' : 'Senha'}
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pcce outline-none"
                value={formData.password}
                placeholder={editingId ? "Digite a nova senha..." : ""}
                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="w-48 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Perfil</label>
              <select
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pcce outline-none"
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              >
                <option value="user">Usuário Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
              <button
                type="submit"
                className="bg-pcce text-white px-6 py-2 rounded-lg font-bold hover:bg-pcce-success flex items-center gap-2"
              >
                <Save size={18} />
                {editingId ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase">
              <th className="px-6 py-4">Usuário</th>
              <th className="px-6 py-4">Perfil / Permissões</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${user.role === 'admin' ? 'bg-pcce/10 text-pcce' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                    </div>
                    <span className="font-bold text-slate-700">{user.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-pcce text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                    {user.role === 'admin' ? 'Acesso Total' : 'Somente Consulta'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Ativo
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleStartEdit(user)}
                      className="p-2 text-slate-400 hover:text-pcce hover:bg-pcce/5 rounded-lg transition-colors"
                      title="Editar Perfil / Alterar Senha"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                      disabled={user.id === activeUserId}
                      title={user.id === activeUserId ? "Não é possível excluir sua própria conta" : "Excluir Usuário"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersView;
