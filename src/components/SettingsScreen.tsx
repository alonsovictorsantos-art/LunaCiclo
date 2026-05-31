import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Calendar, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronLeft, 
  Moon, 
  Sun,
  Save,
  Trash2,
  Heart,
  Info,
  Clock,
  Globe
} from 'lucide-react';
import { User, UserProfile, CycleLog } from '../types';
import HistoryBoard from './HistoryBoard';

interface SettingsScreenProps {
  user: User;
  profile: UserProfile;
  logs: CycleLog[];
  onDeleteLog: (id: string) => Promise<void>;
  onUpdateUser: (userData: Partial<User>, profileData: Partial<UserProfile>) => Promise<void>;
  onLogout: () => void;
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

import { t, Language as LangType } from '../lib/i18n';

export default function SettingsScreen({ 
  user, 
  profile, 
  logs,
  onDeleteLog,
  onUpdateUser, 
  onLogout, 
  onBack,
  isDarkMode,
  onToggleTheme
}: SettingsScreenProps) {
  const lang: LangType = profile.language || 'pt';
  const [activeTab, setActiveTab] = useState<'general' | 'history'>('general');
  const [name, setName] = useState(user.name);
  const [nickname, setNickname] = useState(user.nickname || '');
  const [cycleLength, setCycleLength] = useState(profile.cycleLength);
  const [periodLength, setPeriodLength] = useState(profile.periodLength);
  const [language, setLanguage] = useState<LangType>(profile.language || 'pt');
  
  const [notifCycle, setNotifCycle] = useState(profile.notifications?.cycleStart || { enabled: true, daysBefore: 1, time: '09:00' });
  const [notifOvulation, setNotifOvulation] = useState(profile.notifications?.ovulation || { enabled: true, daysBefore: 0, time: '10:00' });
  const [notifFertile, setNotifFertile] = useState(profile.notifications?.fertileWindow || { enabled: true, daysBefore: 1, time: '09:00' });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await onUpdateUser(
        { name, nickname },
        { 
          cycleLength, 
          periodLength,
          language,
          notifications: {
            cycleStart: notifCycle,
            ovulation: notifOvulation,
            fertileWindow: notifFertile
          }
        }
      );
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const NotificationRow = ({ title, desc, config, onChange }: { 
    title: string, 
    desc: string, 
    config: { enabled: boolean; daysBefore: number; time: string },
    onChange: (cfg: any) => void 
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-pink-100 transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-sm font-bold text-gray-900 tracking-tight">{title}</p>
          {!config.enabled && <span className="text-[8px] font-black bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full uppercase">{t('disabled', lang)}</span>}
        </div>
        <p className="text-xs text-gray-400 font-medium">{desc}</p>
      </div>
      
      <div className="flex items-center gap-4">
        {config.enabled && (
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-50">
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black text-gray-300 uppercase tracking-widest px-1">{t('daysBefore', lang)}</label>
              <select 
                value={config.daysBefore}
                onChange={(e) => onChange({ ...config, daysBefore: parseInt(e.target.value) })}
                className="bg-transparent text-[10px] font-bold outline-none px-1"
              >
                <option value={0}>{t('onTheDay', lang)}</option>
                <option value={1}>{t('oneDayBefore', lang)}</option>
                <option value={2}>{t('twoDaysBefore', lang)}</option>
                <option value={3}>{t('threeDaysBefore', lang)}</option>
              </select>
            </div>
            <div className="w-px h-6 bg-gray-100" />
            <div className="flex flex-col gap-1">
              <label className="text-[8px] font-black text-gray-300 uppercase tracking-widest px-1">{t('time', lang)}</label>
              <input 
                type="time" 
                value={config.time}
                onChange={(e) => onChange({ ...config, time: e.target.value })}
                className="bg-transparent text-[10px] font-bold outline-none px-1"
              />
            </div>
          </div>
        )}
        <button 
          onClick={() => onChange({ ...config, enabled: !config.enabled })}
          className={`w-12 h-6 rounded-full p-1 transition-colors ${config.enabled ? 'bg-pink-primary' : 'bg-gray-200'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.enabled ? 'translate-x-6' : ''}`} />
        </button>
      </div>
    </div>
  );

  const Section = ({ title, icon: Icon, children, fullWidth = false }: { title: string, icon: any, children: React.ReactNode, fullWidth?: boolean }) => (
    <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-pink-light text-pink-primary flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 tracking-tight uppercase italic">{title}</h3>
      </div>
      <div className={`grid grid-cols-1 ${fullWidth ? '' : 'md:grid-cols-2'} gap-6`}>
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", min, max }: any) => (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
        min={min}
        max={max}
        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold outline-none focus:ring-4 focus:ring-pink-primary/5 transition-all"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-pink-primary hover:border-pink-100 transition-all shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t('settings', lang)} ⚙️</h2>
            <p className="text-gray-400 text-sm font-medium">{t('personalizeExperience', lang)}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            saveStatus === 'success' 
              ? 'bg-teal-500 text-white' 
              : 'bg-gray-900 text-white hover:bg-black'
          }`}
        >
          {isSaving ? t('saving', lang) : saveStatus === 'success' ? t('saved', lang) : (
            <><Save className="w-4 h-4" /> {t('saveChanges', lang)}</>
          )}
        </button>
      </header>

      {/* Tabs Selector for Settings vs History */}
      <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-xs max-w-md">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-3 px-4 font-bold text-xs rounded-xl transition-all uppercase tracking-wider text-center ${
            activeTab === 'general'
              ? 'bg-pink-primary text-white shadow-sm'
              : 'text-gray-500 hover:text-pink-primary hover:bg-pink-50/50'
          }`}
        >
          ⚙️ {lang === 'pt' ? 'Configurações' : lang === 'es' ? 'Ajustes' : 'Config'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-4 font-bold text-xs rounded-xl transition-all uppercase tracking-wider text-center ${
            activeTab === 'history'
              ? 'bg-pink-primary text-white shadow-sm'
              : 'text-gray-500 hover:text-pink-primary hover:bg-pink-50/50'
          }`}
        >
          📅 {lang === 'pt' ? 'Histórico do Ciclo' : lang === 'es' ? 'Historial de Ciclos' : 'Cycle History'}
        </button>
      </div>

      {activeTab === 'general' ? (
        <div className="grid grid-cols-1 gap-8">
        <Section title={t('account', lang)} icon={UserIcon}>
          <InputField label={t('fullName', lang)} value={name} onChange={setName} />
          <InputField label={t('nicknameOptional', lang)} value={nickname} onChange={setNickname} />
          <div className="flex flex-col gap-2 opacity-50 cursor-not-allowed">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('emailNotChangeable', lang)}</label>
            <div className="w-full bg-gray-100 border-none rounded-2xl py-4 px-6 text-sm font-semibold text-gray-500">
              {user.email}
            </div>
          </div>
          <div className="flex flex-col gap-2 opacity-50 cursor-not-allowed">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('currentPlan', lang)}</label>
            <div className="w-full bg-gray-100 border-none rounded-2xl py-4 px-6 text-sm font-semibold text-pink-primary uppercase tracking-tighter">
              Luna {user.plan === 'premium' ? 'Premium Pro' : (lang === 'pt' ? 'Grátis' : lang === 'es' ? 'Gratuito' : 'Free')}
            </div>
          </div>
        </Section>

        <Section title={t('fertility', lang)} icon={Calendar}>
          <InputField label={t('cycleLength', lang)} type="number" min={21} max={45} value={cycleLength} onChange={setCycleLength} />
          <InputField label={t('periodLength', lang)} type="number" min={2} max={10} value={periodLength} onChange={setPeriodLength} />
        </Section>

        <Section title={t('notifications', lang)} icon={Bell} fullWidth>
          <div className="space-y-6 col-span-1">
            <NotificationRow 
              title={t('cycleStartNotif', lang)} 
              desc={t('cycleStartNotifDesc', lang)}
              config={notifCycle}
              onChange={setNotifCycle}
            />
            <div className="h-px bg-gray-50 mx-4" />
            <NotificationRow 
              title={t('ovulationNotif', lang)} 
              desc={t('ovulationNotifDesc', lang)}
              config={notifOvulation}
              onChange={setNotifOvulation}
            />
            <div className="h-px bg-gray-50 mx-4" />
            <NotificationRow 
              title={t('fertileWindowNotif', lang)} 
              desc={t('fertileWindowNotifDesc', lang)}
              config={notifFertile}
              onChange={setNotifFertile}
            />
          </div>
        </Section>

        <Section title={t('preferences', lang)} icon={Clock}>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
              <div>
                <p className="text-sm font-bold text-gray-900">{t('darkMode', lang)}</p>
                <p className="text-[10px] text-gray-400 font-medium">{t('toggleVisualInterface', lang)}</p>
              </div>
            </div>
            <button 
              onClick={onToggleTheme}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </Section>

        <Section title={t('language', lang)} icon={Globe}>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl w-full col-span-2">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-teal-500" />
              <div>
                <p className="text-sm font-bold text-gray-900">{t('language', lang)}</p>
                <p className="text-[10px] text-gray-400 font-medium">{t('choosePreferredLanguage', lang)}</p>
              </div>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-white border border-gray-100 rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-teal-100 transition-all"
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </Section>

        <Section title={t('aboutUs', lang)} icon={Heart}>
          <div className="col-span-1 md:col-span-2 space-y-4">
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              {t('aboutUsText', lang)}
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-4 h-4 text-pink-primary" />
                <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{t('commitmentTitle', lang)}</p>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                {t('commitmentText', lang)}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{t('version', lang)} 2.4.0 (Build 992)</p>
              <button className="text-[10px] font-bold text-pink-primary uppercase tracking-widest hover:underline">{t('termsPrivacy', lang)}</button>
            </div>
          </div>
        </Section>

        <Section title={t('security', lang)} icon={Shield}>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl col-span-1 md:col-span-2">
            <div>
              <p className="text-sm font-bold text-gray-900">{t('deleteData', lang)}</p>
              <p className="text-[10px] text-gray-400 font-medium">{t('irreversibleAction', lang)}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">
              <Trash2 className="w-3 h-3" /> {t('deleteData', lang)}
            </button>
          </div>
        </Section>

        <div className="pt-8 flex justify-center">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-10 py-5 rounded-[24px] bg-red-50 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" /> {t('logout', lang)}
          </button>
        </div>
      </div>
      ) : (
        <HistoryBoard logs={logs} onDelete={onDeleteLog} lang={lang} />
      )}
    </div>
  );
}
