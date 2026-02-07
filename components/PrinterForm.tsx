
import React, { useState, useEffect } from 'react';
import { X, Save, Globe } from 'lucide-react';
import { Printer, InstallMode, CollectingStatus } from '../types';

interface PrinterFormProps {
  onClose: () => void;
  onSave: (data: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData: Printer | null;
}

const PrinterForm: React.FC<PrinterFormProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    selb: '',
    serialNumber: '',
    model: '',
    installMode: InstallMode.NETWORK,
    ip: '',
    collecting: CollectingStatus.YES,
    station: '',
    address: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        selb: initialData.selb,
        serialNumber: initialData.serialNumber,
        model: initialData.model || '',
        installMode: initialData.installMode,
        ip: initialData.ip || '',
        collecting: initialData.collecting,
        station: initialData.station,
        address: initialData.address
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selb || !formData.serialNumber || !formData.station || !formData.model) {
      alert('Por favor, preencha todos os campos obrigatórios (incluindo o Modelo).');
      return;
    }

    // IP é obrigatório apenas no modo Rede
    if (formData.installMode === InstallMode.NETWORK && !formData.ip) {
      alert('Por favor, informe o endereço IP para impressoras em Rede.');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-pcce-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? 'Editar Impressora' : 'Cadastrar Nova Impressora'}
            </h2>
            <p className="text-sm text-slate-500">Informe os dados patrimoniais e de localização.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"
          >
            <X size={20} md:size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">SELB (Patrimônio)</label>
              <input
                type="text"
                required
                placeholder="Ex: 0123456"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pcce focus:outline-none"
                value={formData.selb}
                onChange={e => setFormData(prev => ({ ...prev, selb: e.target.value }))}
                disabled={!!initialData}
              />
              {!initialData && <p className="text-[10px] text-slate-400 font-medium">O SELB deve ser único e não pode ser alterado após o cadastro.</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Número de Série</label>
              <input
                type="text"
                required
                placeholder="Ex: ABC123XYZ"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pcce focus:outline-none"
                value={formData.serialNumber}
                onChange={e => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                disabled={!!initialData}
              />
            </div>

            {/* Nova linha para Modelo da Impressora */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700">Modelo da Impressora</label>
              <input
                type="text"
                required
                placeholder="Ex: HP LaserJet Pro M404dw"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pcce focus:outline-none"
                value={formData.model}
                onChange={e => setFormData(prev => ({ ...prev, model: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Modo de Instalação</label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, installMode: InstallMode.NETWORK }))}
                  className={`py-2.5 text-xs font-medium rounded-lg transition-all ${formData.installMode === InstallMode.NETWORK ? 'bg-white text-pcce shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Rede
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, installMode: InstallMode.USB }))}
                  className={`py-2.5 text-xs font-medium rounded-lg transition-all ${formData.installMode === InstallMode.USB ? 'bg-white text-pcce shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  USB
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, installMode: InstallMode.BACKUP }))}
                  className={`py-2.5 text-xs font-medium rounded-lg transition-all ${formData.installMode === InstallMode.BACKUP ? 'bg-white text-pcce shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Backup
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Status de Coleta</label>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, collecting: CollectingStatus.YES }))}
                  className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all ${formData.collecting === CollectingStatus.YES ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, collecting: CollectingStatus.NO }))}
                  className={`flex-1 py-2.5 text-xs font-medium rounded-lg transition-all ${formData.collecting === CollectingStatus.NO ? 'bg-rose-600 text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Não
                </button>
              </div>
            </div>

            {/* Campo de IP agora disponível para todos os modos */}
            <div className="space-y-2 md:col-span-2 animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                <Globe size={14} className="text-pcce-accent" />
                Endereço IP {formData.installMode !== InstallMode.NETWORK && '(Opcional)'}
              </label>
              <input
                type="text"
                required={formData.installMode === InstallMode.NETWORK}
                placeholder="Ex: 192.168.1.100"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pcce focus:outline-none"
                value={formData.ip}
                onChange={e => setFormData(prev => ({ ...prev, ip: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700">Delegacia / Unidade</label>
              <input
                type="text"
                required
                placeholder="Ex: 1º DP - Centro"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pcce focus:outline-none"
                value={formData.station}
                onChange={e => setFormData(prev => ({ ...prev, station: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700">Endereço Completo</label>
              <textarea
                rows={2}
                placeholder="Rua, Número, Bairro, CEP..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pcce focus:outline-none resize-none"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full md:w-auto order-2 md:order-1 px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full md:w-auto order-1 md:order-2 px-8 py-3 bg-pcce text-white font-bold rounded-xl hover:bg-pcce-success transition-all shadow-lg shadow-pcce/20 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {initialData ? 'Salvar Alterações' : 'Confirmar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrinterForm;
