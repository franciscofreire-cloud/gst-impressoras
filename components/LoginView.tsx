
import React, { useState } from 'react';
import { User as UserIcon, Lock, ArrowRight, Printer as PrinterIcon, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginViewProps {
  onLogin: (session: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmedUsername = username.trim().toLowerCase();
    const email = trimmedUsername.includes('@') ? trimmedUsername : `${trimmedUsername}@sistema.local`;
    const trimmedPassword = password.trim();

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: trimmedPassword,
    });

    if (authError) {
      if (authError.message === 'Database error querying schema') {
        setError('Erro interno do servidor de autenticação. Por favor, aguarde 10 segundos e tente novamente.');
      } else {
        setError(authError.message === 'Invalid login credentials' ? 'Acesso negado. Credenciais incompatíveis.' : authError.message);
      }
      console.error('Auth Error Details:', {
        message: authError.message,
        status: authError.status,
        email: email
      });
    } else if (data.session) {
      onLogin(data.session);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-pcce-dark flex items-center justify-center p-6 font-sans">
      {/* Dynamic Visual Elements */}
      <div className="fixed top-0 right-0 w-[50vw] h-screen bg-pcce/5 blur-[120px] rounded-full translate-x-1/2" />
      <div className="fixed bottom-0 left-0 w-[30vw] h-[30vh] bg-pcce-accent/5 blur-[100px] rounded-full -translate-x-1/4" />
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md bg-[#1A1C1E] rounded-[48px] shadow-2xl shadow-black/50 overflow-hidden relative z-10 border border-white/5 p-10 lg:p-14">
        {/* Login Form Side */}
        <div className="flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Autenticação</h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Insira seu acesso para prosseguir</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl text-xs font-bold border border-rose-500/20 flex items-center gap-3 animate-in shake duration-500">
                <ShieldCheck size={20} />
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block px-1 group-focus-within:text-pcce-accent transition-colors">Operador</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pcce transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-pcce-dark border border-white/5 rounded-2xl focus:ring-2 focus:ring-pcce/50 focus:border-pcce/50 outline-none transition-all text-white font-bold placeholder:text-gray-700"
                    placeholder="nome.sobrenome"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block px-1 group-focus-within:text-pcce-accent transition-colors">Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-pcce transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-pcce-dark border border-white/5 rounded-2xl focus:ring-2 focus:ring-pcce/50 focus:border-pcce/50 outline-none transition-all text-white font-bold placeholder:text-gray-700"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pcce text-white font-black py-5 rounded-2xl hover:bg-pcce-success transition-all shadow-xl shadow-pcce/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group mt-10"
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-12 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            Acesso Restrito • Monitoramento em Execução
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
