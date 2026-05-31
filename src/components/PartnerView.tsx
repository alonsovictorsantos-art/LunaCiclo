import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Info, Lightbulb, MessageCircle, Heart, Star, CheckCircle2, AlertCircle, Calendar, ChevronDown, ChevronUp, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import { UserProfile, CycleLog } from '../types';
import CycleCalendar from './CycleCalendar';

import { t, Language } from '../lib/i18n';

interface PartnerViewProps {
  profile: UserProfile;
  logs: CycleLog[];
}

export default function PartnerView({ profile, logs }: PartnerViewProps) {
  const lang: Language = profile.language || 'pt';
  const [shareLink, setShareLink] = useState('');
  const [isCopying, setIsCopying] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Demo logic: Day 16 of cycle
  const currentDay = 16;
  const today = new Date().toLocaleDateString(lang === 'pt' ? 'pt-AO' : lang === 'en' ? 'en-US' : 'es-ES', { month: 'short', day: 'numeric' });
  const todayLog = logs.find(l => l.date === today);

  const generateShareLink = () => {
    // Sharing more logs for better calendar visibility
    const data = {
      p: profile,
      l: logs, 
      d: currentDay
    };
    const token = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?partnerData=${token}`;
    setShareLink(url);
    
    navigator.clipboard.writeText(url);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const getPhaseInfo = () => {
    if (currentDay <= 5) return {
      name: 'Fase Menstrual',
      color: 'from-[#FF758C] to-[#FF7EB3]',
      icon: '🩸',
      desc: 'Ela está na fase de libertação. O corpo está a trabalhar no duro para renovar o endométrio. Ofereça conforto total, paciência e evite pressões.',
      tips: [
        { icon: '🍵', title: 'Conforto Hormonal', text: 'Os níveis de estrogénio e progesterona estão no chão. Ela pode sentir-se melancólica ou sem energia.' },
        { icon: '🩸', title: 'Gestão do Fluxo', text: 'Pergunte se precisa de algo da farmácia. Tenha sacos de água quente prontos.' },
        { icon: '🍱', title: 'Nutrição Ferro', text: 'Ela está a perder ferro. Sugira alimentos ricos em ferro (leguminosas, vegetais escuros).' },
        { icon: '💤', title: 'Pausa Total', text: 'O sono pode estar interrompido. Facilite sestas ou noites de descanso sem interrupções.' }
      ]
    };
    if (currentDay <= 13) return {
      name: 'Fase Folicular',
      color: 'from-[#4FACFE] to-[#00F2FE]',
      icon: '🌱',
      desc: 'O estrogénio está a subir! A energia, o brilho e a sociabilidade dela estão no topo. Ótima altura para sair.',
      tips: [
        { icon: '🏃‍♀️', title: 'Aventuras', text: 'Excelente altura para atividades físicas desafiantes ou planos sociais.' },
        { icon: '🌟', title: 'Brilho Natural', text: 'Elogie a pele e o brilho dela. Ela está a sentir-se radiante agora.' },
        { icon: '📅', title: 'Grandes Decisões', text: 'O humor está estável e a clareza mental é máxima. Bom para negociar.' }
      ]
    };
    if (currentDay <= 18) return {
      name: 'Ovulação (Pico)',
      color: 'from-[#FF3D77] to-[#FF8E9E]',
      icon: '✨',
      desc: 'O pico máximo de fertilidade e magnetismo. O humor está no topo e o desejo de conexão é intenso.',
      tips: [
        { icon: '🕯️', title: 'Conexão Profunda', text: 'Planeie algo romântico a dois. Ela está muito recetiva à intimidade.' },
        { icon: '🌹', title: 'Valorização', text: 'Atenção aos detalhes. Ela sente-se mais confiante do que nunca.' },
        { icon: '💎', title: 'Foco Total', text: 'Desligue o telemóvel. O tempo de qualidade hoje vale por dez.' }
      ]
    };
    return {
      name: 'Fase Luteal (TPM)',
      color: 'from-[#6A11CB] to-[#2575FC]',
      icon: '🌙',
      desc: 'Sintonize a sua sensibilidade. O humor pode oscilar e ela pode sentir-se mais inchada ou carente.',
      tips: [
        { icon: '🧘', title: 'Paciência Ativa', text: 'Não leve as reações a peito. É biológico. Ofereça um porto seguro.' },
        { icon: '🛋️', title: 'Alivie a Carga', text: 'Tome iniciativa nas tarefas domésticas. Reduza as responsabilidades dela.' },
        { icon: '🎧', title: 'Escuta Empática', text: 'Ouça as frustrações sem tentar resolver tudo. Valide o que ela sente.' }
      ]
    };
  };

  const phase = getPhaseInfo();

  return (
    <div className="space-y-8 pb-32 transition-colors">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            <ShieldCheck className="w-3 h-3" /> Acesso Seguro do Parceiro
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             {t('partnerViewTitle', lang)} 👋
          </h2>
          <p className="text-gray-400 text-sm font-medium">{t('partnerViewDesc', lang)}</p>
        </div>
        <button 
          onClick={() => setShowCalendar(!showCalendar)}
          className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            showCalendar 
              ? 'bg-gray-900 text-white shadow-gray-900/20' 
              : 'bg-white text-gray-900 border border-gray-100 shadow-sm hover:shadow-md'
          }`}
        >
          <Calendar className="w-5 h-5" /> 
          {showCalendar ? t('hideCalendar', lang) : t('showCalendarDela', lang)}
          {showCalendar ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
        </button>
      </header>

      <AnimatePresence>
        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <CycleCalendar profile={profile} logs={logs} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Phase Banner */}
      <div className={`bg-gradient-to-br ${phase.color} p-10 md:p-12 rounded-[48px] text-white shadow-2xl shadow-pink-primary/10 relative overflow-hidden group`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-10">
          <div className="w-28 h-28 bg-white/20 backdrop-blur-2xl rounded-[36px] flex items-center justify-center text-6xl shadow-2xl border border-white/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">
            {phase.icon}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                <Sparkles className="w-3 h-3 text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('currentPhase', lang)}</span>
              </div>
              <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-white text-gray-900 shadow-sm leading-none">{t('dayLabel', lang)} {currentDay}</span>
            </div>
            <h3 className="text-4xl font-black mb-4 tracking-tight uppercase italic">{phase.name}</h3>
            <p className="text-white/90 text-base leading-relaxed max-w-xl font-semibold">
              {phase.desc}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Support Section */}
        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
           <div className="flex items-center justify-between mb-10">
             <h3 className="font-black flex items-center gap-3 text-xl text-gray-900 uppercase italic">
               <div className="w-1.5 h-7 bg-amber-400 rounded-full" />
               {t('supportManual', lang)}
             </h3>
             <Lightbulb className="w-6 h-6 text-amber-400" />
           </div>
           <div className="space-y-10">
              {phase.tips.map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl group-hover:bg-amber-50 group-hover:scale-110 transition-all duration-300 shadow-sm border border-gray-100">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-black text-gray-900 mb-1 uppercase italic tracking-tighter">{item.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed font-semibold">{item.text}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
          {/* Today's Symptoms */}
          <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
             <div className="flex items-center justify-between mb-10">
                <h3 className="font-black flex items-center gap-3 text-xl text-gray-900 uppercase italic">
                   <div className="w-1.5 h-7 bg-pink-primary rounded-full" />
                   {t('today', lang)}
                </h3>
                <Heart className="w-6 h-6 text-pink-primary" />
             </div>
             {todayLog ? (
               <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">{t('loggedSymptoms', lang)}</p>
                    <div className="flex flex-wrap gap-2">
                        {todayLog.symptoms.map((s, idx) => (
                        <span key={idx} className="bg-pink-50 text-pink-primary border border-pink-100 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-tighter">
                            {s}
                        </span>
                        ))}
                        {todayLog.symptoms.length === 0 && <span className="text-sm text-gray-400 italic">{t('noSymptomsLogged', lang)}</span>}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('spiritState', lang)}</p>
                    <p className="text-lg font-black text-gray-900 italic uppercase">{todayLog.mood || t('notInformed', lang)}</p>
                  </div>
               </div>
             ) : (
               <div className="text-center py-12 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                 <p className="text-sm text-gray-400 font-bold leading-relaxed">
                   {t('partnerNotLogged', lang)}<br/>
                   <span className="text-pink-primary">{t('askHowFeeling', lang)}</span>
                 </p>
               </div>
             )}
          </div>

          {/* Quick Advice Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-8 rounded-[40px] bg-teal-50 border border-teal-100 shadow-sm group">
                <CheckCircle2 className="w-6 h-6 text-teal-600 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-teal-900 mb-2 uppercase tracking-widest">{t('whatToDoNow', lang)}</p>
                <p className="text-sm text-teal-700/80 leading-relaxed font-black uppercase italic">Prioridade: Conexão emocional e escuta ativa.</p>
              </div>
              <div className="p-8 rounded-[40px] bg-pink-50 border border-pink-100 shadow-sm group">
                <AlertCircle className="w-6 h-6 text-pink-primary mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-pink-900 mb-2 uppercase tracking-widest">{t('nextAlert', lang)}</p>
                <p className="text-sm text-pink-700/80 leading-relaxed font-black uppercase italic">Menstruação em ~12 dias. Reserve paciência.</p>
              </div>
          </div>
        </div>
      </div>

      {/* Share Section improved */}
      <div className="bg-gray-900 p-10 md:p-12 rounded-[56px] shadow-2xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center gap-10">
         <div className="absolute top-0 right-0 w-64 h-64 bg-pink-primary/10 blur-3xl -mr-32 -mt-32" />
         <div className="w-24 h-24 bg-pink-primary/20 backdrop-blur-xl text-pink-primary rounded-[32px] flex items-center justify-center flex-shrink-0 shadow-inner border border-white/5">
            <Share2 className="w-12 h-12" />
         </div>
         <div className="flex-1 relative z-10">
           <h4 className="font-black text-2xl text-white mb-3 uppercase italic">{t('privacyControl', lang)}</h4>
           <p className="text-base text-gray-400 mb-0 font-medium max-w-md">
             {shareLink ? t('linkCopied', lang) : t('generateAccessDesc', lang)}
           </p>
         </div>
         <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
            {shareLink && (
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3">
                <input 
                    readOnly 
                    value={shareLink} 
                    className="bg-transparent text-[10px] text-gray-300 w-full md:w-48 outline-none font-bold" 
                />
              </div>
            )}
            <button 
              onClick={generateShareLink}
              className={`w-full md:w-auto py-5 px-12 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                isCopying ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-pink-primary text-white shadow-pink-primary/40 hover:opacity-90'
              }`}
            >
              {isCopying ? (
                <><CheckCircle2 className="w-5 h-5" /> {lang === 'pt' ? 'Copiado!' : lang === 'en' ? 'Copied!' : '¡Copiado!'}</>
              ) : (
                <><MessageCircle className="w-5 h-5" /> {shareLink ? t('copyLink', lang) : t('generateAccess', lang)}</>
              )}
            </button>
         </div>
      </div>
    </div>
  );
}
