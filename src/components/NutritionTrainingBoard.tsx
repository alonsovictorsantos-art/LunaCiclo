/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ConfettiEffect from './ConfettiEffect';
import { 
  Apple, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Activity, 
  Heart, 
  ChefHat, 
  GlassWater,
  Utensils,
  Leaf,
  Droplet,
  Info,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { UserProfile, CycleLog, User } from '../types';
import { calculateCycleStatus } from '../lib/cycle-logic';
import { suggestionsData, PhaseType } from '../lib/suggestions-data';
import { getAdaptedSuggestion, DietType } from '../lib/diet-adapter';

interface NutritionTrainingBoardProps {
  profile: UserProfile;
  logs: CycleLog[];
  user: User;
  onUpdateProfile?: (profileData: Partial<UserProfile>) => Promise<void>;
}

type TabType = 'meals' | 'recipe' | 'balance';

export default function NutritionTrainingBoard({ profile, logs, user, onUpdateProfile }: NutritionTrainingBoardProps) {
  const lang = profile.language === 'en' || profile.language === 'es' || profile.language === 'pt' 
    ? profile.language 
    : 'pt';
  
  const status = calculateCycleStatus(profile, logs);

  const getPhaseType = (phase: string): PhaseType => {
    if (!phase) return 'Folliculary';
    const lower = phase.toLowerCase();
    if (lower.includes('menstru') || lower.includes('mênstru') || lower.includes('menstr')) return 'Menstrual';
    if (lower.includes('follicul') || lower.includes('folicul') || lower.includes('folic')) return 'Folliculary';
    if (lower.includes('ovulat') || lower.includes('ovula')) return 'Ovulatory';
    if (lower.includes('luteal') || lower.includes('lutea') || lower.includes('lútea')) return 'Luteal';
    return 'Folliculary';
  };

  const currentPhase: PhaseType = getPhaseType(status.phase);
  
  // Selected Phase to inspect
  const [selectedPhase, setSelectedPhase] = useState<PhaseType>(currentPhase);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<TabType>('meals');

  // Load and save consumed meals
  const [consumedMeals, setConsumedMeals] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`bloom_consumed_meals_${selectedPhase}`);
    return saved ? JSON.parse(saved) : { breakfast: false, lunch: false, snack: false, dinner: false };
  });

  // Reset/update meal checks when phase changes
  useEffect(() => {
    const saved = localStorage.getItem(`bloom_consumed_meals_${selectedPhase}`);
    setConsumedMeals(saved ? JSON.parse(saved) : { breakfast: false, lunch: false, snack: false, dinner: false });
  }, [selectedPhase]);

  const toggleMeal = (mealKey: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
    const updated = { ...consumedMeals, [mealKey]: !consumedMeals[mealKey] };
    setConsumedMeals(updated);
    localStorage.setItem(`bloom_consumed_meals_${selectedPhase}`, JSON.stringify(updated));

    // If all are completed, show a fun feedback
    if (updated.breakfast && updated.lunch && updated.snack && updated.dinner) {
      setShowConfetti(true);
    }
  };

  const markAllMeals = (status: boolean) => {
    const updated = { breakfast: status, lunch: status, snack: status, dinner: status };
    setConsumedMeals(updated);
    localStorage.setItem(`bloom_consumed_meals_${selectedPhase}`, JSON.stringify(updated));
    if (status) {
      setShowConfetti(true);
    }
  };

  // Custom ingredients checked states
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Quick Daily Symptom Tuner
  const [activeSymptom, setActiveSymptom] = useState<'none' | 'cramps' | 'headache' | 'bloating'>('none');

  // Hydration state
  const [waterCups, setWaterCups] = useState(() => {
    const saved = localStorage.getItem('bloom_water_cups_today');
    return saved ? parseInt(saved, 10) : 4;
  });

  useEffect(() => {
    localStorage.setItem('bloom_water_cups_today', waterCups.toString());
    if (waterCups === 8) {
      setShowConfetti(true);
    }
  }, [waterCups]);

  const [showConfetti, setShowConfetti] = useState(false);

  // Diet Preference state
  const [dietPreference, setDietPreference] = useState<DietType>(() => {
    if (profile?.dietPreference) {
      if (profile.dietPreference === 'vegetarian') return 'vegetarian';
      if (profile.dietPreference === 'vegan') return 'vegan';
      return 'standard';
    }
    const saved = localStorage.getItem('bloom_diet_preference');
    return (saved as DietType) || 'standard';
  });

  useEffect(() => {
    if (profile?.dietPreference) {
      if (profile.dietPreference === 'vegetarian') setDietPreference('vegetarian');
      else if (profile.dietPreference === 'vegan') setDietPreference('vegan');
      else setDietPreference('standard');
    }
  }, [profile?.dietPreference]);

  const [isChangingDiet, setIsChangingDiet] = useState(false);

  const baseSuggestion = suggestionsData[lang]?.[selectedPhase] || suggestionsData['pt']?.[selectedPhase];
  const activeSuggestion = baseSuggestion ? getAdaptedSuggestion(baseSuggestion, dietPreference, selectedPhase, lang) : null;

  const handleUpdateDietPreference = async (dietId: DietType, profileId: 'omnivore' | 'vegetarian' | 'vegan') => {
    localStorage.setItem('bloom_diet_preference', dietId);
    setDietPreference(dietId);
    if (onUpdateProfile) {
      await onUpdateProfile({ dietPreference: profileId });
    }
    setShowConfetti(true);
  };

  // Translations Map for UX UI
  const contentMap = {
    pt: {
      title: "Menu Sincronizado",
      subtitle: "Alimentar-se em sintonia com a sua biologia nunca foi tão simples.",
      activePhaseBadge: "Sua fase ativa hoje",
      selectPhaseLabel: "Fase do Ciclo Ativa",
      dietLabel: "Preferência Alimentar",
      tabMeals: "Plano Alimentar",
      tabRecipe: "Receita & Hidratação",
      tabBalance: "Nutrição & Sintomas",
      consumedAll: "Completou todas as refeições de hoje! Fantástico! ✨🌿",
      markAllLabel: "Marcar todas como consumidas",
      unmarkAllLabel: "Limpar registo de hoje",
      melTitle: "Plano para",
      breakfast: "Pequeno-Almoço",
      lunch: "Almoço",
      snack: "Lanche",
      dinner: "Jantar",
      waterTitle: "Registo de Hidratação Diária",
      waterSub: "Toque nas gotas para marcar a sua hidratação.",
      waterDone: "Excelente! Meta de água de 2L atingida! 💧",
      recipeTitle: "Dica de Refeição de Apoio",
      recipeIngredients: "Checklist de Ingredientes",
      recipeSteps: "Preparação Passo a Passo",
      symptomLabel: "Como se sente o seu corpo hoje?",
      symptomSub: "Ajuste rápido para adaptar as recomendações alimentares do dia.",
      sympNone: "Estou ótima ✨",
      sympCramps: "Cólicas / Dores 🩸",
      sympHeadache: "Dor de Cabeça 🫨",
      sympBloating: "Inchaço / Retenção 🎈",
      focusLabel: "Nutrientes em foco nesta fase:",
      avoidLabel: "Evite ou modere o consumo:",
      symptomHeader: "Adaptação recomendada para",
      tipCramps: "Beba chá de gengibre com canela morno. O gingerol e compostos fenólicos ajudam a relaxar as contrações do músculo liso uterino inibindo os picos de prostaglandina inflamatória.",
      tipHeadache: "Suplemente magnésio de fontes alimentares (peixe, banana, cacau 70%) e beba chá de camomila ou melissa morno. Evite açúcares que causem picos e declínios insulínicos bruscos.",
      tipBloating: "Reduza drasticamente alimentos enlatados ou ricos em sódio. Consuma cavalinha ou chá de dente-de-leão e prefira vegetais vaporizados aos folhosos crus, facilitando as digestões lentas luteais.",
      dietOmni: "Omnívora 🥩",
      dietVeg: "Vegetariana 🥗",
      dietVegan: "Vegana 🌱",
      changeTip: "As refeições mudam automaticamente para apoiar o seu corpo nesta fase.",
      avoidFoods: {
        Menstrual: ["Café forte em jejum, bebidas geladas, doces refinados"],
        Folliculary: ["Açúcar branco em excesso, óleos refinados pesados"],
        Ovulatory: ["Bebidas alcoólicas, excesso de sal e gorduras saturadas"],
        Luteal: ["Excesso de estimulantes, café tardio e açúcar refinado"]
      }
    },
    en: {
      title: "Synced Menu",
      subtitle: "Eating in rhythm with your biology has never been so simple.",
      activePhaseBadge: "Your active phase today",
      selectPhaseLabel: "Active Cycle Phase",
      dietLabel: "Diet Preference",
      tabMeals: "Meal Plan",
      tabRecipe: "Recipe & Hydration",
      tabBalance: "Nutrition & Symptoms",
      consumedAll: "You have completed all today's meals! Fantastic! ✨🌿",
      markAllLabel: "Mark all as consumed",
      unmarkAllLabel: "Reset today's logs",
      melTitle: "Plan for",
      breakfast: "Breakfast",
      lunch: "Lunch",
      snack: "Snack",
      dinner: "Dinner",
      waterTitle: "Daily Hydration Log",
      waterSub: "Tap on the drops to log your water intake.",
      waterDone: "Awesome! 2L water target achieved! 💧",
      recipeTitle: "Supportive Warm Recipe",
      recipeIngredients: "Ingredients Checklist",
      recipeSteps: "Step-by-step Prep",
      symptomLabel: "How does your body feel today?",
      symptomSub: "Quick tune to customize your dietary advice instantly.",
      sympNone: "Feeling Good ✨",
      sympCramps: "Cramps / Pain 🩸",
      sympHeadache: "Headache / Migraine 🫨",
      sympBloating: "Bloating / Gas 🎈",
      focusLabel: "Nutrients in focus this phase:",
      avoidLabel: "Limit or avoid today:",
      symptomHeader: "Bio-sync tip for",
      tipCramps: "Drink warm ginger-cinnamon tea. Gingerol helps soothe smooth muscle contractions inside the uterine system by moderating inflammatory prostaglandin spikes.",
      tipHeadache: "Ensure premium magnesium from diet (fish, bananas, 70%+ dark chocolate). Have warm camomile tea. Avoid sugar crashes to bypass sudden insulin drops.",
      tipBloating: "Significantly reduce processed sodium. Drink dandelion-root or warm herbal infusions. Prefer lightly steamed greens over raw salads to ease sluggish digestion.",
      dietOmni: "Meat & Fish 🥩",
      dietVeg: "Vegetarian 🥗",
      dietVegan: "Vegan 🌱",
      changeTip: "Meals update automatically to match your body's phase needs.",
      avoidFoods: {
        Menstrual: ["Strong coffee on empty stomach, iced drinks, refined sugars"],
        Folliculary: ["Excess industrial white sugar, heavy refined oils"],
        Ovulatory: ["Alcoholic drinks, excess table sodium, saturated fats"],
        Luteal: ["Late-day caffeine, high-glycemic sweeteners, processed carbohydrates"]
      }
    },
    es: {
      title: "Menú Sincronizado",
      subtitle: "Alimentarte en armonía con tus hormonas nunca fue tan sencillo.",
      activePhaseBadge: "Tu fase menstrual hoy",
      selectPhaseLabel: "Fase del Ciclo Activa",
      dietLabel: "Preferencia de Dieta",
      tabMeals: "Plan de Dietas",
      tabRecipe: "Receta e Hidratación",
      tabBalance: "Nutrición y Síntomas",
      consumedAll: "¡Has completado todas las comidas de hoy! ¡Excelente! ✨🌿",
      markAllLabel: "Marcar todas como consumidas",
      unmarkAllLabel: "Limpiar registro de hoy",
      melTitle: "Planes para",
      breakfast: "Desayuno",
      lunch: "Almuerzo",
      snack: "Merienda",
      dinner: "Cena",
      waterTitle: "Registro de Hidratación",
      waterSub: "Toca las gotas para registrar tus vasos de agua.",
      waterDone: "¡Increíble! Meta de 2L de agua cumplida. 💧",
      recipeTitle: "Sugerencia de Receta de Apoyo",
      recipeIngredients: "Ingredientes necesarios",
      recipeSteps: "Preparación paso a paso",
      symptomLabel: "¿Cómo siente su cuerpo hoy?",
      symptomSub: "Ajuste rápido para adaptar tus comidas de inmediato.",
      sympNone: "Me siento bien ✨",
      sympCramps: "Cólicos / Dolor 🩸",
      sympHeadache: "Dolor de Cabeza 🫨",
      sympBloating: "Hinchazón / Gases 🎈",
      focusLabel: "Nutrientes priorizados:",
      avoidLabel: "Evitar o moderar hoy:",
      symptomHeader: "Adaptación ideal para",
      tipCramps: "Tome té tibio de jengibre y canela. El gingerol reduce los picos de prostaglandinas minimizando las dolorosas contracciones uterinas.",
      tipHeadache: "Favorezca fuentes de magnesio noble (pescados limpios, semillas, plátano, chocolate al 75%). Reduzca picos insulínicos bruscos provocados por carbohidratos simples.",
      tipBloating: "Elimine los alimentos con exceso de sol o enlatados. Busque tés de diente de león o cola de caballo, y consuma los vegetales ligeramente cocidos al vapor en vez de crudos.",
      dietOmni: "Omnívora 🥩",
      dietVeg: "Vegetariana 🥗",
      dietVegan: "Vegana 🌱",
      changeTip: "Tu comida cambia automáticamente para guiar tu bienestar en esta fase.",
      avoidFoods: {
        Menstrual: ["Café fuerte en ayunas, refrescos fríos, dulces refinados"],
        Folliculary: ["Exceso de azúcar blanco refinado, aceites industriales pesados"],
        Ovulatory: ["Bebidas alcohólicas, exceso de sodio y grasas pesadas"],
        Luteal: ["Estimulantes tardíos, jugos azucarados, exceso de carbohidratos simples"]
      }
    }
  }[lang];

  const allMealsChecked = consumedMeals.breakfast && consumedMeals.lunch && consumedMeals.snack && consumedMeals.dinner;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 px-4 md:px-0">
      {showConfetti && <ConfettiEffect onComplete={() => setShowConfetti(false)} />}
      
      {/* 1. HERO TITLE & CORE DETECTOR BAR */}
      <div className="bg-white py-6 px-6 md:px-8 rounded-3xl border border-gray-100/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-primary px-3 py-1 rounded-full text-xs font-bold border border-pink-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'pt' ? 'Fácil Manuseio ✨' : lang === 'es' ? 'Fácil Manejo ✨' : 'Easy Access ✨'}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{contentMap.title}</h1>
          <p className="text-xs text-gray-500 leading-normal font-medium">{contentMap.subtitle}</p>
        </div>

        {/* Phase Badge */}
        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex items-center gap-3 self-start md:self-auto shrink-0">
          <div className="w-9 h-9 rounded-full bg-pink-light/30 flex items-center justify-center border border-pink-100">
            <Activity className="w-4.5 h-4.5 text-pink-primary animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
              {contentMap.activePhaseBadge}
            </span>
            <span className="text-xs font-black text-gray-900">
              {currentPhase === 'Menstrual' ? (lang === 'pt' ? 'Fase Menstrual 🩸' : lang === 'es' ? 'Fase Menstrual 🩸' : 'Menstrual Phase 🩸') : 
               currentPhase === 'Folliculary' ? (lang === 'pt' ? 'Fase Folicular 🌱' : lang === 'es' ? 'Fase Folicular 🌱' : 'Follicular Phase 🌱') : 
               currentPhase === 'Ovulatory' ? (lang === 'pt' ? 'Fase Ovulatória 🔥' : lang === 'es' ? 'Fase Ovulatoria 🔥' : 'Ovulatory Phase 🔥') : 
               (lang === 'pt' ? 'Fase Lútea 🍂' : lang === 'es' ? 'Fase Lútea 🍂' : 'Luteal Phase 🍂')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. DIRECT CONTROL CONTROLLERS (DIET & PHASE SWITCHERS) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        
        {/* Phase Selectors */}
        <div className="md:col-span-12 bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-gray-800 uppercase tracking-widest">{contentMap.selectPhaseLabel}</span>
              <p className="text-[10px] text-gray-400 font-bold">{contentMap.changeTip}</p>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-50/75 py-1.5 px-3 rounded-xl border border-gray-100/50 self-start sm:self-auto">
              <span className="text-[11px] font-bold text-gray-500">
                {lang === 'pt' ? 'Preferência: ' : lang === 'es' ? 'Preferencia: ' : 'Preference: '}
                <span className="text-pink-primary font-black">
                  {dietPreference === 'standard' ? (lang === 'pt' ? 'Omnívora 🥩' : lang === 'es' ? 'Omnívora 🥩' : 'Omnivorous 🥩') : 
                   dietPreference === 'vegetarian' ? (lang === 'pt' ? 'Vegetariana 🥗' : lang === 'es' ? 'Vegetariana 🥗' : 'Vegetarian 🥗') : 
                   (lang === 'pt' ? 'Vegana 🌱' : lang === 'es' ? 'Vegana 🌱' : 'Vegan 🌱')}
                </span>
              </span>
              <button 
                onClick={() => setIsChangingDiet(!isChangingDiet)} 
                className="text-[11px] font-black text-pink-primary hover:text-pink-700 underline cursor-pointer transition-colors"
                id="change-diet-preference-btn"
              >
                {isChangingDiet 
                  ? (lang === 'pt' ? 'Concluído' : lang === 'es' ? 'Hecho' : 'Done') 
                  : (lang === 'pt' ? 'Mudar' : lang === 'es' ? 'Cambiar' : 'Change')}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isChangingDiet && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-r from-pink-light/30 to-purple-50/30 p-4 rounded-2xl border border-pink-100/50 flex flex-col sm:flex-row items-center gap-3">
                  <span className="text-[11px] font-black text-pink-primary shrink-0 uppercase tracking-wider">
                    {lang === 'pt' ? 'Nova preferência:' : lang === 'es' ? 'Nueva preferencia:' : 'New preference:'}
                  </span>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {([
                      { id: 'standard', profileId: 'omnivore', label: lang === 'pt' ? 'Omnívora 🥩' : lang === 'es' ? 'Omnívora 🥩' : 'Omnivorous 🥩' },
                      { id: 'vegetarian', profileId: 'vegetarian', label: lang === 'pt' ? 'Vegetariana 🥗' : lang === 'es' ? 'Vegetariana 🥗' : 'Vegetarian 🥗' },
                      { id: 'vegan', profileId: 'vegan', label: lang === 'pt' ? 'Vegana 🌱' : lang === 'es' ? 'Vegana 🌱' : 'Vegan 🌱' }
                    ] as const).map((d) => {
                      const isActive = dietPreference === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => handleUpdateDietPreference(d.id, d.profileId)}
                          className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-black transition-all cursor-pointer active:scale-95 ${
                            isActive 
                              ? 'bg-pink-primary text-white border-pink-primary shadow-xs' 
                              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {([
              { id: 'Menstrual', emoji: '🩸', label: lang === 'pt' ? 'Menstrual' : lang === 'es' ? 'Menstrual' : 'Menstrual', desc: lang === 'pt' ? 'D. 1 - 5' : lang === 'es' ? 'Días 1 - 5' : 'D. 1 - 5' },
              { id: 'Folliculary', emoji: '🌱', label: lang === 'pt' ? 'Folicular' : lang === 'es' ? 'Folicular' : 'Follicular', desc: lang === 'pt' ? 'D. 6 - 12' : lang === 'es' ? 'Días 6 - 12' : 'D. 6 - 12' },
              { id: 'Ovulatory', emoji: '🔥', label: lang === 'pt' ? 'Ovulatória' : lang === 'es' ? 'Ovulatoria' : 'Ovulatory', desc: lang === 'pt' ? 'D. 13 - 16' : lang === 'es' ? 'Días 13 - 16' : 'D. 13 - 16' },
              { id: 'Luteal', emoji: '🍂', label: lang === 'pt' ? 'Lútea' : lang === 'es' ? 'Lútea/SPM' : 'Luteal', desc: lang === 'pt' ? 'D. 17 - 28' : lang === 'es' ? 'Días 17 - 28' : 'D. 17 - 28' }
            ] as const).map((p) => {
              const isSelected = selectedPhase === p.id;
              const isCurrent = currentPhase === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhase(p.id)}
                  className={`px-3 py-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-center gap-0.5 group active:scale-98 cursor-pointer ${
                    isSelected 
                      ? 'bg-pink-primary text-white border-pink-primary shadow-xs ring-1 ring-pink-primary/30' 
                      : 'bg-gray-50/40 border-gray-100 hover:border-pink-200'
                  }`}
                >
                  {isCurrent && (
                    <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white animate-bounce' : 'bg-pink-primary'}`} />
                  )}
                  <div className="flex items-center gap-1.5 ">
                    <span className="text-base">{p.emoji}</span>
                    <span className={`text-[12px] font-extrabold tracking-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>{p.label}</span>
                  </div>
                  <span className={`text-[9px] font-extrabold ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. SIMPLIFIED TAB BAR (EXTREMELY ORGANIZED) */}
      <div className="flex border-b border-gray-200 gap-2 p-1 bg-gray-50/55 rounded-2xl max-w-md mx-auto">
        {([
          { id: 'meals', label: contentMap.tabMeals, icon: Utensils },
          { id: 'recipe', label: contentMap.tabRecipe, icon: ChefHat },
          { id: 'balance', label: contentMap.tabBalance, icon: Heart }
        ] as const).map((tb) => {
          const isSelected = activeTab === tb.id;
          const Icon = tb.icon;

          return (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-0 outline-none ${
                isSelected 
                  ? 'bg-white text-pink-primary shadow-xs' 
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-pink-primary' : 'text-gray-400'}`} />
              <span>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. ACTIVE TAB PANEL RENDERING WITH TRANSITIONS */}
      <div className="min-h-[380px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: MEALS */}
          {activeTab === 'meals' && (
            <motion.div
              key="meals-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Top Mini Control / Complete Progress Tracker */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-gray-900">
                    {contentMap.melTitle} {selectedPhase === 'Menstrual' ? '🩸 Menstrual' : selectedPhase === 'Folliculary' ? '🌱 Folicular' : selectedPhase === 'Ovulatory' ? '🔥 Ovulatória' : '🍂 Lútea'}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold">
                    {Object.values(consumedMeals).filter(Boolean).length} / 4 {lang === 'pt' ? 'refeições registadas hoje' : 'meals registered today'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => markAllMeals(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-pink-100 text-pink-primary bg-pink-50/40 hover:bg-pink-50 text-xs font-bold transition-all"
                  >
                    {contentMap.markAllLabel}
                  </button>
                  <button
                    onClick={() => markAllMeals(false)}
                    className="px-3 py-1.5 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-600 bg-white text-xs font-bold transition-all"
                  >
                    {contentMap.unmarkAllLabel}
                  </button>
                </div>
              </div>

              {allMealsChecked && (
                <motion.div 
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-150 text-xs font-bold text-center"
                >
                  🎉 {contentMap.consumedAll}
                </motion.div>
              )}

              {/* Grid of Meals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* BREAKFAST */}
                <div 
                  onClick={() => toggleMeal('breakfast')}
                  className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer text-left flex gap-4 items-start ${
                    consumedMeals.breakfast 
                      ? 'border-emerald-200 bg-emerald-50/10 shadow-xs' 
                      : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    consumedMeals.breakfast ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {consumedMeals.breakfast && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍳</span>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{contentMap.breakfast}</span>
                    </div>
                    <p className={`text-xs leading-relaxed font-semibold ${consumedMeals.breakfast ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {activeSuggestion?.meals?.breakfast}
                    </p>
                  </div>
                </div>

                {/* LUNCH */}
                <div 
                  onClick={() => toggleMeal('lunch')}
                  className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer text-left flex gap-4 items-start ${
                    consumedMeals.lunch 
                      ? 'border-emerald-200 bg-emerald-50/10 shadow-xs' 
                      : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    consumedMeals.lunch ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {consumedMeals.lunch && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🥗</span>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{contentMap.lunch}</span>
                    </div>
                    <p className={`text-xs leading-relaxed font-semibold ${consumedMeals.lunch ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {activeSuggestion?.meals?.lunch}
                    </p>
                  </div>
                </div>

                {/* SNACK */}
                <div 
                  onClick={() => toggleMeal('snack')}
                  className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer text-left flex gap-4 items-start ${
                    consumedMeals.snack 
                      ? 'border-emerald-200 bg-emerald-50/10 shadow-xs' 
                      : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    consumedMeals.snack ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {consumedMeals.snack && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍎</span>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{contentMap.snack}</span>
                    </div>
                    <p className={`text-xs leading-relaxed font-semibold ${consumedMeals.snack ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {activeSuggestion?.meals?.snack}
                    </p>
                  </div>
                </div>

                {/* DINNER */}
                <div 
                  onClick={() => toggleMeal('dinner')}
                  className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer text-left flex gap-4 items-start ${
                    consumedMeals.dinner 
                      ? 'border-emerald-200 bg-emerald-50/10 shadow-xs' 
                      : 'border-gray-100 hover:border-pink-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    consumedMeals.dinner ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {consumedMeals.dinner && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍲</span>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{contentMap.dinner}</span>
                    </div>
                    <p className={`text-xs leading-relaxed font-semibold ${consumedMeals.dinner ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {activeSuggestion?.meals?.dinner}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: RECIPE & WATER */}
          {activeTab === 'recipe' && (
            <motion.div
              key="recipe-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              
              {/* Daily recipe block (7 Columns) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-primary flex items-center justify-center">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-pink-primary uppercase tracking-wider block">{contentMap.recipeTitle}</span>
                    <h2 className="text-base font-black text-gray-900">{activeSuggestion?.recipeTitle}</h2>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {activeSuggestion?.recipeDesc}
                </p>

                {/* Steps */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider block">{contentMap.recipeSteps}</span>
                  <div className="space-y-2">
                    {activeSuggestion?.recipePrep.map((step, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-gray-600 font-semibold leading-relaxed">
                        <span className="w-5 h-5 rounded bg-pink-50 text-pink-primary font-black flex items-center justify-center shrink-0 pr-[1px]">{idx + 1}</span>
                        <p className="flex-1 mt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ingredients checklist */}
                <div className="space-y-2.5 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider block">{contentMap.recipeIngredients}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeSuggestion?.checklist.map((item, idx) => {
                      const isChecked = !!checkedIngredients[item];
                      return (
                        <div 
                          key={idx}
                          onClick={() => setCheckedIngredients(prev => ({ ...prev, [item]: !isChecked }))}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer select-none transition-all ${
                            isChecked 
                              ? 'bg-pink-55/10 border-pink-100 text-pink-900/50 line-through' 
                              : 'bg-gray-50/50 border-gray-100 hover:border-pink-200'
                          }`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all ${
                            isChecked ? 'bg-pink-primary border-pink-primary text-white' : 'bg-white border-gray-200'
                          }`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-[11px] font-bold tracking-tight">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Water Tracker (5 Columns) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Droplet className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900">{contentMap.waterTitle}</h3>
                    <p className="text-[10px] text-gray-400 font-extrabold block">{contentMap.waterSub}</p>
                  </div>
                </div>

                {/* Grid of 8 beautiful glasses / drops of water */}
                <div className="py-2 flex items-center justify-between gap-1 max-w-sm mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                    const isFilled = waterCups >= index;
                    return (
                      <button
                        key={index}
                        onClick={() => setWaterCups(index)}
                        className={`w-9 h-11 rounded-xl transition-all border flex flex-col items-center justify-end pb-2 overflow-hidden relative cursor-pointer active:scale-90 ${
                          isFilled 
                            ? 'bg-sky-500 border-sky-500 text-white shadow-xs' 
                            : 'bg-gray-50 border-gray-100 text-sky-300'
                        }`}
                        title={`${index} ${lang === 'pt' ? 'Copos' : 'Cups'}`}
                      >
                        {/* Interactive dynamic wave visual */}
                        {isFilled && (
                          <span className="absolute bottom-0 inset-x-0 h-full bg-sky-400/30 animate-pulse pointer-events-none" />
                        )}
                        <Droplet className={`w-4 h-4 relative z-10 ${isFilled ? 'text-white' : 'text-sky-400'}`} />
                        <span className="text-[8px] font-black tracking-tight relative z-10 pointer-events-none">{index}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Progress helper */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="text-gray-400 font-bold">{lang === 'pt' ? 'Copos marcados:' : 'Logged cups:'}</span>
                  <span className="text-sky-700 font-black text-sm">{waterCups} / 8 ({waterCups * 250}ml/2000ml)</span>
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setWaterCups(prev => Math.max(0, prev - 1))}
                    disabled={waterCups === 0}
                    className="flex-1 py-1.5 rounded-lg border border-sky-100 text-sky-700 hover:bg-sky-50 text-[11px] font-bold disabled:opacity-50"
                  >
                    - 1 Copo (250ml)
                  </button>
                  <button 
                    onClick={() => setWaterCups(prev => Math.min(12, prev + 1))}
                    className="flex-1 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 text-[11px] font-bold"
                  >
                    + 1 Copo (250ml)
                  </button>
                </div>

                {waterCups >= 8 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-xs font-bold text-center"
                  >
                    🎉 {contentMap.waterDone}
                  </motion.div>
                )}
              </div>

            </motion.div>
          )}

          {/* TAB 3: GUIDELINES & SYMPTOMS */}
          {activeTab === 'balance' && (
            <motion.div
              key="balance-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              
              {/* Daily Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* TO ADD */}
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm text-left space-y-3.5">
                  <div className="flex items-center gap-2 text-green-700 font-black">
                    <Leaf className="w-5 h-5 text-green-500" />
                    <span className="text-xs uppercase tracking-wider">{contentMap.focusLabel}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-green-950 mb-1">{activeSuggestion?.focusName}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">{activeSuggestion?.details}</p>
                  </div>
                  <ul className="space-y-2 border-t border-gray-50 pt-3">
                    {activeSuggestion?.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                        <span className="text-green-500 font-black shrink-0 mt-0.5">✔</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TO AVOID */}
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm text-left space-y-3.5">
                  <div className="flex items-center gap-2 text-rose-700 font-black">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <span className="text-xs uppercase tracking-wider">{contentMap.avoidLabel}</span>
                  </div>
                  <ul className="space-y-2 pt-1 h-full flex flex-col justify-center">
                    {contentMap.avoidFoods?.[selectedPhase] ? (
                      contentMap.avoidFoods[selectedPhase].map((food: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>{food}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                        <span>{lang === 'pt' ? 'Doces refinados artificiais, café tardio estimulante, refrigerantes.' : 'Refined industrial sugar, late stimulants, carbonated drinks.'}</span>
                      </li>
                    )}
                  </ul>
                </div>

              </div>

              {/* Quick bio-sync symptom adaptor */}
              <div className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 text-left">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-gray-900">{contentMap.symptomLabel}</h3>
                  <p className="text-xs text-gray-400 font-bold leading-normal">{contentMap.symptomSub}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {([
                    { id: 'none', label: contentMap.sympNone, colorClass: 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100/50' },
                    { id: 'cramps', label: contentMap.sympCramps, colorClass: 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100/50' },
                    { id: 'headache', label: contentMap.sympHeadache, colorClass: 'bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-100/50' },
                    { id: 'bloating', label: contentMap.sympBloating, colorClass: 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100/50' }
                  ] as const).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSymptom(s.id)}
                      className={`py-2 px-3.5 rounded-xl border text-[11px] font-extrabold text-center transition-all ${
                        activeSymptom === s.id 
                          ? s.colorClass + ' ring-1 ring-offset-1 ring-gray-100' 
                          : 'bg-white border-gray-150 text-gray-600 hover:border-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {activeSymptom !== 'none' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-3"
                  >
                    <Info className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <span className="text-xs font-black text-rose-950 block">
                        {contentMap.symptomHeader} {
                          activeSymptom === 'cramps' ? contentMap.sympCramps : 
                          activeSymptom === 'headache' ? contentMap.sympHeadache : 
                          contentMap.sympBloating
                        }
                      </span>
                      <p className="text-[11.5px] text-rose-900 leading-relaxed font-semibold">
                        {activeSymptom === 'cramps' && contentMap.tipCramps}
                        {activeSymptom === 'headache' && contentMap.tipHeadache}
                        {activeSymptom === 'bloating' && contentMap.tipBloating}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
