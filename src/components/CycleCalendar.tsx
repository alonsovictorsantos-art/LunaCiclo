import React from 'react';
import { ChevronRight, Droplets, Sparkles, Heart, Zap } from 'lucide-react';
import { UserProfile, CycleLog } from '../types';
import { calculateCycleStatus } from '../lib/cycle-logic';
import { t, Language } from '../lib/i18n';

interface CycleCalendarProps {
  profile: UserProfile;
  logs: CycleLog[];
  compact?: boolean;
}

export default function CycleCalendar({ profile, logs, compact = false }: CycleCalendarProps) {
  const lang: Language = profile.language || 'pt';
  const status = calculateCycleStatus(profile, logs);
  
  const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
    </div>
  );

  return (
    <div className={`bg-white rounded-[32px] border border-gray-100 shadow-sm transition-colors ${compact ? 'p-6' : 'p-8'}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold flex items-center gap-3 text-lg">
          <div className="w-1.5 h-6 bg-pink-primary rounded-full" />
          {t('cycleCalendarTitle', lang)}
        </h3>
        {!compact && (
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 rotate-180 text-gray-400" /></button>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
          </div>
        )}
      </div>

      <div className="calendar-grid mb-8">
        {[t('sun', lang), t('mon', lang), t('tue', lang), t('wed', lang), t('thu', lang), t('fri', lang), t('sat', lang)].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-300 py-3 tracking-widest">{d}</div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => {
          const day = (i % 31) + 1;
          let className = "cal-day group relative my-1 text-sm md:text-base";
          const isToday = day === new Date().getDate() && i < 31;
          
          // Simplified visualization logic for demo
          const isPeriod = day >= 1 && day <= profile.periodLength && i < 31;
          const isOvulation = day === status.ovulationDate.getDate() && i < 31;
          const isFertile = Math.abs(day - status.ovulationDate.getDate()) <= 3 && i < 31 && !isOvulation;
          
          // Check for actual logs to show intensity
          const dayDate = new Date();
          dayDate.setDate(day);
          const dayLog = logs.find(l => new Date(l.date).getDate() === day && i < 31);

          if (isPeriod) {
            className += " cal-day-period";
            if (dayLog?.flow === 'heavy') className += " bg-pink-700 text-white border-none";
            else if (dayLog?.flow === 'medium') className += " bg-pink-500 text-white border-none";
          }
          if (isFertile) className += " cal-day-fertile";
          if (isOvulation) className += " cal-day-ovulation";
          if (isToday) className += " ring-2 ring-pink-primary ring-offset-4 font-black text-pink-primary";

          return (
            <div key={i} className={className}>
              {day}
              {dayLog?.flow && dayLog.flow !== 'none' && (
                <div className="absolute top-1 right-1 flex gap-0.5">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              )}
              {isToday && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-pink-primary rounded-full" />}
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
         <LegendItem color="bg-pink-mid" label={t('periodLegend', lang)} />
         <LegendItem color="bg-[#9FE1CB]" label={t('fertileWindowLegend', lang)} />
         <LegendItem color="bg-pink-primary" label={t('ovulationLegend', lang)} />
         <LegendItem color="bg-purple-100" label={t('predictedLegend', lang)} />
      </div>
    </div>
  );
}
