import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ConfettiEffect from './ConfettiEffect';
import { 
  Droplets, 
  Sparkles, 
  Heart, 
  Calendar, 
  Zap, 
  Info, 
  PieChart, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  User,
  Shield,
  CreditCard,
  Wallet,
  Moon,
  Smile,
  Dumbbell,
  ChefHat,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Award,
  GlassWater,
  Apple,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, CycleLog, User as UserType } from '../types';
import { calculateCycleStatus } from '../lib/cycle-logic';
import { calculateWeeklySummary } from '../lib/summary-logic';
import { checkoutPro } from '../lib/stripe';

import CycleCalendar from './CycleCalendar';
import CycleCharts from './CycleCharts';
import RemindersWidget from './RemindersWidget';
import { suggestionsData, PhaseType } from '../lib/suggestions-data';

interface DashboardProps {
  profile: UserProfile;
  logs: CycleLog[];
  user: UserType;
  onNavigate: (screen: string) => void;
}

import { t, Language } from '../lib/i18n';

export default function Dashboard({ profile, logs, user, onNavigate }: DashboardProps) {
  const lang: Language = profile.language || 'pt';
  const status = useMemo(() => calculateCycleStatus(profile, logs), [profile, logs]);
  const weeklySummary = useMemo(() => calculateWeeklySummary(logs), [logs]);
  const userName = user.name;
  const currentDay = status.currentDay;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hydration state
  const [waterCups, setWaterCups] = useState(4);
  
  // Custom checklist items checked states
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  
  // Recipe details shown
  const [showRecipe, setShowRecipe] = useState(false);
  const [mealConsumed, setMealConsumed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Selected Phase for homepage nutrition showcase
  const [selectedHomePhase, setSelectedHomePhase] = useState<PhaseType>(
    (status.phase === 'Folliculary' ? 'Folliculary' : status.phase) as PhaseType
  );
  
  useEffect(() => {
    setSelectedHomePhase((status.phase === 'Folliculary' ? 'Folliculary' : status.phase) as PhaseType);
  }, [status.phase]);
  
  // Phase logic keys mapping
  const phaseKey: PhaseType = (status.phase === 'Folliculary' ? 'Folliculary' : status.phase) as PhaseType;
  const currentSuggestion = suggestionsData[lang]?.[phaseKey] || suggestionsData['pt']?.[phaseKey];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      if (lang === 'pt') return 'Bom dia';
      if (lang === 'es') return 'Buenos días';
      return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      if (lang === 'pt') return 'Boa tarde';
      if (lang === 'es') return 'Buenas tardes';
      return 'Good afternoon';
    } else {
      if (lang === 'pt') return 'Boa noite';
      if (lang === 'es') return 'Buenas noches';
      return 'Good evening';
    }
  }, [lang]);
  
  const StatCard = ({ label, value, sub, color, icon: Icon }: { label: string, value: string | number, sub: string, color: string, icon?: any }) => (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p>
        {Icon && <Icon className={`w-4 h-4 ${color.replace('text-', 'text-opacity-40 text-')}`} />}
      </div>
      <h3 className={`text-4xl font-bold tracking-tight mb-1 ${color}`}>{value}</h3>
      <p className="text-gray-400 text-[10px] font-medium leading-tight">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {showConfetti && <ConfettiEffect onComplete={() => setShowConfetti(false)} />}
      {/* Header with SaaS Welcome */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" /> {t('cycleStatus', lang)}: {t(status.phase.toLowerCase().replace('folliculary', 'follicular').replace('ovulatory', 'ovulatory') as any, lang)}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{greeting}, {userName || (lang === 'pt' ? 'Utilizadora' : lang === 'en' ? 'User' : 'Usuario')} 👋</h2>
          <p className="text-gray-400 text-sm font-medium">{t('ecoSystemDesc', lang)}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase">{t('healthStatus', lang)}</p>
            <p className="text-sm font-bold text-gray-900">{t('excellent', lang)} (98%)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-light flex items-center justify-center shadow-inner">
            <Zap className="w-6 h-6 text-pink-primary" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label={t('currentDay', lang)} 
          value={currentDay} 
          sub={`${t('cycleProgress', lang)}: ${Math.round((currentDay/profile.cycleLength)*100)}%`} 
          color="text-gray-900"
          icon={Droplets}
        />
        <StatCard 
          label={t('period', lang)} 
          value={status.daysUntilNextPeriod} 
          sub={t('estEstimatedPeriod', lang)} 
          color="text-pink-primary font-black"
          icon={Droplets}
        />
        <StatCard 
          label={t('ovulation', lang)} 
          value={status.daysUntilNextOvulation} 
          sub={t('estEstimatedOvulation', lang)} 
          color="text-purple-600"
          icon={Zap}
        />
        <StatCard 
          label={t('hormonalStatus', lang)} 
          value={status.phase === 'Menstrual' ? t('hormonalSensitivity', lang) : t('hormonalStable', lang)} 
          sub={t('currentPhaseBased', lang)} 
          color="text-teal-600"
          icon={Heart}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Insight - SaaS Value Proposition */}
        <div className="lg:col-span-2 space-y-8">
          <CycleCalendar profile={profile} logs={logs} />

          {/* Menstrual Registration Card */}
          <div className="bg-white p-8 rounded-[40px] border-2 border-pink-100 shadow-xl shadow-pink-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-primary text-white flex items-center justify-center shadow-lg">
                  <Droplets className="w-5 h-5" />
                </div>
                {t('logToday', lang)}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('flowIntensity', lang)}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['none', 'light', 'medium', 'heavy'].map((f) => (
                      <button 
                        key={f}
                        className={`py-3 rounded-2xl border text-[10px] font-black uppercase transition-all ${
                          status.phase === 'Menstrual' && f !== 'none' 
                            ? 'border-pink-primary text-pink-primary' 
                            : 'border-gray-100 text-gray-400'
                        } hover:border-pink-primary hover:text-pink-primary`}
                      >
                        {f === 'none' ? (lang === 'pt' ? 'Sem' : lang === 'en' ? 'None' : 'Ning.') : 
                         f === 'light' ? (lang === 'pt' ? 'Leve' : lang === 'en' ? 'Light' : 'Leve') : 
                         f === 'medium' ? (lang === 'pt' ? 'Médio' : lang === 'en' ? 'Medium' : 'Medio') : 
                         (lang === 'pt' ? 'Forte' : lang === 'en' ? 'Heavy' : 'Fuerte')}
                        <div className="mt-1 flex justify-center gap-0.5">
                          {f !== 'none' && Array.from({ length: f === 'light' ? 1 : f === 'medium' ? 2 : 3 }).map((_, i) => (
                            <Droplets key={i} className="w-2 h-2 fill-current" />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('usedProducts', lang)}</p>
                  <div className="flex flex-wrap gap-2">
                    {['Penso', 'Tampão', 'Copo', 'Disco'].map((p) => (
                      <button key={p} className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 hover:bg-pink-50 hover:border-pink-primary transition-all">
                        {lang === 'pt' ? p : p === 'Penso' ? (lang === 'en' ? 'Pad' : 'Compresa') : p === 'Tampão' ? (lang === 'en' ? 'Tampon' : 'Tampón') : p === 'Copo' ? (lang === 'en' ? 'Cup' : 'Copa') : (lang === 'en' ? 'Disc' : 'Disco')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                  {t('saveLog', lang)}
                </button>
              </div>
            </div>
          </div>

          <CycleCharts logs={logs} />

          {/* Weekly Summary - New Highlight Section */}
          <div className="bg-white p-8 md:p-10 rounded-[48px] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="font-black text-2xl text-gray-900 uppercase italic flex items-center gap-3">
                     <div className="w-1.5 h-7 bg-indigo-500 rounded-full" />
                     {t('moodSleepSummary', lang)}
                   </h3>
                   <p className="text-gray-400 text-xs font-bold mt-1 tracking-widest uppercase">{t('weeklyObservations', lang)}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <PieChart className="w-6 h-6" />
                </div>
              </div>

              {weeklySummary.totalLogs > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                          <Moon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900 uppercase italic">{t('sleepPattern', lang)}</h4>
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-black text-gray-900">{weeklySummary.avgSleep.toFixed(1)}</span>
                        <span className="text-gray-400 font-bold text-xs uppercase">{t('hours', lang)}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                        {t('summaryText1', lang)} {weeklySummary.avgSleep.toFixed(1)} {t('summaryText2', lang)}
                      </p>
                      <div className="mt-4 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-400 rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min((weeklySummary.avgSleep / 10) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                          <Smile className="w-5 h-5 text-amber-400" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900 uppercase italic">{t('moodStability', lang)}</h4>
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-black text-gray-900">{weeklySummary.dominantMood}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                        {t('summaryText3', lang)} <span className="text-indigo-600 font-black">"{weeklySummary.dominantMood}"</span> {t('summaryText4', lang)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200 text-center">
                   <p className="text-sm text-gray-400 font-bold italic">{t('noLogs', lang)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#333333] p-8 rounded-[32px] text-white shadow-2xl shadow-black/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-primary/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-pink-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-mid">{t('liveInsight', lang)}</span>
              </div>
              <h4 className="text-xl font-bold mb-3 tracking-tight">{t('energyPotential', lang)}: {t('max', lang)}</h4>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                {t('follicularInsight', lang)}
              </p>
              <button 
                onClick={() => onNavigate('ai')}
                className="w-full bg-white text-gray-900 py-4 rounded-2xl font-bold text-xs hover:bg-pink-light transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                {t('lunaAssistant', lang)} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-gray-900 flex items-center gap-2 text-md">
                <Sparkles className="w-4 h-4 text-pink-primary" />
                {lang === 'pt' ? 'Nutrição Bio-Sincronizada' : lang === 'es' ? 'Nutrición Sincronizada' : 'Bio-Synced Nutrition'}
              </h4>
              <button 
                onClick={() => onNavigate('nutrition_training')}
                className="text-xs text-pink-primary font-bold hover:underline py-1 px-2 hover:bg-pink-light/30 rounded-lg transition-all"
              >
                {lang === 'pt' ? 'Ver Planner de Fase →' : lang === 'es' ? 'Ver Planificador →' : 'View Planner →'}
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gray-50 text-gray-800">
                <span className="text-[9px] font-bold text-pink-primary uppercase tracking-[0.15em] block mb-1">
                  {lang === 'pt' ? 'Foco Nutricional da Fase' : lang === 'es' ? 'Foco Nutricional' : 'Phase Nutrition Focus'}
                </span>
                <h5 className="font-bold text-sm text-gray-950 mb-1">{currentSuggestion.focusName}</h5>
                <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">{currentSuggestion.details}</p>
              </div>

              {/* Water Tracker integration */}
              <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h6 className="font-bold text-xs text-sky-800 flex items-center gap-1">
                      <GlassWater className="w-4 h-4 text-sky-500" />
                      {lang === 'pt' ? 'Registo de Hidratação' : lang === 'es' ? 'Registro de Hidratación' : 'Hydration Tracker'}
                    </h6>
                    <p className="text-[10px] text-sky-600 font-semibold">{lang === 'pt' ? 'Meta recomendada: 8 copos/dia' : lang === 'es' ? 'Meta sugerida: 8 vasos/día' : 'Daily recommended target: 8 cups'}</p>
                  </div>
                  <span className="text-xl font-black text-sky-700">{waterCups} / 8</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (waterCups / 8) * 100)}%` }}
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setWaterCups(prev => Math.max(0, prev - 1))}
                    className="flex-1 bg-white border border-sky-200 text-sky-700 py-2 rounded-xl text-xs font-bold hover:bg-sky-50 flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
                  >
                    <Minus className="w-3  h-3" /> {lang === 'pt' ? 'Copo' : lang === 'es' ? 'Vasos' : 'Cup'}
                  </button>
                  <button 
                    onClick={() => setWaterCups(prev => prev + 1)}
                    className="flex-1 bg-sky-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-sky-700 flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
                  >
                    <Plus className="w-3 h-3" /> {lang === 'pt' ? 'Copo' : lang === 'es' ? 'Vasos' : 'Cup'}
                  </button>
                </div>
                {waterCups >= 8 && (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10.5px] font-bold text-teal-600 text-center mt-3"
                  >
                    💧 {lang === 'pt' ? 'Excelente! Meta de hidratação atingida!' : lang === 'es' ? '¡Excelente! Meta de hidratación lograda!' : 'Awesome! Hydration target reached!'}
                  </motion.p>
                )}
              </div>

              {/* Food checklist */}
              <div className="space-y-3">
                <h6 className="font-bold text-xs text-gray-800">
                  {lang === 'pt' ? 'Equilíbrio Hormonal Inteligente (Checklist)' : lang === 'es' ? 'Alimentos Recomendados' : 'Bio-Aligned Recommended Checklist'}
                </h6>
                <div className="space-y-2">
                  {currentSuggestion.checklist.map((item, idx) => {
                    const isChecked = !!checkedIngredients[item];
                    return (
                      <div 
                        key={idx}
                        onClick={() => setCheckedIngredients(prev => ({ ...prev, [item]: !isChecked }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isChecked ? 'bg-pink-light/10 border-pink-primary/30 text-pink-900 line-through' : 'bg-white border-gray-100/80 hover:border-pink-200'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          isChecked ? 'bg-pink-primary border-pink-primary text-white' : 'bg-gray-50 border-gray-200'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-[11.5px] font-semibold">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Recipe Card */}
              <div className="border border-pink-light/30 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-b from-white to-pink-light/5">
                <div 
                  onClick={() => setShowRecipe(!showRecipe)}
                  className="p-4 flex justify-between items-center bg-pink-light/20 cursor-pointer hover:bg-pink-light/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-pink-primary" />
                    <span className="text-xs font-bold text-gray-800">{lang === 'pt' ? 'Ver Sugestão de Receita' : lang === 'es' ? 'Receta Sugerida' : 'View Suggested Recipe'}</span>
                  </div>
                  {showRecipe ? <ChevronUp className="w-4 h-4 text-pink-primary" /> : <ChevronDown className="w-4 h-4 text-pink-primary" />}
                </div>

                <AnimatePresence>
                  {showRecipe && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-pink-light/30 overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        <h6 className="font-extrabold text-[12.5px] text-gray-900">{currentSuggestion.recipeTitle}</h6>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">{currentSuggestion.recipeDesc}</p>
                        
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{lang === 'pt' ? 'Modo de Preparação:' : lang === 'es' ? 'Preparación:' : 'Preparation steps:'}</span>
                          {currentSuggestion.recipePrep.map((prep, i) => (
                            <div key={i} className="flex gap-2 text-[10.5px] text-gray-600 font-semibold">
                              <span className="text-pink-primary font-bold">{i + 1}.</span>
                              <span className="flex-1 leading-relaxed">{prep}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2">
                          {mealConsumed ? (
                            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-center gap-2 text-teal-700 text-xs font-semibold">
                              <Check className="w-4 h-4" />
                              {lang === 'pt' ? 'Refeição Registada! Bom apetite!' : lang === 'es' ? '¡Receta Registrada!' : 'Recipe nutrition logged!'}
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setMealConsumed(true);
                                setShowConfetti(true);
                              }}
                              className="w-full bg-pink-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-pink-mid transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                            >
                              🍽️ {lang === 'pt' ? 'Marcar como Consumida' : lang === 'es' ? 'Marcar como Consumido' : 'Mark as Consumed'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <RemindersWidget lang={lang} />
          </div>
        </div>
      </div>

      {/* Funcionalidades */}
      <section className="pt-24 md:pt-28">
        <div className="flex flex-col gap-4 mb-10">
          <span className="text-[10px] font-bold text-pink-primary uppercase tracking-[0.2em]">{t('resources', lang)}</span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('everythingYouNeed', lang)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon="📅" 
            title={t('smartCycle', lang)} 
            desc={t('smartCycleDesc', lang)} 
            onClick={() => onNavigate('fertility')}
          />
          <FeatureCard 
            icon="🤖" 
            title={t('ai', lang)} 
            desc={t('lunaAiDesc', lang)} 
            onClick={() => onNavigate('ai')}
          />
          <FeatureCard 
            icon="🔒" 
            title={t('privacyTitle', lang)} 
            desc={t('privacyDesc', lang)} 
            onClick={() => onNavigate('settings')}
          />
          <FeatureCard 
            icon="❤️" 
            title={t('partnerMode', lang)} 
            desc={t('partnerModeDesc', lang)} 
            onClick={() => onNavigate('partner')}
          />
        </div>
      </section>

      {/* Como Funciona */}
      <section className="pt-24 md:pt-28">
        <div className="bg-white p-10 md:p-14 rounded-[48px] border border-gray-100 shadow-sm">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em]">{t('methodology', lang)}</span>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-2">{t('journeySteps', lang)}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="hidden md:block absolute top-[40px] left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-pink-100" />
             
             {[
               { icon: <User className="w-8 h-8" />, title: t('personalizedProfile', lang), desc: t('personalizedProfileDesc', lang) },
               { icon: <Zap className="w-8 h-8" />, title: t('dailyLog', lang), desc: t('dailyLogDesc', lang) },
               { icon: <Sparkles className="w-8 h-8" />, title: t('aiInsights', lang), desc: t('aiInsightsDesc', lang) }
             ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-6 relative z-10 hover:translate-y-[-4px] transition-transform duration-300">
                   <div className="w-20 h-20 rounded-[32px] bg-white border border-gray-100 shadow-xl flex items-center justify-center text-pink-primary relative">
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-primary text-white text-xs font-bold flex items-center justify-center shadow-lg animate-pulse">
                        {i + 1}
                      </span>
                      {step.icon}
                   </div>
                   <div className="space-y-2">
                     <h3 className="font-bold text-gray-900">{step.title}</h3>
                     <p className="text-sm text-gray-500 leading-relaxed px-4 font-semibold">{step.desc}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Preços */}
      <section className="pt-24 md:pt-28">
        <div className="flex flex-col gap-4 mb-10 text-center">
          <span className="text-[10px] font-bold text-pink-primary uppercase tracking-[0.2em]">Upgrade</span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('pricingTitle', lang)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-xl transition-all">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Luna Free</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t('freeEssencial', lang)}</p>
                <div className="flex items-baseline gap-1 my-8">
                   <span className="text-4xl font-black text-gray-900">0€</span>
                   <span className="text-gray-400 font-bold text-sm uppercase">/{t('always', lang)}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                 {[t('basicCalendar', lang), t('basicPredictions', lang), t('symptomTracking', lang)].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <Check className="w-4 h-4 text-green-500" /> {item}
                   </li>
                 ))}
              </ul>
              <button 
                onClick={() => onNavigate('premium')}
                className="w-full py-4 rounded-2xl bg-gray-50 text-gray-900 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all font-semibold"
              >
                {user.plan === 'premium' ? t('freeEssencial', lang) : t('currentPlan', lang)}
              </button>
           </div>

           <div className="bg-gray-900 p-10 rounded-[40px] border-4 border-pink-primary/30 shadow-2xl flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex-1">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="text-lg font-bold text-white">Luna Pro</h3>
                      <p className="text-[10px] font-bold text-pink-primary uppercase tracking-widest mt-1">{t('eliteHealthSaaS', lang)}</p>
                   </div>
                   <div className="bg-pink-primary px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">{t('popular', lang)}</div>
                </div>
                <div className="flex flex-col mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">12,99€</span>
                    <span className="text-gray-400 font-bold text-sm uppercase">/{t('month', lang)}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-pink-primary">20€</span>
                    <span className="text-gray-400 font-bold text-[10px] uppercase">/{t('yearPromo', lang)}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12">
                   {[t('fullHealthAI', lang), t('unlimitedPartner', lang), t('pdfReports', lang), t('nutritionInsights', lang)].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                        <Check className="w-4 h-4 text-pink-primary" /> {item}
                     </li>
                   ))}
                </ul>
              </div>
              <button 
                onClick={() => user.plan === 'premium' ? null : onNavigate('premium')}
                className={`w-full py-4 rounded-2xl text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg relative z-10 ${user.plan === 'premium' ? 'bg-green-500 shadow-green-500/20 cursor-default animate-pulse' : 'bg-pink-primary shadow-pink-primary/20 hover:bg-pink-mid active:scale-95'}`}
              >
                {user.plan === 'premium' ? '★ ' + t('currentPlan', lang) : t('changeToPro', lang)}
              </button>
              {/* Payment Methods */}
              <div className="mt-6 flex flex-col items-center gap-3 opacity-60">
                <p className="text-[8px] font-black uppercase tracking-widest text-pink-primary/50">{t('securePayment', lang)}</p>
                <div className="flex items-center gap-4 text-white/40">
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    <span className="text-[8px] font-bold">VISA</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-orange-400" />
                    <span className="text-[8px] font-bold">MASTERCARD</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wallet className="w-3 h-3 text-blue-400" />
                    <span className="text-[8px] font-bold">PAYPAL</span>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pt-24 md:pt-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('faqTitle', lang)}</h2>
          </div>
          <div className="flex flex-col gap-4">
             {[
               { q: t('faq1Q', lang), a: t('faq1A', lang) },
               { q: t('faq2Q', lang), a: t('faq2A', lang) },
               { q: t('faq3Q', lang), a: t('faq3A', lang) }
             ].map((item, i) => (
               <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                  >
                    <span className="font-bold text-gray-900 text-sm">{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-50"
                      >
                         <div className="px-6 py-5 text-sm text-gray-500 leading-relaxed font-medium">
                            {item.a}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, onClick }: { icon: string, title: string, desc: string, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:border-pink-100 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95' : ''
      }`}
    >
      <div className="text-3xl mb-6">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed font-semibold">{desc}</p>
    </div>
  );
}


