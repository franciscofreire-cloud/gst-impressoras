
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-black text-slate-800">Controle de Acessos</h3>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gestão de permissões e usuários</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setIsAdding(true);
            setFormData({ username: '', password: '', role: 'user' });
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-pcce text-white px-5 py-3 rounded-xl hover:bg-pcce-success transition-all font-black text-xs shadow-lg shadow-pcce/20"
        >
          <UserPlus size={18} />
          Novo Usuário
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[32px] shadow-2xl border-2 border-pcce/10 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-6 text-pcce">
            <div className="w-10 h-10 bg-pcce-light rounded-xl flex items-center justify-center">
              {editingId ? <Edit2 size={20} /> : <UserPlus size={20} />}
            </div>
            <h4 className="font-black text-slate-900">{editingId ? 'Atualizar Perfil' : 'Novo Acesso'}</h4>
          </div>
          <form onSubmit={e => { e.preventDefault(); editingId ? handleSaveEdit() : handleSubmit(e); }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Usuário / Login</label>
              <input
                type="text"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-pcce font-bold text-sm"
                value={formData.username}
                onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Key size={14} className="text-pcce" />
                {editingId ? 'Redefinir Senha' : 'Senha de Acesso'}
              </label>
              <input
                type="password"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-pcce font-bold text-sm"
                value={formData.password}
                placeholder={editingId ? "••••••••" : ""}
                onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nível de Permissão</label>
              <select
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-pcce font-bold text-sm appearance-none"
                value={formData.role}
                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              >
                <option value="user">Usuário Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-6 py-3 text-slate-500 font-black text-xs hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-pcce text-white px-8 py-3 rounded-xl font-black text-xs hover:bg-pcce-success flex items-center gap-2 shadow-lg shadow-pcce/20"
              >
                <Save size={18} />
                {editingId ? 'Gravar Alterações' : 'Salvar Acesso'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Responsive Users List */}
      <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
        {/* Desktop Table Header */}
        <table className="hidden md:table w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-6">Usuário / Identidade</th>
              <th className="px-8 py-6">Nível de Acesso</th>
              <th className="px-8 py-6 text-center">Status</th>
              <th className="px-8 py-6 text-right">Controles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${user.role === 'admin' ? 'bg-pcce-light text-pcce' : 'bg-slate-100 text-slate-400'}`}>
                      {user.role === 'admin' ? <Shield size={20} /> : <UserIcon size={20} />}
                    </div>
                    <span className="font-black text-slate-900">{user.username}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-pcce text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {user.role === 'admin' ? 'Administrador' : 'Consulta'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Ativo
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(user)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-pcce hover:text-white transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      disabled={user.id === activeUserId}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all disabled:opacity-30"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-slate-100">
          {users.map((user) => (
            <div key={user.id} className="p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.role === 'admin' ? 'bg-pcce-light text-pcce' : 'bg-slate-100 text-slate-400'}`}>
                    {user.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                  </div>
                  <div>
                    <div className="font-black text-slate-900">{user.username}</div>
                    <div className={`text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-pcce' : 'text-slate-400'}`}>
                      {user.role === 'admin' ? 'Admin' : 'Consulta'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Ativo
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStartEdit(user)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 font-black text-[10px] uppercase rounded-xl hover:bg-pcce hover:text-white transition-all"
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button
                  onClick={() => onDeleteUser(user.id)}
                  disabled={user.id === activeUserId}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-500 font-black text-[10px] uppercase rounded-xl hover:bg-rose-600 hover:text-white transition-all disabled:opacity-30"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersView;
