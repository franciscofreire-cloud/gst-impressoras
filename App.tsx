
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Printer as PrinterIcon,
  History,
  Plus,
  LogOut,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Search,
  Bell
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Printer, HistoryEntry, InstallMode, CollectingStatus, User, UserRole } from './types';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import UsersView from './components/UsersView';
import PrinterForm from './components/PrinterForm';
import LoginView from './components/LoginView';

import { supabase, sessionlessSupabase } from './lib/supabase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'history' | 'settings' | 'users'>('inventory');
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<Printer | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSession(session);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSession(session);
      } else {
        setActiveUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: any) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      const user: User = {
        id: profile.id,
        username: profile.username,
        role: profile.role as UserRole,
        isAuthenticated: true
      };
      setActiveUser(user);
      if (user.role === 'admin') setActiveTab('dashboard');
      else setActiveTab('inventory');

      // Fetch initial data
      fetchPrinters();
      fetchHistory();
      if (user.role === 'admin') fetchUsers();
    }
    setLoading(false);
  };

  const fetchPrinters = async () => {
    const { data } = await supabase.from('printers').select('*').order('created_at', { ascending: false });
    if (data) setPrinters(data.map(p => ({
      ...p,
      installMode: p.install_mode as InstallMode,
      serialNumber: p.serial_number,
      createdAt: new Date(p.created_at).getTime(),
      updatedAt: new Date(p.updated_at).getTime()
    })));
  };

  const fetchHistory = async () => {
    const { data } = await supabase.from('history').select('*').order('timestamp', { ascending: false });
    if (data) setHistory(data.map(h => ({
      ...h,
      printerId: h.printer_id,
      oldValue: h.old_value,
      newValue: h.new_value,
      timestamp: new Date(h.timestamp).getTime()
    })));
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUserList(data.map(p => ({
      id: p.id,
      username: p.username,
      role: p.role as UserRole,
      isAuthenticated: false
    })));
  };

  const handleLogin = (session: any) => {
    handleSession(session);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveUser(null);
  };

  const savePrinter = async (data: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const printerData = {
      selb: data.selb,
      serial_number: data.serialNumber,
      model: data.model,
      install_mode: data.installMode,
      ip: data.ip,
      collecting: data.collecting,
      station: data.station,
      address: data.address,
      updated_at: new Date().toISOString()
    };

    if (editingPrinter) {
      const { error } = await supabase
        .from('printers')
        .update(printerData)
        .eq('id', editingPrinter.id);

      if (!error) {
        // Log changes to history
        const changes: any[] = [];
        const fields = ['selb', 'serialNumber', 'model', 'installMode', 'ip', 'collecting', 'station', 'address'] as const;

        fields.forEach(field => {
          const oldValue = editingPrinter[field as keyof Printer];
          const newValue = data[field as keyof Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>];

          if (String(oldValue) !== String(newValue)) {
            changes.push({
              printer_id: editingPrinter.id,
              field: field,
              old_value: String(oldValue || ''),
              new_value: String(newValue || ''),
              changed_by: activeUser?.id,
              timestamp: new Date().toISOString()
            });
          }
        });

        if (changes.length > 0) {
          await supabase.from('history').insert(changes);
        }

        fetchPrinters();
        fetchHistory();
        setEditingPrinter(null);
      }
    } else {
      const { error } = await supabase
        .from('printers')
        .insert([{ ...printerData, created_at: new Date().toISOString() }]);

      if (!error) {
        fetchPrinters();
        fetchHistory();
      }
    }
    setIsFormOpen(false);
  };

  const deletePrinter = async (id: string) => {
    if (confirm('Deseja remover este ativo do inventário?')) {
      const { error } = await supabase.from('printers').delete().eq('id', id);
      if (!error) fetchPrinters();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (rawData.length === 0) {
          alert('A planilha está vazia.');
          return;
        }

        const printersToInsert: any[] = rawData.map(row => {
          // Helper to find a value by searching keys for any of the aliases
          const getVal = (aliases: string[]) => {
            const key = Object.keys(row).find(k => {
              const normalizedK = k.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              return aliases.some(alias => {
                const normalizedAlias = alias.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return normalizedK === normalizedAlias;
              });
            });
            return key ? String(row[key] || '').trim() : '';
          };

          const selb = getVal(['SELB', 'PATRIMONIO']);
          const serial = getVal(['SERIE', 'SÉRIE', 'SERIAL', 'NUMERO DE SERIE', 'N/S']);
          const model = getVal(['MODELO', 'EQUIPAMENTO']);
          const installMode = getVal(['MODO DE INSTALAÇÃO', 'MODO DE INSTALACAO', 'INSTALACAO', 'CONEXAO']);
          const ip = getVal(['IP', 'ENDEREÇO IP', 'ENDERECO IP']);
          const collecting = getVal(['STATUS COLETA', 'COLETA', 'STATUS']);
          const station = getVal(['DELEGACIA', 'UNIDADE', 'LOCAL', 'POSTO']);
          const address = getVal(['ENDEREÇO', 'ENDERECO', 'LOGRADOURO']);

          // Normalize constants to match database constraints
          let normalizedInstallMode = 'Rede';
          const upMode = installMode.toUpperCase();
          if (upMode.includes('USB')) normalizedInstallMode = 'USB';
          else if (upMode.includes('BACKUP')) normalizedInstallMode = 'Backup';
          else if (upMode.includes('REDE') || upMode.includes('NETWORK')) normalizedInstallMode = 'Rede';

          let normalizedCollecting = 'Sim';
          const upColl = collecting.trim().toUpperCase();
          if (['NÃO', 'NAO', 'NO', 'FALSE', '0', 'N'].includes(upColl)) normalizedCollecting = 'Não';
          else if (['SIM', 'SI', 'YES', 'TRUE', '1', 'S'].includes(upColl)) normalizedCollecting = 'Sim';

          return {
            selb,
            serial_number: serial,
            model,
            install_mode: normalizedInstallMode,
            ip,
            collecting: normalizedCollecting,
            station,
            address,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }).filter(p => p.selb && p.serial_number);

        if (printersToInsert.length > 0) {
          const { error } = await supabase.from('printers').insert(printersToInsert);
          if (error) {
            alert('Erro ao salvar no banco: ' + error.message);
          } else {
            alert(`${printersToInsert.length} impressoras importadas com sucesso!`);
            fetchPrinters();
            fetchHistory();
          }
        } else {
          const foundKeys = Object.keys(rawData[0]).join(', ');
          alert(`Nenhum dado válido encontrado. Verifique se as colunas SELB e SERIE estão presentes.\n\nColunas detectadas no arquivo: \n${foundKeys}`);
        }
      } catch (err) {
        alert('Erro ao processar planilha: ' + (err as Error).message);
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadBackup = () => {
    if (printers.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    const dataToExport = printers.map(p => ({
      'SELB': p.selb,
      'SÉRIE': p.serialNumber,
      'MODELO': p.model,
      'MODO DE INSTALAÇÃO': p.installMode,
      'IP': p.ip || '',
      'STATUS COLETA': p.collecting,
      'DELEGACIA / UNIDADE': p.station,
      'ENDEREÇO': p.address,
      'DATA DE CADASTRO': new Date(p.createdAt).toLocaleDateString('pt-BR')
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventário");

    // Auto-size columns (basic implementation)
    const maxWidths = Object.keys(dataToExport[0]).map(key => ({
      wch: Math.max(key.length, ...dataToExport.map(row => String(row[key as keyof typeof row] || '').length)) + 2
    }));
    worksheet['!cols'] = maxWidths;

    XLSX.writeFile(workbook, `Backup_Inventario_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleClearAll = async () => {
    if (confirm('ATENÇÃO: Isso removerá permanentemente TODO o inventário e históricos. Deseja prosseguir?')) {
      const { error: pError } = await supabase.from('printers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error: hError } = await supabase.from('history').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (!pError && !hError) {
        alert('Banco de dados redefinido com sucesso.');
        setPrinters([]);
        setHistory([]);
      } else {
        alert('Erro ao limpar banco de dados.');
      }
    }
  };

  const handleCreateUser = async (u: Omit<User, 'id' | 'isAuthenticated'>) => {
    const email = `${u.username}@sistema.local`;

    // Use sessionless client to avoid logging out the current admin
    const { data, error } = await sessionlessSupabase.auth.signUp({
      email,
      password: u.password!,
      options: {
        data: {
          username: u.username,
          role: u.role
        }
      }
    });

    if (error) {
      alert('Erro ao criar usuário: ' + error.message);
    } else {
      alert('Usuário criado com sucesso!');
      fetchUsers();
    }
  };

  const handleUpdateUser = async (id: string, data: Partial<User>) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        username: data.username,
        role: data.role
      })
      .eq('id', id);

    if (error) {
      alert('Erro ao atualizar perfil: ' + error.message);
    } else {
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Deseja remover este acesso? Nota: O registro de autenticação deve ser removido manualmente no Painel Supabase por segurança.')) {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Erro ao excluir perfil: ' + error.message);
      } else {
        fetchUsers();
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#121417] flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!activeUser?.isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  const isAdmin = activeUser.role === 'admin';

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#1A1C1E]">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <aside className="w-[280px] h-screen fixed left-0 top-0 bg-pcce-dark text-white z-30 flex flex-col px-6 py-8 border-r border-white/5">
        <div className="flex items-center mb-12 px-2">
          <div>
            <h2 className="font-black text-xl tracking-tight leading-none uppercase">IMPRESSORAS PCCE</h2>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Principais</p>

          {isAdmin && (
            <SidebarItem
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
              icon={<LayoutDashboard size={20} />}
              label="Visão Geral"
            />
          )}

          <SidebarItem
            active={activeTab === 'inventory'}
            onClick={() => setActiveTab('inventory')}
            icon={<PrinterIcon size={20} />}
            label="Ativos de Impressão"
          />

          {isAdmin && (
            <SidebarItem
              active={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              icon={<History size={20} />}
              label="Logs do Sistema"
            />
          )}

          <div className="pt-8 space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Gestão</p>
            {isAdmin && (
              <>
                <SidebarItem
                  active={activeTab === 'users'}
                  onClick={() => setActiveTab('users')}
                  icon={<UsersIcon size={20} />}
                  label="Controle de Acessos"
                />
                <SidebarItem
                  active={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                  icon={<SettingsIcon size={20} />}
                  label="Configurações"
                />
              </>
            )}
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pcce to-pcce-accent flex items-center justify-center font-bold text-sm">
              {activeUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate leading-none mb-1">{activeUser.username}</p>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                {activeUser.role === 'admin' ? 'Root Admin' : 'Operador'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-[280px] relative z-10 px-10 py-8 min-h-screen">
        <header className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-pcce-accent" />
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Painel Administrativo v3.0
              </p>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-[#121417]">
              {activeTab === 'dashboard' && 'Dashboard Analítico'}
              {activeTab === 'inventory' && 'Inventário Estratégico'}
              {activeTab === 'history' && 'Logs de Auditoria'}
              {activeTab === 'users' && 'Gestão de Identidade'}
              {activeTab === 'settings' && 'Preferências do Sistema'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-500 hover:text-pcce hover:border-pcce/20 transition-all shadow-sm">
              <Bell size={20} />
            </button>
            {activeTab === 'inventory' && isAdmin && (
              <button
                onClick={() => { setEditingPrinter(null); setIsFormOpen(true); }}
                className="flex items-center gap-2 bg-pcce text-white px-6 py-3.5 rounded-2xl hover:bg-pcce-success transition-all shadow-lg shadow-pcce/20 font-bold"
              >
                <Plus size={20} />
                Novo Registro
              </button>
            )}
          </div>
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'dashboard' && <DashboardView printers={printers} />}
          {activeTab === 'inventory' && (
            <InventoryView
              printers={printers}
              onEdit={isAdmin ? (p) => { setEditingPrinter(p); setIsFormOpen(true); } : () => { }}
              onDelete={isAdmin ? deletePrinter : () => { }}
              isAdmin={isAdmin}
            />
          )}
          {activeTab === 'history' && <HistoryView history={history} printers={printers} />}
          {activeTab === 'users' && (
            <UsersView
              users={userList}
              onAddUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              activeUserId={activeUser?.id || ''}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsView
              onClearAll={handleClearAll}
              onFileUpload={handleFileUpload}
              onDownloadBackup={handleDownloadBackup}
              fileInputRef={fileInputRef}
            />
          )}
        </section>

        {isFormOpen && (
          <PrinterForm
            onClose={() => setIsFormOpen(false)}
            onSave={savePrinter}
            initialData={editingPrinter}
          />
        )}
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${active
      ? 'bg-pcce text-white shadow-lg shadow-pcce/20'
      : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
  >
    <span className={`${active ? 'text-white' : 'text-gray-500'}`}>{icon}</span>
    {label}
  </button>
);

export default App;
