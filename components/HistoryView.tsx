
import React from 'react';
import { Clock, ArrowRight, Printer as PrinterIcon } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
        <Clock className="text-pcce" size={20} />
        <h3 className="font-bold text-slate-800">Trilha de Auditoria</h3>
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center">
          <Clock size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500">Nenhum registro de alteração no histórico ainda.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {history.map((entry) => {
            const printer = getPrinterInfo(entry.printerId);
            return (
              <div key={entry.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-400 h-fit">
                      <PrinterIcon size={20} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{printer?.selb || 'Excluída'}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-500">SN: {printer?.serialNumber || 'N/A'}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-pcce/10 text-pcce rounded uppercase tracking-wider">
                          {entry.field}
                        </span>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100">
                            {entry.oldValue}
                          </span>
                          <ArrowRight size={14} className="text-slate-400" />
                          <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100">
                            {entry.newValue}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{formatDate(entry.timestamp)}</p>
                    <p className="text-xs text-slate-400">Alteração de sistema</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
