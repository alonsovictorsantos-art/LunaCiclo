import React, { useState } from 'react';
import { 
  Save, 
  Droplets, 
  Thermometer, 
  Moon, 
  Coffee
} from 'lucide-react';
import { CycleLog } from '../types';
import { t, Language } from '../lib/i18n';

interface LogEntryProps {
  onSave: (log: CycleLog) => void;
  lang: Language;
}

const MOODS = (lang: Language) => [
  { icon: '😊', label: t('moodOptima', lang) },
  { icon: '😐', label: t('moodBem', lang) },
  { icon: '😔', label: t('moodTriste', lang) },
  { icon: '😤', label: t('moodIrritada', lang) },
  { icon: '😰', label: t('moodAnsiosa', lang) },
];

const SYMPTOMS_LIST = (lang: Language) => [
  { icon: '🩸', label: t('sympColica', lang) },
  { icon: '🤕', label: t('sympDorCabeca', lang) },
  { icon: '😴', label: t('sympCansaco', lang) },
  { icon: '🤢', label: t('sympNausea', lang) },
  { icon: '🌡️', label: t('sympInchaco', lang) },
  { icon: '💧', label: t('sympCorrimento', lang) },
  { icon: '🫀', label: t('sympSeios', lang) },
  { icon: '⚡', label: t('sympEnergia', lang) },
  { icon: '💤', label: t('sympInsonia', lang) },
];

export default function LogEntry({ onSave, lang }: LogEntryProps) {
  const currentMoods = MOODS(lang);
  const currentSymptoms = SYMPTOMS_LIST(lang);
  
  const [mood, setMood] = useState(t('moodBem', lang));
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(1);
  const [notes, setNotes] = useState('');
  const [water, setWater] = useState(6);
  const [sleep, setSleep] = useState(7);
  const [flow, setFlow] = useState<'none' | 'light' | 'medium' | 'heavy'>('none');
  const [selectedProducts, setSelectedProducts] = useState<('pad' | 'tampon' | 'cup' | 'disc')[]>([]);
  const [temp, setTemp] = useState(36.6);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const toggleProduct = (p: 'pad' | 'tampon' | 'cup' | 'disc') => {
    setSelectedProducts(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const handleSave = () => {
    const log: CycleLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      title: notes.slice(0, 30) || (lang === 'pt' ? 'Registo diário' : lang === 'en' ? 'Daily log' : 'Registro diario'),
      mood,
      symptoms: selectedSymptoms,
      intensity,
      notes,
      water,
      sleep,
      flow,
      products: selectedProducts,
      temperature: temp
    };
    onSave(log);
  };

  return (
    <div className="space-y-6 pb-10 transition-colors">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">{t('dailyLogTitle', lang)}</h2>
        <p className="text-gray-400 text-sm">{new Date().toLocaleDateString(lang === 'pt' ? 'pt-PT' : lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long' })}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          {/* Mood Section */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="font-bold text-lg mb-6 text-gray-800">{t('howFeeling', lang)}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {currentMoods.map(m => {
            const isSelected = mood === m.label;
            return (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all border-2 ${
                  isSelected 
                    ? `bg-indigo-50 border-indigo-200 shadow-sm` 
                    : `bg-white border-gray-100 hover:border-gray-200`
                }`}
              >
                <span className="text-3xl">{m.icon}</span>
                <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Symptoms Section */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <h3 className="font-bold text-lg mb-6 text-gray-800">{t('symptoms', lang)}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currentSymptoms.map(s => {
            const isSelected = selectedSymptoms.includes(s.label);
            return (
              <button
                key={s.label}
                onClick={() => toggleSymptom(s.label)}
                className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl transition-all border-2 ${
                  isSelected 
                    ? 'bg-pink-50 border-pink-100' 
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                <span className="text-3xl mb-3">{s.icon}</span>
                <span className={`text-sm font-semibold ${isSelected ? 'text-pink-900 font-bold' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-50">
           <p className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider font-bold">{t('intensity', lang)}</p>
           <div className="flex items-center gap-6">
              <span className="text-xs font-bold text-gray-400">{t('light', lang)}</span>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onClick={() => setIntensity(i)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      intensity >= i 
                        ? 'bg-pink-primary border-pink-primary shadow-sm' 
                        : 'bg-white border-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400">{t('intense', lang)}</span>
           </div>
        </div>
      </div>

        </div>

        <div className="space-y-6">
          {/* Daily Logs Inputs */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-900 leading-none mb-1">{t('period', lang)}</p>
            <div className="grid grid-cols-4 gap-2">
               {['none', 'light', 'medium', 'heavy'].map((f) => (
                 <button 
                  key={f}
                  onClick={() => setFlow(f as any)}
                  className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${flow === f ? 'bg-pink-primary text-white border-pink-primary' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                 >
                   {f === 'none' ? t('none', lang) : f === 'light' ? t('light', lang) : f === 'medium' ? (lang === 'pt' ? 'Méd.' : 'Med.') : t('heavy', lang)}
                 </button>
               ))}
            </div>
            
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">{t('products', lang)}</p>
            <div className="flex flex-wrap gap-2">
                {[
                  { id: 'pad', label: lang === 'pt' ? 'Penso' : lang === 'en' ? 'Pad' : 'Compresa' },
                  { id: 'tampon', label: lang === 'pt' ? 'Tampão' : lang === 'en' ? 'Tampon' : 'Tampón' },
                  { id: 'cup', label: lang === 'pt' ? 'Copo' : lang === 'en' ? 'Cup' : 'Copa' },
                  { id: 'disc', label: lang === 'pt' ? 'Disco' : lang === 'en' ? 'Disc' : 'Disco' }
                ].map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => toggleProduct(p.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${selectedProducts.includes(p.id as any) ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                  >
                    {p.label}
                  </button>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 leading-none mb-1">{t('temperature', lang)}</p>
                <p className="text-[10px] text-gray-400 font-medium">{t('morningBasal', lang)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <input 
                type="number" 
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-16 bg-gray-50 border-none rounded-xl py-2 px-3 text-sm font-bold text-right focus:ring-2 focus:ring-blue-100 outline-none"
               />
               <span className="text-xs font-bold text-gray-300">°C</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
             <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                   <Coffee className="w-4 h-4 text-blue-500" />
                   <span className="text-[10px] font-bold text-gray-400 uppercase">{t('water', lang)}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                   <button onClick={() => setWater(Math.max(0, water - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-pink-primary transition-colors hover:bg-gray-950">-</button>
                   <span className="text-xl text-gray-800">{water}</span>
                   <button onClick={() => setWater(water + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-pink-primary transition-colors hover:bg-gray-950">+</button>
                </div>
             </div>
             <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                   <Moon className="w-4 h-4 text-purple-500" />
                   <span className="text-[10px] font-bold text-gray-400 uppercase">{t('sleep', lang)}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                   <button onClick={() => setSleep(Math.max(0, sleep - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-pink-primary transition-colors hover:bg-gray-950">-</button>
                   <span className="text-xl text-gray-800">{sleep}</span>
                   <button onClick={() => setSleep(sleep + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-pink-primary transition-colors hover:bg-gray-950">+</button>
                </div>
             </div>
          </div>

          {/* Notes Section Integrated into Col 2 */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col flex-1 min-h-[250px]">
             <h3 className="font-bold mb-4 text-sm text-gray-900">{t('dayNotes', lang)}</h3>
             <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('dayNotesPlaceholder', lang)}
              className="w-full flex-1 bg-gray-50 rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-pink-light transition-all resize-none border-none mb-6"
             />
             <button 
              onClick={handleSave}
              className="w-full bg-pink-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-pink-primary/20 hover:opacity-90 active:scale-95 transition-all"
             >
                <Save className="w-5 h-5" /> {t('saveLogEmoji', lang)}
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
