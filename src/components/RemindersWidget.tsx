import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Clock, Trash2, Plus, Check, Volume2, Sparkles, X, Activity } from 'lucide-react';
import { t, Language } from '../lib/i18n';

interface ReminderItem {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
  type: 'water' | 'pill' | 'log' | 'meditate' | 'custom';
}

interface RemindersWidgetProps {
  lang: Language;
}

export default function RemindersWidget({ lang }: RemindersWidgetProps) {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [showAddForm, setShowAddForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('luna_user_reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        initializeDefaultReminders();
      }
    } else {
      initializeDefaultReminders();
    }
  }, []);

  const initializeDefaultReminders = () => {
    const defaults: ReminderItem[] = [
      {
        id: '1',
        title: lang === 'pt' ? '💊 Tomar Contraceção' : lang === 'es' ? '💊 Tomar anticonceptivo' : '💊 Take Contraceptive',
        time: '08:00',
        enabled: true,
        type: 'pill'
      },
      {
        id: '2',
        title: lang === 'pt' ? '💧 Hidratação Luna' : lang === 'es' ? '💧 Hidratación Luna' : '💧 Luna Hydration',
        time: '12:00',
        enabled: true,
        type: 'water'
      },
      {
        id: '3',
        title: lang === 'pt' ? '📝 Registar Sintomas' : lang === 'es' ? '📝 Registrar Síntomas' : '📝 Log Cycle Symptoms',
        time: '21:00',
        enabled: true,
        type: 'log'
      },
      {
        id: '4',
        title: lang === 'pt' ? '🧘‍♀️ Infusão Sincronizada' : lang === 'es' ? '🧘‍♀️ Infusión Sincronizada' : '🧘‍♀️ Bio-Aligned Tea',
        time: '16:00',
        enabled: false,
        type: 'meditate'
      }
    ];
    setReminders(defaults);
    localStorage.setItem('luna_user_reminders', JSON.stringify(defaults));
  };

  const saveToStorage = (updatedList: ReminderItem[]) => {
    setReminders(updatedList);
    localStorage.setItem('luna_user_reminders', JSON.stringify(updatedList));
  };

  const toggleReminder = (id: string) => {
    const list = reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    saveToStorage(list);
    
    // Quick notification demo when enabled
    const toggled = list.find(r => r.id === id);
    if (toggled && toggled.enabled) {
      triggerToast(
        lang === 'pt' 
          ? `Lembrete "${toggled.title.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '').trim()}" ativado para as ${toggled.time}!`
          : `Reminder updated for ${toggled.time}!`
      );
      playChime();
    }
  };

  const addCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ReminderItem = {
      id: Date.now().toString(),
      title: '🔔 ' + newTitle.trim(),
      time: newTime,
      enabled: true,
      type: 'custom'
    };

    const updated = [...reminders, newItem];
    saveToStorage(updated);
    setNewTitle('');
    setShowAddForm(false);
    
    triggerToast(
      lang === 'pt' 
        ? `Lembrete "${newTitle}" adicionado com sucesso!` 
        : `Custom reminder added for ${newTime}!`
    );
    playChime();
  };

  const deleteReminder = (id: string, name: string) => {
    const updated = reminders.filter(r => r.id !== id);
    saveToStorage(updated);
    triggerToast(
      lang === 'pt' 
        ? `Lembrete removido.` 
        : `Reminder deleted.`
    );
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const playChime = () => {
    // Beautiful pure synthetical sound using browser audio context - absolutely no external files needed!
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Ring sound consists of a warm minor chord transition
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gainNode.gain.setValueAtTime(0, start);
        gainNode.gain.linearRampToValueAtTime(0.12, start + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      const now = ctx.currentTime;
      playTone(523.25, now, 0.8); // C5
      playTone(659.25, now + 0.1, 0.8); // E5
      playTone(783.99, now + 0.2, 1.2); // G5
      playTone(1046.50, now + 0.3, 1.5); // C6
    } catch (e) {
      // Audio context block/unsupported
    }
  };

  const handleTestAlert = (reminder: ReminderItem) => {
    triggerToast(
      lang === 'pt' 
        ? `🔔 SIMULAÇÃO: "${reminder.title}" agora! São ${reminder.time}.` 
        : `🔔 TEST: "${reminder.title}" triggered at ${reminder.time}.`
    );
    playChime();
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-primary flex items-center justify-center shadow-xs">
            <Bell className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-extrabold text-gray-900 text-sm tracking-tight">
              {lang === 'pt' ? 'Lembretes Ativos' : lang === 'es' ? 'Recordatorios' : 'Daily Reminders'}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">
              {lang === 'pt' ? 'Sincronização Diária' : lang === 'es' ? 'Sincronización' : 'Schedules'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-8 h-8 rounded-lg bg-pink-50 hover:bg-pink-100/80 text-pink-primary flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title={lang === 'pt' ? 'Criar Lembrete' : lang === 'es' ? 'Crear Recordatorio' : 'Create Reminder'}
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Adding form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={addCustomReminder}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6 bg-pink-50/30 p-4 rounded-2xl border border-pink-100/30 space-y-3"
          >
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                {lang === 'pt' ? 'Título do Lembrete' : lang === 'es' ? 'Título del Recordatorio' : 'Reminder Title'}
              </label>
              <input
                type="text"
                placeholder={lang === 'pt' ? 'Ex: Tomar vitaminas, Treinar' : lang === 'es' ? 'Ej: Tomar vitaminas, Entrenar' : 'Ex: Take vitamins, Workout'}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={28}
                className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-pink-primary/50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                  {lang === 'pt' ? 'Hora' : lang === 'es' ? 'Hora' : 'Time'}
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-white border border-gray-150 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-pink-primary"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-pink-primary hover:bg-pink-mid text-white text-xs font-bold py-2 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {lang === 'pt' ? 'Adicionar' : lang === 'es' ? 'Añadir' : 'Add'}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
              reminder.enabled 
                ? 'bg-gradient-to-r from-white to-pink-50/5 border-pink-100/50' 
                : 'bg-gray-50/50 border-gray-100 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleReminder(reminder.id)}
                className={`w-9 h-6 rounded-full p-0.5 transition-all flex items-center ${
                  reminder.enabled ? 'bg-pink-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform transform ${
                  reminder.enabled ? 'translate-x-3' : 'translate-x-0'
                }`} />
              </button>

              <div className="text-left">
                <span className="text-[12px] font-bold text-gray-800 block leading-tight">{reminder.title}</span>
                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-pink-primary/60" />
                  {reminder.time}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {reminder.enabled && (
                <button
                  onClick={() => handleTestAlert(reminder)}
                  className="p-2 rounded-xl hover:bg-pink-50 text-gray-400 hover:text-pink-primary transition-all duration-200"
                  title={lang === 'pt' ? 'Testar som de notificação' : lang === 'es' ? 'Probar tono' : 'Test system tone'}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
              {reminder.type === 'custom' && (
                <button
                  onClick={() => deleteReminder(reminder.id, reminder.title)}
                  className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200"
                  title={lang === 'pt' ? 'Apagar Lembrete' : lang === 'es' ? 'Borrar Recordatorio' : 'Delete Reminder'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simulated real-time scheduler notification banner inside browser */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] bg-gray-900 border border-gray-850 px-5 py-4 rounded-3xl shadow-xl flex items-center gap-3 max-w-sm text-left relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-primary via-purple-500 to-orange-400" />
            <div className="w-8 h-8 rounded-xl bg-pink-primary/20 text-pink-primary flex items-center justify-center shrink-0">
              <Activity className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-black text-pink-primary uppercase tracking-wider block">Luna Alertas & Saúde</span>
              <p className="text-xs text-white font-semibold mt-0.5 leading-tight">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
