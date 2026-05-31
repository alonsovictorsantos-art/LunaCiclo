import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, Star, Calendar, Heart } from 'lucide-react';
import Logo from './Logo';
import { UserProfile } from '../types';

import { t, Language } from '../lib/i18n';

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [language, setLanguage] = useState<Language>('pt');
  const [dietPreference, setDietPreference] = useState<'omnivore' | 'vegetarian' | 'vegan'>('omnivore');

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else onComplete({ age: parseInt(age) || 25, cycleLength, periodLength, language, dietPreference });
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-pink-light/50 via-white to-purple-50">
      <div className="w-full max-w-lg">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-10 bg-pink-primary' : 'w-4 bg-gray-100'}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white p-8 md:p-12 rounded-[32px] shadow-2xl shadow-pink-primary/5 border border-gray-50"
          >
            {step === 1 && (
              <div className="text-center">
                <div className="flex justify-center mb-8 gap-4">
                  <Logo size="xl" showText={false} className="justify-center" />
                  <div className="flex items-center gap-2">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-2 py-1 text-[10px] font-bold outline-none"
                    >
                      <option value="pt">PT</option>
                      <option value="en">EN</option>
                      <option value="es">ES</option>
                    </select>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">{t('onboardingTitle', language)}</h2>
                <p className="text-gray-500 mb-10 text-sm leading-relaxed">{t('onboardingSub1', language)}</p>
                <div className="relative max-w-[200px] mx-auto">
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-full text-center text-4xl font-bold py-6 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-pink-primary/10 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-semibold">{t('years', language)}</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-8 shadow-inner">📅</div>
                <h2 className="text-2xl font-bold mb-4">{t('cycleLength', language)}</h2>
                <p className="text-gray-500 mb-10 text-sm leading-relaxed">{t('onboardingSub2', language)}</p>
                
                <div className="space-y-6">
                   <div className="flex justify-between text-pink-primary font-bold text-3xl mb-2 px-4">
                     <span>{cycleLength} {t('days', language)}</span>
                   </div>
                   <input 
                    type="range" 
                    min="21" 
                    max="45" 
                    value={cycleLength}
                    onChange={(e) => setCycleLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-pink-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                    <span>21 {t('days', language)} ({t('short', language)})</span>
                    <span>45 {t('days', language)} ({t('long', language)})</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-light rounded-full flex items-center justify-center text-3xl mx-auto mb-8 shadow-inner">🩸</div>
                <h2 className="text-2xl font-bold mb-4">{t('periodLength', language)}</h2>
                <p className="text-gray-500 mb-10 text-sm leading-relaxed">{t('onboardingSub3', language)}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {[3, 4, 5, 6, 7, 8].map((d) => (
                    <button
                      key={d}
                      onClick={() => setPeriodLength(d)}
                      className={`py-4 rounded-2xl text-lg font-bold border-2 transition-all ${
                        periodLength === d 
                          ? 'bg-pink-primary text-white border-pink-primary shadow-lg shadow-pink-primary/20 scale-105' 
                          : 'bg-white text-gray-500 border-gray-100 hover:border-pink-primary/30'
                      }`}
                    >
                      {d} {t('days', language)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-8 shadow-inner">🥗</div>
                <h2 className="text-2xl font-bold mb-4">{t('dietPreferenceTitle', language)}</h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">{t('onboardingSub4', language)}</p>
                
                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                  {([
                    { id: 'omnivore', label: t('dietOmniLabel', language) },
                    { id: 'vegetarian', label: t('dietVegLabel', language) },
                    { id: 'vegan', label: t('dietVeganLabel', language) }
                  ] as const).map((d) => {
                    const isSelected = dietPreference === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setDietPreference(d.id)}
                        className={`py-4 px-6 rounded-2xl text-md font-bold border-2 transition-all text-left flex items-center justify-between active:scale-[0.98] ${
                          isSelected 
                            ? 'bg-pink-primary text-white border-pink-primary shadow-lg shadow-pink-primary/10' 
                            : 'bg-white text-gray-600 border-gray-100 hover:border-pink-primary/30'
                        }`}
                      >
                        <span>{d.label}</span>
                        {isSelected && (
                          <span className="text-white text-lg font-bold">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-12">
              {step > 1 && (
                <button 
                  onClick={prevStep}
                  className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-100 font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> {t('back', language)}
                </button>
              )}
              <button 
                onClick={nextStep}
                className="flex-[2] bg-pink-primary text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-xl shadow-pink-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {step === 4 ? t('startJourney', language) : t('continue', language)} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <button 
          onClick={() => onComplete({ age: 25, cycleLength: 28, periodLength: 5, language, dietPreference: 'omnivore' })}
          className="w-full text-center mt-6 text-gray-300 text-xs font-semibold hover:text-gray-400 transition-colors"
        >
          {t('skipOnboarding', language)}
        </button>
      </div>
    </div>
  );
}
