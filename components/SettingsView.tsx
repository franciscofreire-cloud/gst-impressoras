
import React, { useState } from 'react';
import {
  FileUp,
  FileDown,
  Eraser,
  Database,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck
} from 'lucide-react';

interface SettingsViewProps {
  onClearAll: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadBackup: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onClearAll, onFileUpload, onDownloadBackup, fileInputRef }) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);

  const confirmClear = () => {
    onClearAll();
    setShowClearConfirm(false);
    alert('Sistema reiniciado com sucesso.');
  };

  const initiateImport = () => {
    setShowImportConfirm(false);
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Seção de Dados */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <Database size={20} className="text-pcce" />
          <h3 className="font-bold text-slate-800 text-lg">Gestão de Dados</h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-2">
              <h4 className="font-bold text-slate-900">Importação em Lote</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Utilize uma planilha Excel (.xlsx) para cadastrar múltiplas impressoras de uma só vez.
                O sistema verificará duplicidades por SELB ou Número de Série automaticamente.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-pcce">
                <CheckCircle2 size={14} />
                Formatos aceitos: .xlsx, .xls, .csv
              </div>
            </div>

            <div className="w-full md:w-auto">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls, .csv"
                onChange={onFileUpload}
              />
              <button
                onClick={() => setShowImportConfirm(true)}
                className="w-full flex items-center justify-center gap-3 bg-pcce text-white px-8 py-4 rounded-xl hover:bg-pcce-success transition-all shadow-lg font-bold group"
              >
                <FileUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                Importar Planilha
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-2">
              <h4 className="font-bold text-slate-900">Exportar Backup</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Baixe uma cópia completa de todos os ativos de impressão no formato Excel para segurança ou relatórios externos.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <button
                onClick={onDownloadBackup}
                className="w-full flex items-center justify-center gap-3 bg-white text-pcce border-2 border-pcce/10 px-8 py-4 rounded-xl hover:bg-pcce/5 hover:border-pcce/20 transition-all font-bold group"
              >
                <FileDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
                Baixar Backup .XLSX
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de Perigo */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-6 border-b border-red-50 bg-red-50/50 flex items-center gap-3">
          <ShieldAlert size={20} className="text-red-600" />
          <h3 className="font-bold text-red-800 text-lg">Zona Crítica</h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-red-600 font-bold mb-1">
                <AlertTriangle size={16} />
                Ação Irreversível
              </div>
              <h4 className="font-bold text-slate-900">Redefinir Banco de Dados</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Esta ação removerá permanentemente **todas as impressoras** cadastradas e todo o **histórico de auditoria**.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-3 bg-white text-red-600 border-2 border-red-200 px-8 py-4 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all font-bold"
              >
                <Eraser size={20} />
                Limpar Todo o Sistema
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Informativo */}
      <div className="p-6 bg-pcce/5 border border-pcce/10 rounded-2xl flex gap-4">
        <div className="bg-pcce/10 p-2 rounded-lg h-fit text-pcce">
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1">
          <h5 className="font-bold text-pcce dark:text-pcce text-sm">Dica de Segurança</h5>
          <p className="text-pcce/70 text-xs leading-relaxed">
            As alterações feitas aqui são sincronizadas instantaneamente com o seu armazenamento local.
            Certifique-se de que nenhum outro usuário administrativo está operando o sistema simultaneamente.
          </p>
        </div>
      </div>

      {/* MODAL CONFIRMAÇÃO LIMPEZA */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="mx-auto w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <ShieldAlert size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Confirmar Exclusão?</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Você está prestes a apagar <span className="font-bold text-red-600">todos os dados patrimoniais e históricos</span>. Esta ação é definitiva e não pode ser desfeita.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmClear}
                  className="px-6 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Sim, Limpar Tudo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO IMPORTAÇÃO */}
      {showImportConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="mx-auto w-20 h-20 bg-pcce/10 text-pcce rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Iniciar Importação?</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                O sistema irá processar o arquivo selecionado e ignorar registros com SELB já existentes. Deseja prosseguir com a seleção do arquivo?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowImportConfirm(false)}
                  className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Agora não
                </button>
                <button
                  onClick={initiateImport}
                  className="px-6 py-4 bg-pcce text-white font-bold rounded-2xl hover:bg-pcce-success transition-all shadow-lg shadow-pcce/20"
                >
                  Selecionar Arquivo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
