/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MessageSquare, 
  Users, 
  History as HistoryIcon, 
  PlusCircle, 
  Sparkles,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Settings,
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Apple,
  Dumbbell,
} from 'lucide-react';
import { User, CycleLog, UserProfile, STORAGE_KEYS } from './types';
import AuthScreen from './components/AuthScreen';
import OnboardingScreen from './components/OnboardingScreen';
import Dashboard from './components/Dashboard';
import LogEntry from './components/LogEntry';
import FertilityBoard from './components/FertilityBoard';
import HistoryBoard from './components/HistoryBoard';
import PartnerView from './components/PartnerView';
import AIChat from './components/AIChat';
import PricingScreen from './components/PricingScreen';
import SettingsScreen from './components/SettingsScreen';
import NutritionTrainingBoard from './components/NutritionTrainingBoard';
import Logo from './components/Logo';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  auth 
} from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { dbService } from './services/dbService';
import { calculateCycleStatus } from './lib/cycle-logic';

import { t, Language } from './lib/i18n';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<CycleLog[]>([]);
  const lang: Language = profile?.language || 'pt';

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [partnerModeData, setPartnerModeData] = useState<any>(null);
  const [emailVerified, setEmailVerified] = useState(true);
  const [verificationSent, setVerificationSent] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancel' | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // 1. Check for partner data or payment status in URL
    const params = new URLSearchParams(window.location.search);
    const partnerData = params.get('partnerData');
    const paymentSuccess = params.get('payment_success');
    const paymentCancel = params.get('payment_cancel');

    if (paymentSuccess === 'true') {
      setPaymentStatus('success');
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentCancel === 'true') {
      setPaymentStatus('cancel');
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    if (partnerData) {
      try {
        const decoded = JSON.parse(atob(partnerData));
        setPartnerModeData(decoded);
        setCurrentScreen('partner');
        setIsInitialized(true);
        return;
      } catch (e) {
        console.error("Failed to decode partner data");
      }
    }

    // 2. Firebase Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setEmailVerified(firebaseUser.emailVerified);
          // Fetch user data from Firestore
          const dbUser = await dbService.getUser(firebaseUser.uid);
          if (dbUser) {
            setUser({
              id: firebaseUser.uid,
              name: dbUser.name,
              nickname: dbUser.nickname,
              email: firebaseUser.email || '',
              plan: dbUser.plan
            });
            // Load all profile fields including language and notifications
            setProfile({
              age: dbUser.age,
              cycleLength: dbUser.cycleLength,
              periodLength: dbUser.periodLength,
              language: dbUser.language,
              notifications: dbUser.notifications,
              dietPreference: dbUser.dietPreference
            });
          } else {
            // If user exists in Auth but not in DB, it's a new user or incomplete onboarding
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Utilizadora',
              email: firebaseUser.email || '',
              plan: 'free'
            });
          }
        } else {
          setUser(null);
          setProfile(null);
          setLogs([]);
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setIsInitialized(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 3. Subscription to Logs
  useEffect(() => {
    if (user?.id) {
      const unsubscribeLogs = dbService.subscribeToLogs(user.id, (newLogs) => {
        setLogs(newLogs);
      });
      return () => unsubscribeLogs();
    }
  }, [user?.id]);

  useEffect(() => {
    if (user && profile && paymentStatus === 'success' && user.plan !== 'premium') {
      const updatePlan = async () => {
        try {
          const updatedUser = { ...user, plan: 'premium' as const };
          await dbService.saveUser(updatedUser, profile);
          setUser(updatedUser);
        } catch (err) {
          console.error("Failed to update plan:", err);
        }
      };
      updatePlan();
    }
  }, [user, profile, paymentStatus]);

  const handleAuthSuccess = async (userData: User) => {
    setUser(userData);
    // If user is returning (already has profile in DB), it will be caught by onAuthStateChanged too
    // But for new users we need to wait for onboarding
  };

  const handleOnboardingComplete = async (profileData: UserProfile) => {
    if (user) {
      setProfile(profileData);
      await dbService.saveUser(user, profileData);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowProfileMenu(false);
  };

  if (!isInitialized) return null;

  if (partnerModeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 md:p-10">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Logo size="md" />
            <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold border border-purple-200">Modo Parceiro Ativo</span>
          </div>
          <PartnerView profile={partnerModeData.p} logs={partnerModeData.l} />
          <div className="mt-10 text-center">
            <button 
              onClick={() => window.location.href = window.location.origin + window.location.pathname}
              className="text-xs text-gray-400 font-bold hover:text-pink-primary"
            >
              Criar a minha própria conta no Luna →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  if (!profile) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard profile={profile} logs={logs} user={user} onNavigate={setCurrentScreen} />;
      case 'log': return <LogEntry lang={profile.language} onSave={async (log) => {
        if (user) {
          await dbService.saveLog(user.id, log);
          setCurrentScreen('dashboard');
        }
      }} />;
      case 'fertility': return <FertilityBoard profile={profile} logs={logs} />;
      case 'nutrition_training': return (
        <NutritionTrainingBoard 
          profile={profile} 
          logs={logs} 
          user={user} 
          onUpdateProfile={async (profileData) => {
            if (user && profile) {
              const updatedProfile = { ...profile, ...profileData };
              setProfile(updatedProfile);
              try {
                await dbService.saveUser(user, updatedProfile);
              } catch (err) {
                console.error("Failed to save profile changes:", err);
              }
            }
          }}
        />
      );
      case 'history': return <HistoryBoard lang={profile.language} logs={logs} onDelete={async (id) => {
        if (user) await dbService.deleteLog(user.id, id);
      }} />;
      case 'partner': return <PartnerView profile={profile} logs={logs} />;
      case 'ai': return <AIChat user={user} profile={profile} logs={logs} />;
      case 'settings': return (
        <SettingsScreen 
          user={user} 
          profile={profile} 
          logs={logs}
          onDeleteLog={async (id) => {
            if (user) await dbService.deleteLog(user.id, id);
          }}
          onUpdateUser={async (userData, profileData) => {
            if (user && profile) {
              const updatedUser = { ...user, ...userData };
              const updatedProfile = { ...profile, ...profileData };
              
              // Optimistically update local states for immediate responsiveness
              setUser(updatedUser as User);
              setProfile(updatedProfile as UserProfile);

              try {
                await dbService.saveUser(updatedUser as User, updatedProfile as UserProfile);
              } catch (err) {
                console.error("Failed to save profile changes to database. Persisting locally:", err);
              }
            }
          }}
          onLogout={handleLogout}
          onBack={() => setCurrentScreen('dashboard')}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
      );
      case 'premium': return (
        <PricingScreen 
          lang={profile.language}
          onBack={() => setCurrentScreen('dashboard')} 
          user={user}
          onUpgrade={async () => {
            if (user && profile) {
              const updatedUser = { ...user, plan: 'premium' as const };
              setUser(updatedUser);
              await dbService.saveUser(updatedUser, profile);
              setCurrentScreen('dashboard');
              setShowProfileMenu(false);
            }
          }} 
        />
      );
      default: return <Dashboard profile={profile} logs={logs} user={user} onNavigate={setCurrentScreen} />;
    }
  };

  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => setCurrentScreen(id)}
      className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all ${
        currentScreen === id 
          ? 'bg-pink-light text-pink-primary font-semibold' 
          : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5 md:w-4 md:h-4" />
      <span className="text-[10px] md:text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col p-6 fixed inset-y-0 shadow-sm">
        <div className="mb-10 px-2">
          <Logo size="md" />
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavItem id="dashboard" label={t('dashboard', lang)} icon={LayoutDashboard} />
          <NavItem id="log" label={t('log', lang)} icon={PlusCircle} />
          <NavItem id="fertility" label={t('fertility', lang)} icon={Calendar} />
          <NavItem id="nutrition_training" label={t('nutrition_training', lang)} icon={Apple} />
          <NavItem id="partner" label={t('partner', lang)} icon={Users} />
          <NavItem id="ai" label={t('ai', lang)} icon={MessageSquare} />
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-pink-mid flex items-center justify-center text-pink-900 font-medium">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold truncate text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </button>

            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 px-2 py-2"
              >
                <button 
                  onClick={() => {
                    setCurrentScreen('premium');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm"
                >
                  <CreditCard className="w-4 h-4 text-pink-primary" /> 
                  <span className={user.plan === 'premium' ? 'text-pink-primary font-bold' : ''}>
                    {user.plan === 'premium' ? (lang === 'pt' ? 'Subscrição Ativa' : lang === 'es' ? 'Suscripción Activa' : 'Active Subscription') : t('premium', lang)}
                  </span>
                </button>

                <button 
                  onClick={() => {
                    setCurrentScreen('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm"
                >
                  <Settings className="w-4 h-4 text-gray-400" /> {t('settings', lang)}
                </button>
                <div className="h-px bg-gray-50 my-1 mx-2" />
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 text-sm"
                >
                  <LogOut className="w-4 h-4" /> {t('logout', lang)}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Logo size="sm" />
        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-8 h-8 rounded-full bg-pink-mid flex items-center justify-center text-pink-900 text-xs text font-bold shadow-sm">
          {user.name.charAt(0)}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        {paymentStatus === 'success' && (
          <div className="bg-green-50 border-b border-green-100 px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-green-600" />
              <p className="text-xs font-medium text-green-800">
                Parabéns! O seu plano Luna Pro foi ativado com sucesso.
              </p>
            </div>
            <button onClick={() => setPaymentStatus(null)} className="text-green-800 hover:text-green-900"><X className="w-4 h-4" /></button>
          </div>
        )}
        {paymentStatus === 'cancel' && (
          <div className="bg-gray-100 border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PlusCircle className="w-4 h-4 text-gray-600 rotate-45" />
              <p className="text-xs font-medium text-gray-800">
                O pagamento foi cancelado. Se tiver alguma dúvida, contacte o suporte.
              </p>
            </div>
            <button onClick={() => setPaymentStatus(null)} className="text-gray-800 hover:text-gray-900"><X className="w-4 h-4" /></button>
          </div>
        )}
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center z-40 bg-opacity-90 backdrop-blur-md">
        <NavItem id="dashboard" label={t('dashboard', lang)} icon={LayoutDashboard} />
        <NavItem id="log" label={t('log', lang)} icon={PlusCircle} />
        <NavItem id="fertility" label={t('fertility', lang)} icon={Calendar} />
        <NavItem id="nutrition_training" label={t('nutrition_training', lang)} icon={Apple} />
        <NavItem id="ai" label={t('ai', lang)} icon={MessageSquare} />
      </nav>

      {/* Mobile Profile Menu Overlay */}
      <AnimatePresence>
        {showProfileMenu && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowProfileMenu(false)}
               className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl p-6 flex flex-col border-l"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold">Perfil</span>
                <button onClick={() => setShowProfileMenu(false)}><X className="w-6 h-6" /></button>
              </div>
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-50">
                <div className="w-12 h-12 rounded-full bg-pink-mid flex items-center justify-center text-pink-900 text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <button 
                  onClick={() => {
                    setCurrentScreen('premium');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 text-sm font-medium"
                >
                  <CreditCard className="w-5 h-5 text-gray-400" /> 
                  {user.plan === 'premium' 
                    ? (lang === 'pt' ? 'Gerir Subscrição' : lang === 'es' ? 'Gestionar Suscripción' : 'Manage Subscription') 
                    : t('premium', lang)}
                </button>

                <button 
                  onClick={() => {
                    setCurrentScreen('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 text-sm font-medium"
                >
                  <Settings className="w-5 h-5 text-gray-400" /> Definições
                </button>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold mt-auto"
              >
                <LogOut className="w-5 h-5" /> Sair da conta
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
