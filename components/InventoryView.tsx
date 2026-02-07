
import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Edit2,
  Trash2,
  LayoutGrid,
  List as ListIcon,
  Wifi,
  Usb,
  Network,
  Printer as PrinterIcon,
  MapPin,
  Globe,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Printer, CollectingStatus, InstallMode } from '../types';

interface InventoryViewProps {
  printers: Printer[];
  onEdit: (printer: Printer) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const InventoryView: React.FC<InventoryViewProps> = ({ printers, onEdit, onDelete, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredPrinters = useMemo(() => {
    return printers.filter(p => {
      return p.selb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.station.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [printers, searchTerm]);

  const handleOpenIP = (e: React.MouseEvent, ip: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = ip.startsWith('http') ? ip : `http://${ip.trim()}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      {/* Strategic Search Area */}
      <div className="bg-white p-2 md:p-3 rounded-[24px] md:rounded-[28px] border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar patrimônio, série ou unidade..."
            className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-gray-50/50 border-none rounded-xl md:rounded-2xl focus:ring-2 focus:ring-pcce font-bold text-xs md:text-sm placeholder:text-gray-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-gray-100/80 p-1 rounded-xl md:rounded-2xl">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all font-bold text-[10px] md:text-xs ${viewMode === 'list' ? 'bg-white shadow-sm text-pcce' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <ListIcon size={14} />
            Tabela
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all font-bold text-[10px] md:text-xs ${viewMode === 'grid' ? 'bg-white shadow-sm text-pcce' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <LayoutGrid size={14} />
            Grade
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-8 py-6">Identificação / Ativo</th>
                  <th className="px-8 py-6">Localização Estratégica</th>
                  <th className="px-8 py-6 text-center">Conectividade</th>
                  <th className="px-8 py-6 text-center">Status Coleta</th>
                  {isAdmin && <th className="px-8 py-6 text-right">Controles</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPrinters.map((printer) => (
                  <tr key={printer.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${printer.collecting === 'Sim'
                          ? 'bg-pcce-light text-pcce shadow-sm shadow-pcce/10'
                          : 'bg-rose-50 text-rose-500 shadow-sm shadow-rose-500/10'
                          }`}>
                          <PrinterIcon size={20} />
                        </div>
                        <div>
                          <div className="font-black text-[#121417] text-sm tracking-tight">{printer.selb}</div>
                          <div className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{printer.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{printer.station}</span>
                        <span className="text-[10px] text-gray-400 font-medium italic truncate max-w-[200px] mt-1">{printer.address}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${printer.installMode === 'Rede' ? 'bg-pcce-accent' : 'bg-slate-400'}`} />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{printer.installMode}</span>
                        </div>
                        {printer.ip && (
                          <button
                            onClick={(e) => handleOpenIP(e, printer.ip!)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-mono font-bold text-pcce hover:bg-pcce/5 transition-colors"
                          >
                            {printer.ip}
                            <ExternalLink size={10} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-[10px] tracking-widest uppercase"
                        style={{
                          backgroundColor: printer.collecting === 'Sim' ? '#ECFDF5' : '#FFF1F2',
                          borderColor: printer.collecting === 'Sim' ? '#D1FAE5' : '#FFE4E6',
                          color: printer.collecting === 'Sim' ? '#065F46' : '#9F1239'
                        }}>
                        <div className={`w-2 h-2 rounded-full ${printer.collecting === 'Sim' ? 'bg-pcce' : 'bg-rose-500'} animate-pulse`} />
                        {printer.collecting === 'Sim' ? 'Online' : 'Erro'}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => onEdit(printer)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-pcce hover:text-white transition-all shadow-sm">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => onDelete(printer.id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-4">
            {filteredPrinters.map((printer) => (
              <div key={printer.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${printer.collecting === 'Sim' ? 'bg-pcce-light text-pcce' : 'bg-rose-50 text-rose-500'}`}>
                      <PrinterIcon size={18} />
                    </div>
                    <div>
                      <div className="font-black text-sm text-gray-900">{printer.selb}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">{printer.model}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${printer.collecting === 'Sim' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {printer.collecting === 'Sim' ? 'Online' : 'Erro'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <MapPin size={12} className="text-gray-400" />
                    {printer.station}
                  </div>
                  {printer.ip && (
                    <button
                      onClick={(e) => handleOpenIP(e, printer.ip!)}
                      className="flex items-center gap-2 text-[11px] font-mono font-bold text-pcce bg-pcce-light/50 px-2 py-1 rounded-md"
                    >
                      <Globe size={11} />
                      {printer.ip}
                    </button>
                  )}
                </div>

                {isAdmin && (
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => onEdit(printer)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold hover:bg-pcce hover:text-white transition-all">
                      <Edit2 size={14} /> Editar
                    </button>
                    <button onClick={() => onDelete(printer.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 size={14} /> Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredPrinters.map((printer) => (
            <div key={printer.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-pcce/5 hover:border-pcce/20 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${printer.collecting === 'Sim' ? 'bg-pcce-light text-pcce' : 'bg-rose-50 text-rose-500'} transition-colors duration-500`}>
                  <PrinterIcon size={32} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Ativo</p>
                    <span className={`text-xs font-black uppercase ${printer.collecting === 'Sim' ? 'text-pcce' : 'text-rose-600'}`}>
                      {printer.collecting === 'Sim' ? 'Coletando' : 'Falha'}
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="text-2xl font-black text-[#121417] tracking-tight mb-1">{printer.selb}</h4>
              <p className="text-xs font-bold text-pcce uppercase tracking-widest mb-6">{printer.model}</p>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-gray-300 mt-1 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm leading-none mb-1">{printer.station}</p>
                    <p className="text-[11px] text-gray-400 font-medium italic line-clamp-2">{printer.address}</p>
                  </div>
                </div>
              </div>

              {printer.ip && (
                <button
                  onClick={(e) => handleOpenIP(e, printer.ip!)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl hover:bg-pcce hover:text-white transition-all group/btn"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-gray-400 group-hover/btn:text-white/50" />
                    <span className="text-xs font-mono font-bold">{printer.ip}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover/btn:text-white" />
                </button>
              )}

              {isAdmin && (
                <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <button onClick={() => onEdit(printer)} className="p-2 bg-white rounded-lg shadow-lg text-gray-400 hover:text-pcce border border-gray-100"><Edit2 size={16} /></button>
                  <button onClick={() => onDelete(printer.id)} className="p-2 bg-white rounded-lg shadow-lg text-gray-400 hover:text-rose-600 border border-gray-100"><Trash2 size={16} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryView;
