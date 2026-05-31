import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, Target, Zap, Heart, Info, ArrowUpRight } from 'lucide-react';
import { UserProfile, CycleLog } from '../types';
import { calculateCycleStatus } from '../lib/cycle-logic';

import { t } from '../lib/i18n';

interface FertilityBoardProps {
  profile: UserProfile;
  logs: CycleLog[];
}

export default function FertilityBoard({ profile, logs }: FertilityBoardProps) {
  const lang = profile.language;
  const status = useMemo(() => calculateCycleStatus(profile, logs), [profile, logs]);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(lang === 'pt' ? 'pt-PT' : lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">{t('fertilityBoardTitle', lang)}</h2>
        <p className="text-gray-400 text-sm">{t('fertilityBoardDesc', lang)}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border-l-4 border-l-teal-500 shadow-sm border border-gray-100">
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t('fertileWindow', lang)}</p>
           <h3 className="text-2xl font-bold text-teal-600">
             {status.fertileWindowStart.getDate()}–{status.fertileWindowEnd.getDate()}
           </h3>
           <p className="text-gray-400 text-[10px] font-medium">{t('cycleDays', lang)}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border-l-4 border-l-pink-primary shadow-sm border border-gray-100">
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t('estOvulation', lang)}</p>
           <h3 className="text-2xl font-bold text-pink-primary">{lang === 'pt' ? 'Dia' : lang === 'en' ? 'Day' : 'Día'} {status.ovulationDate.getDate()}</h3>
           <p className="text-gray-400 text-[10px] font-medium">{formatDate(status.ovulationDate)}</p>
        </div>
        <div className="bg-white p-6 rounded-[24px] border-l-4 border-l-purple-500 shadow-sm border border-gray-100">
           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t('probability', lang)}</p>
           <h3 className="text-2xl font-bold text-purple-600">{status.isFertile ? t('high', lang) : t('medLow', lang)}</h3>
           <p className="text-gray-400 text-[10px] font-medium">
             {status.isFertile ? t('fertileWindowOpen', lang) : (lang === 'pt' ? `Faltam ${status.daysUntilNextOvulation} dias` : lang === 'en' ? `${status.daysUntilNextOvulation} days left` : `Faltan ${status.daysUntilNextOvulation} días`)}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
           <h3 className="font-bold mb-8 flex items-center gap-2">
             <Target className="w-5 h-5 text-teal-600" />
             {t('dailyProbTitle', lang)}
           </h3>
           <div className="flex items-end gap-1 h-32 mb-4">
              {Array.from({ length: profile.cycleLength }).map((_, i) => {
                const day = i + 1;
                let height = "h-[10%]";
                let color = "bg-gray-100";
                
                const ovDay = status.ovulationDate.getDate() % profile.cycleLength || profile.cycleLength;
                
                if (Math.abs(day - ovDay) <= 3) {
                  height = day === ovDay ? "h-full" : Math.abs(day - ovDay) === 1 ? "h-[85%]" : "h-[60%]";
                  color = day === ovDay ? "bg-pink-primary" : "bg-teal-500/80";
                }

                return (
                  <div key={day} className={`flex-1 ${height} ${color} rounded-t-[2px] transition-all`} />
                );
              })}
           </div>
           <div className="flex justify-between text-[10px] font-bold text-gray-300">
              <span>{t('dayLabel', lang)} 1</span>
              <span>{t('dayLabel', lang)} {Math.floor(profile.cycleLength/2)}</span>
              <span>{t('dayLabel', lang)} {profile.cycleLength}</span>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
           <h3 className="font-bold mb-6 flex items-center gap-2">
             <Heart className="w-5 h-5 text-pink-primary" />
             {t('tipsPregnancyTitle', lang)}
           </h3>
           <ul className="space-y-4">
              {[
                { title: t('tip1Title', lang), text: t('tip1Text', lang) },
                { title: t('tip2Title', lang), text: t('tip2Text', lang) },
                { title: t('tip3Title', lang), text: t('tip3Text', lang) },
                { title: t('tip4Title', lang), text: t('tip4Text', lang) }
              ].map((item, i) => (
                <li key={i} className="flex gap-4 group cursor-default">
                   <div className="w-6 h-6 rounded-full bg-pink-light text-pink-primary flex items-center justify-center text-[10px] font-bold mt-0.5 group-hover:scale-110 transition-transform">{i+1}</div>
                   <div>
                      <p className="text-sm font-bold text-gray-800 mb-0.5">{item.title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{item.text}</p>
                   </div>
                </li>
              ))}
           </ul>
        </div>
      </div>
    </div>
  );
}
