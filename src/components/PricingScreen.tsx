/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Loader2, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Star, 
  Lock, 
  Heart, 
  Dumbbell, 
  Utensils 
} from 'lucide-react';

import { checkoutPro } from '../lib/stripe';
import { User } from '../types';
import { t, Language } from '../lib/i18n';

interface PricingScreenProps {
  onUpgrade: () => void;
  onBack: () => void;
  user: User;
  lang: Language;
}

export default function PricingScreen({ onUpgrade, onBack, user, lang }: PricingScreenProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handlePayment = async (planType: 'luna_pro_monthly' | 'luna_pro_yearly') => {
    setIsProcessing(planType);
    await checkoutPro(user.id, user.email, planType);
    setIsProcessing(null);
  };

  const textContent = {
    pt: {
      subtitle: "Inscreva-se hoje para tomar o controlo soberano sobre o seu corpo, energia, foco e rotina de autocuidado.",
      whyPremium: "Porquê escolher o plano Premium?",
      guarantee: "Privacidade absoluta garantida • Dados encriptados de ponta a ponta e nunca partilhados.",
      securePayment: "Transação encriptada com segurança bancária SSL via Stripe",
      equivalent: "equivalente a apenas",
      saveBadge: "POUPE 87%",
      bestValue: "MELHOR VALOR",
      mostPopular: "MAIS RECOMENDADO",
      limitWarning: "Apenas 1 mês de nutrição & receitas",
      limitedAssistant: "Acesso muito limitado",
      unlimitedNutrition: "Nutrição e Dietas Ilimitadas",
      customWorkouts: "Treinos Inteligentes Inteligentes",
      aiDeeperInsights: "Análise profunda por Gemini AI",
      unlimitedLuna: "Assistente Luna AI Sem Limites",
      exportPDF: "Exportação de PDFs de Diagnóstico",
      partnerSecure: "Sincronização com Parceiro(a)",
      alwaysCloud: "Nuvem Segura e Global",
      essentialCycle: "Monitorização básica do ciclo",
      activeLabel: "O Seu Plano Atual ESSENCIAL"
    },
    es: {
      subtitle: "Inscríbete hoy para tomar el control supremo sobre tu cuerpo, energía, enfoque y rutina de autocuidado.",
      whyPremium: "¿Por qué elegir el plan Premium?",
      guarantee: "Privacidad absoluta garantizada • Datos cifrados de extremo a extremo y nunca compartidos.",
      securePayment: "Transacción cifrada con seguridad bancaria SSL vía Stripe",
      equivalent: "equivalente a solo",
      saveBadge: "AHORRA 87%",
      bestValue: "MEJOR VALOR",
      mostPopular: "MÁS RECOMENDADO",
      limitWarning: "Solo 1 mes de nutrición y recetas",
      limitedAssistant: "Acceso muy limitado",
      unlimitedNutrition: "Nutrición y Menús Ilimitados",
      customWorkouts: "Entrenamientos Inteligentes",
      aiDeeperInsights: "Análisis profundo con Gemini AI",
      unlimitedLuna: "Asistente Luna AI Sin Límites",
      exportPDF: "Exportar diagnósticos en PDF",
      partnerSecure: "Sincronización con tu Pareja",
      alwaysCloud: "Nube Global Ultrasegura",
      essentialCycle: "Monitoreo básico de ciclo",
      activeLabel: "Tu Plan Actual ESSENCIAL"
    },
    en: {
      subtitle: "Subscribe today to take supreme control over your biological clock, nutrition, training, and holistic health.",
      whyPremium: "Why go Premium?",
      guarantee: "Absolute privacy guaranteed • End-to-end encrypted data, never shared.",
      securePayment: "SSL-encrypted secure checkout powered by Stripe",
      equivalent: "equivalent to just",
      saveBadge: "SAVE 87%",
      bestValue: "BEST VALUE",
      mostPopular: "RECOMMENDED",
      limitWarning: "1 month limit of nutrition & plans",
      limitedAssistant: "Highly limited access",
      unlimitedNutrition: "Unlimited Nutrition & Recipes",
      customWorkouts: "Tailored Cycle Workouts",
      aiDeeperInsights: "Deep Health Insights by Gemini",
      unlimitedLuna: "Ask Luna AI Unlimited Questions",
      exportPDF: "PDF Health Diagnostic Exports",
      partnerSecure: "Secure Synced Partner Access",
      alwaysCloud: "Secure Automated Cloud Backups",
      essentialCycle: "Essential Cycle Predictions",
      activeLabel: "Your Active Basic Plan"
    }
  };

  const localized = textContent[lang] || textContent['pt'];

  const freeList = [
    { icon: Heart, text: localized.essentialCycle, active: true },
    { icon: Utensils, text: localized.limitWarning, active: false, alert: true },
    { icon: Heart, text: localized.partnerSecure, active: true },
    { icon: Zap, text: localized.alwaysCloud, active: true },
    { icon: ShieldCheck, text: localized.exportPDF, active: true },
    { icon: Star, text: localized.unlimitedLuna, active: true }
  ];

  const premiumSharedList = [
    { icon: Utensils, text: localized.unlimitedNutrition, color: "text-amber-500 bg-amber-50" },
    { icon: Dumbbell, text: localized.customWorkouts, color: "text-blue-500 bg-blue-50" },
    { icon: Sparkles, text: localized.aiDeeperInsights, color: "text-purple-500 bg-purple-50" },
    { icon: Star, text: localized.unlimitedLuna, color: "text-pink-primary bg-pink-light" },
    { icon: ShieldCheck, text: localized.exportPDF, color: "text-green-500 bg-green-50" },
    { icon: Heart, text: localized.partnerSecure, color: "text-rose-500 bg-rose-50" },
    { icon: Zap, text: localized.alwaysCloud, color: "text-cyan-500 bg-cyan-50" }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 transition-colors">
      
      {/* Back Header */}
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-pink-primary transition-all text-sm font-bold bg-white px-4 py-2.5 rounded-full shadow-sm hover:shadow-md border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4 font-black" /> {t('back', lang)}
        </button>

        <div className="bg-gradient-to-r from-pink-primary to-rose-400 text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-sm">
          🌟 VIP STATUS ACCESS
        </div>
      </div>

      {/* Persuasive Heading */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-gray-950 mb-4 tracking-tight leading-none">
          Luna <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-primary via-rose-500 to-amber-500">Premium Pro</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          {localized.subtitle}
        </p>
      </div>

      {/* Subscription Grid - 3 Beautiful Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
        
        {/* Card 1: Free Plan */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-200/80 flex flex-col justify-between transition-all hover:border-gray-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 h-2 bg-gray-200 w-full" />
          
          <div>
            <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 bg-gray-100 px-3 py-1 rounded-full inline-block mb-4">
              {lang === 'pt' ? 'Gratuito' : lang === 'es' ? 'Gratis' : 'Free'}
            </span>
            <h3 className="text-2xl font-black text-gray-900 mb-1">{t('freePlan', lang)}</h3>
            <p className="text-xs text-gray-400 font-semibold mb-6">
              {lang === 'pt' ? 'Apenas o essencial' : lang === 'es' ? 'Solo lo esencial' : 'Just the essentials'}
            </p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4.5xl font-black text-gray-950">$0</span>
              <span className="text-gray-400 text-xs font-bold">/{t('always', lang)}</span>
            </div>

            <hr className="border-gray-100 mb-8" />

            <ul className="space-y-4 mb-8">
              {freeList.map((f, i) => {
                const IconComp = f.icon;
                return (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-bold text-left">
                    <span className={`p-1.5 rounded-lg shrink-0 ${f.alert ? 'bg-amber-50 text-amber-500 animate-pulse' : 'bg-green-50 text-green-600'}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                    <span className="leading-tight">{f.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-6">
            <button 
              disabled 
              className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 font-bold text-xs uppercase tracking-wider cursor-default text-center"
            >
              ✓ {localized.activeLabel}
            </button>
          </div>
        </div>

        {/* Card 2: Premium Monthly */}
        <div className="bg-white p-8 rounded-[40px] border border-gray-200 flex flex-col justify-between transition-all hover:border-pink-200 focus-within:ring-2 focus-within:ring-pink-primary relative group shadow-sm hover:shadow-xl hover:shadow-gray-100">
          <div className="absolute top-0 right-0 h-2 bg-pink-300 w-full" />

          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-pink-500 bg-pink-50 px-3 py-1 rounded-full inline-block mb-4">
              {lang === 'pt' ? 'PRO MENSAL' : lang === 'es' ? 'PRO MENSUAL' : 'MONTHLY PRO'}
            </span>
            <h3 className="text-2xl font-extrabold text-gray-950 tracking-tight mb-1">
              {lang === 'pt' ? 'Premium Mensal' : lang === 'es' ? 'Premium Mensal' : 'Monthly Premium'}
            </h3>
            <p className="text-xs text-gray-400 font-semibold mb-6">
              {lang === 'pt' ? 'Flexibilidade de pagamento mensal' : lang === 'es' ? 'Flexibilidad mensual' : 'Flexible monthly access'}
            </p>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4.5xl font-black text-gray-950 tracking-tight">$12.99</span>
              <span className="text-gray-400 text-xs font-bold">/{t('month', lang)}</span>
            </div>

            <hr className="border-gray-100 mb-8" />

            <ul className="space-y-4 mb-8">
              {premiumSharedList.map((f, i) => {
                const IconComp = f.icon;
                return (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-bold text-left leading-normal">
                    <span className={`p-1 rounded-lg shrink-0 ${f.color}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                    <span className="leading-tight">{f.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => handlePayment('luna_pro_monthly')}
              disabled={isProcessing !== null}
              className="w-full py-4 rounded-2xl bg-gray-950 text-white hover:bg-gray-900 active:scale-[0.98] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
            >
              {isProcessing === 'luna_pro_monthly' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {t('processing', lang)}</>
              ) : (
                lang === 'pt' ? 'Adquirir Mensal' : lang === 'es' ? 'Adquirir Mensal' : 'Get Monthly Pro'
              )}
            </button>
            <p className="text-[10px] text-gray-400 font-bold mt-3 text-center uppercase tracking-widest">{t('secureCheckoutStripe', lang)}</p>
          </div>
        </div>

        {/* Card 3: Premium Annual (BEST VALUE) - Exquisite Elite Visual Treatment */}
        <div className="bg-white p-8 rounded-[40px] border-2 border-pink-primary flex flex-col justify-between transition-all hover:border-pink-300 focus-within:ring-2 focus-within:ring-pink-primary relative group shadow-md hover:shadow-2xl hover:shadow-pink-100/40 hover:scale-[1.02] duration-300">
          <div className="absolute top-0 right-0 h-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 w-full" />
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black tracking-widest uppercase text-white bg-gradient-to-r from-pink-500 to-amber-500 px-3.5 py-1.5 rounded-full inline-block shadow-md">
                ★ {localized.bestValue}
              </span>
            </div>
            
            <h3 className="text-3xl font-extrabold text-gray-950 tracking-tight mb-2">
              {lang === 'pt' ? 'Premium Anual' : lang === 'es' ? 'Premium Anual' : 'Annual Premium'}
            </h3>
            <p className="text-xs text-gray-500 font-bold leading-normal mb-6">
              {lang === 'pt' ? 'O plano definitivo para a sua saúde e nutrição.' : lang === 'es' ? 'El plan definitivo para tu salud y nutrición.' : 'The ultimate plan for your health and nutrition.'}
            </p>

            <div className="mb-6 flex flex-col">
              <span className="text-[10px] font-bold text-pink-primary uppercase tracking-widest mb-1.5">
                {lang === 'pt' ? 'OTIMIZAÇÃO COMPLETA' : lang === 'es' ? 'OPTIMIZACIÓN COMPLETA' : 'COMPLETE HEALTH OPTIMIZATION'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-6.5xl font-black text-gray-950 tracking-tighter leading-none">$19.99</span>
                <span className="text-gray-400 text-sm font-bold">/{t('year', lang)}</span>
              </div>
            </div>

            <hr className="border-gray-150 mb-7" />

            <ul className="space-y-4 mb-8">
              {premiumSharedList.map((f, i) => {
                const IconComp = f.icon;
                return (
                  <li key={i} className="flex items-start gap-3 text-[13.5px] text-gray-800 font-extrabold text-left tracking-tight leading-normal">
                    <span className="p-1 rounded-lg shrink-0 bg-pink-light text-pink-primary shadow-xs">
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                    <span className="leading-tight">{f.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => handlePayment('luna_pro_yearly')}
              disabled={isProcessing !== null}
              className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-pink-primary via-rose-500 to-amber-500 text-white font-black text-sm uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-pink-500/20"
            >
              {isProcessing === 'luna_pro_yearly' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {t('processing', lang)}</>
              ) : (
                <>
                  <Flame className="w-4.5 h-4.5 text-amber-300 fill-amber-300 inline animate-bounce" /> 
                  <span className="font-extrabold tracking-wide">
                    {lang === 'pt' ? 'Ativar Plano Anual' : lang === 'es' ? 'Activar Plan Anual' : 'Activate Yearly Pro'}
                  </span>
                </>
              )}
            </button>
            <p className="text-[10px] text-gray-400 font-bold mt-3.5 text-center uppercase tracking-widest">{t('secureCheckoutStripe', lang)}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
