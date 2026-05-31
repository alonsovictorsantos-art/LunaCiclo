import React from 'react';
import { motion } from 'motion/react';
import { History, Search, Filter, Download, ArrowRight, Trash2 } from 'lucide-react';
import { CycleLog } from '../types';
import { t, Language } from '../lib/i18n';

interface HistoryBoardProps {
  logs: CycleLog[];
  onDelete?: (id: string) => void;
  lang: Language;
}

export default function HistoryBoard({ logs, onDelete, lang }: HistoryBoardProps) {
  const sortedLogs = [...logs].reverse();

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('cycleHistoryTitle', lang)}</h2>
          <p className="text-gray-400 text-sm">{t('cycleHistoryDesc', lang)}</p>
        </div>
        <button className="bg-white border border-gray-100 py-3 px-6 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-all">
          <Download className="w-4 h-4" /> {t('exportData', lang)}
        </button>
      </header>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
             <input 
              type="text" 
              placeholder={t('searchPlaceholder', lang)} 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-light shadow-sm"
             />
           </div>
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 shadow-sm">
             <Filter className="w-4 h-4" /> {t('filters', lang)}
           </button>
        </div>

        <div className="p-2 md:p-4">
          {sortedLogs.length > 0 ? (
            <div className="space-y-1">
              {sortedLogs.map((log) => (
                <div 
                  key={log.id}
                  className="flex items-center gap-4 p-4 md:p-6 rounded-2xl hover:bg-gray-50 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{log.date.split(' ')[1]}</span>
                    <span className="text-2xl font-bold text-gray-800">{log.date.split(' ')[2] || log.date.split(' ')[0]}</span>
                  </div>
                  
                  <div className="w-px h-10 bg-gray-100 mx-2" />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate mb-1">{log.title}</h4>
                    <div className="flex flex-wrap gap-1.5 font-bold uppercase tracking-tighter text-[9px]">
                      <span className={`px-2 py-0.5 rounded-full ${log.flow ? 'bg-pink-light text-pink-primary' : 'bg-gray-100 text-gray-400'}`}>
                        {log.flow ? t('flowHistory', lang) : t('noFlowHistory', lang)}
                      </span>
                      {log.symptoms.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                      {log.symptoms.length > 2 && (
                        <span className="bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full">
                          +{log.symptoms.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="hidden md:flex flex-col items-end">
                       <span className="text-[10px] font-bold text-gray-300">{t('moodLabel', lang)}</span>
                       <span className="text-xs font-semibold text-gray-500">{log.mood}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        {onDelete && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if(confirm(t('deleteConfirm', lang))) onDelete(log.id);
                            }}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-pink-primary transition-colors" />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 opacity-50">📁</div>
              <p className="text-gray-400 text-sm font-medium">{t('noLogsHistory', lang)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
