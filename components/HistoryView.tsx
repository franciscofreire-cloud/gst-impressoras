
import React from 'react';
import { Clock, ArrowRight, Printer as PrinterIcon, History } from 'lucide-react';
import { HistoryEntry, Printer } from '../types';

interface HistoryViewProps {
  history: HistoryEntry[];
  printers: Printer[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, printers }) => {
  const getPrinterInfo = (id: string) => {
    return printers.find(p => p.id === id);
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="bg-white rounded-[24px] md:rounded-[32px] border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-5 md:p-8 border-b border-gray-100 bg-gray-50/30 flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-pcce-light rounded-xl md:rounded-2xl flex items-center justify-center text-pcce">
          <History size={24} />
        </div>
        <div>
          <h3 className="text-base md:text-xl font-black text-[#121417]">Trilha de Auditoria</h3>
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Histórico completo de interações</p>
        </div>
      </div>

      <div className="p-4 md:p-0">
        {history.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <Clock size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-gray-400 font-bold text-sm">Nenhum histórico registrado ainda.</p>
          </div>
        ) : (
          <div className="md:divide-y md:divide-slate-100">
            {history.map((entry) => {
              const printer = getPrinterInfo(entry.printerId);
              return (
                <div key={entry.id} className="p-4 md:p-8 hover:bg-slate-50 transition-all mb-3 md:mb-0 bg-slate-50/50 md:bg-transparent rounded-2xl md:rounded-none border border-slate-100 md:border-0 border-b md:border-b-0 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-110 transition-transform">
                        <PrinterIcon size={18} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-xs md:text-sm text-slate-900 leading-none">{printer?.selb || 'Excluído'}</span>
                          <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tight">SN: {printer?.serialNumber || '---'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[9px] font-black px-2 py-0.5 bg-pcce/10 text-pcce rounded-md uppercase tracking-widest">
                            {entry.field}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold">
                            <span className="text-rose-500 line-through opacity-50">{entry.oldValue || '---'}</span>
                            <ArrowRight size={10} className="text-slate-300" />
                            <span className="text-emerald-600">{entry.newValue || '---'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:text-right flex md:flex-col justify-between items-center md:items-end gap-1.5 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                      <p className="text-[10px] md:text-sm font-black text-slate-700">{formatDate(entry.timestamp)}</p>
                      <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-slate-100 md:bg-transparent px-2 py-0.5 md:p-0 rounded-md">Sistema</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
