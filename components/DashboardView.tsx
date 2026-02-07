
import React, { useMemo } from 'react';
import {
  Printer as PrinterIcon,
  CheckCircle2,
  XCircle,
  MapPin,
  BarChart3,
  TrendingUp,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Printer, CollectingStatus } from '../types';

interface DashboardViewProps {
  printers: Printer[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ printers }) => {
  const stats = useMemo(() => {
    const total = printers.length;
    const collecting = printers.filter(p => p.collecting === CollectingStatus.YES).length;
    const notCollecting = total - collecting;
    const stations = new Set(printers.map(p => p.station)).size;

    return { total, collecting, notCollecting, stations };
  }, [printers]);

  const stationsData = useMemo(() => {
    const map: Record<string, { name: string; total: number; collecting: number }> = {};
    printers.forEach(p => {
      if (!map[p.station]) {
        map[p.station] = { name: p.station, total: 0, collecting: 0 };
      }
      map[p.station].total += 1;
      if (p.collecting === CollectingStatus.YES) {
        map[p.station].collecting += 1;
      }
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [printers]);

  return (
    <div className="space-y-10">
      {/* High-Impact Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<PrinterIcon size={24} />}
          label="Inventário Total"
          value={stats.total}
          sub="Ativos Catalogados"
          color="pcce"
        />
        <StatCard
          icon={<Zap size={24} />}
          label="Monitoramento OK"
          value={stats.collecting}
          sub="Fluxo Ativo"
          color="pcce"
        />
        <StatCard
          icon={<XCircle size={24} />}
          label="Offline / Erro"
          value={stats.notCollecting}
          sub="Ações Necessárias"
          color="rose"
        />
        <StatCard
          icon={<MapPin size={24} />}
          label="Unidades"
          value={stats.stations}
          sub="Distribuição"
          color="pcce-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        {/* Modern Bar Chart Container */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h3 className="text-lg md:text-xl font-black text-[#121417]">Densidade por Unidade</h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Comparativo de Volume vs Monitoramento</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pcce" />
                <span className="text-gray-500">Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pcce-accent" />
                <span className="text-gray-500">Ativas</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stationsData.slice(0, 10)} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis
                  dataKey="name"
                  fontSize={8}
                  fontWeight={700}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  tick={{ fill: '#ADB5BD' }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  fontSize={8}
                  fontWeight={700}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#ADB5BD' }}
                />
                <Tooltip
                  cursor={{ fill: '#F8F9FA' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar dataKey="total" fill="#00754a" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="collecting" fill="#ef8943" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action / Quick Info Column */}
        <div className="lg:col-span-4 h-full">
          <div className="bg-pcce-dark text-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={24} className="text-pcce-accent" />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2">Performance Global</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">O índice de conectividade médio entre todas as unidades está operando em:</p>

              <div className="flex items-end gap-3">
                <span className="text-5xl md:text-6xl font-black text-pcce-accent tracking-tighter">
                  {Math.round((stats.collecting / (stats.total || 1)) * 100)}%
                </span>
                <span className="text-gray-500 font-bold mb-2 uppercase text-[9px] tracking-widest leading-tight">Conexão<br />Ativa</span>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 w-48 h-48 bg-pcce/10 rounded-full blur-[60px] translate-x-1/2 translate-y-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; sub: string; color: string }> = ({ icon, label, value, sub, color }) => {
  const colors: Record<string, string> = {
    pcce: "bg-pcce-light text-pcce border-pcce/10",
    "pcce-accent": "bg-orange-50 text-pcce-accent border-orange-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div className="bg-white p-5 md:p-7 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm group hover:border-pcce/20 transition-all duration-300">
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-transform group-hover:scale-110 ${colors[color]} border`}>
        {icon}
      </div>
      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl md:text-3xl font-black text-[#121417] tracking-tight">{value}</h4>
        <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase">{sub}</span>
      </div>
    </div>
  );
};

export default DashboardView;
