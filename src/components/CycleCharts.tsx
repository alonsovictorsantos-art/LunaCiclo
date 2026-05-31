import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { CycleLog } from '../types';
import { format, parseISO, subDays, startOfDay } from 'date-fns';

interface CycleChartsProps {
  logs: CycleLog[];
}

const MOOD_MAP: Record<string, number> = {
  'Radiante': 5,
  'Feliz': 4,
  'Calma': 3,
  'Cansada': 2,
  'Irritada': 1,
  'Sensível': 2,
  'Triste': 1,
  'Ansiosa': 1,
  'Focada': 4
};

const FLOW_MAP: Record<string, number> = {
  'none': 0,
  'light': 1,
  'medium': 2,
  'heavy': 3
};

export default function CycleCharts({ logs }: CycleChartsProps) {
  // 1. Mood & Intensity Trend Data
  const trendData = useMemo(() => {
    // Show last 14 days
    const days = Array.from({ length: 14 }).map((_, i) => {
      const date = startOfDay(subDays(new Date(), 13 - i));
      const dateStr = date.toISOString();
      const log = logs.find(l => {
        try {
            const logDate = startOfDay(parseISO(l.date));
            return logDate.getTime() === date.getTime();
        } catch (e) {
            return false;
        }
      });

      return {
        name: format(date, 'dd/MM'),
        mood: log ? (MOOD_MAP[log.mood] || 3) : null,
        intensity: log ? log.intensity : null,
        flow: log ? FLOW_MAP[log.flow] : null
      };
    });
    return days;
  }, [logs]);

  // 2. Symptom Frequency Data
  const symptomData = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(log => {
      log.symptoms.forEach(s => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [logs]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Mood & Intensity Line Chart */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-xl text-gray-900 uppercase italic">Tendência de Humor</h3>
            <p className="text-xs text-gray-400 font-medium">Variação do bem-estar nos últimos 14 dias</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-primary" />
              <span className="text-[9px] font-black text-gray-400 uppercase">Humor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="text-[9px] font-black text-gray-400 uppercase">Fluxo</span>
            </div>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" strokeOpacity={0.2} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} 
                dy={10}
              />
              <YAxis 
                hide 
                domain={[0, 5]} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#FF3D77" 
                strokeWidth={4} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }}
                connectNulls
              />
              <Line 
                type="monotone" 
                dataKey="flow" 
                stroke="#4FACFE" 
                strokeWidth={4} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 8, strokeWidth: 0 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Symptoms Frequency Bar Chart */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
          <h3 className="font-black text-lg text-gray-900 uppercase italic mb-8">Sintomas Frequentes</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#9FE1CB" radius={[0, 10, 10, 0]} barSize={20}>
                  {symptomData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#4FACFE' : '#9FE1CB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intensity Distribution or Pie if preferred */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <h3 className="font-black text-lg text-gray-900 uppercase italic mb-8 self-start">Intensidade Média</h3>
            <div className="w-40 h-40 rounded-full border-[12px] border-pink-light flex flex-col items-center justify-center relative shadow-inner">
                <p className="text-4xl font-black text-pink-primary">
                    {logs.length > 0 ? (logs.reduce((acc, curr) => acc + curr.intensity, 0) / logs.length).toFixed(1) : '0'}
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase">Geral</p>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-[12px] border-pink-primary border-t-transparent border-l-transparent -rotate-45" />
            </div>
            <p className="mt-8 text-xs text-gray-400 font-medium text-center">
                A sua intensidade média de sintomas está num nível saudável. Continue a registar!
            </p>
        </div>
      </div>
    </div>
  );
}
