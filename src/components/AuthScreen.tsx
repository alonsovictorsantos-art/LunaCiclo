import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Mail, Lock, User as UserIcon, ArrowRight, Check, Shield, Zap, Sparkles, HelpCircle, ChevronDown, Heart, Activity, FileText, Users, Quote, CreditCard, Wallet, Star, Calendar, MessageSquare, Fingerprint, Share2, Apple, ChefHat, Flame, Utensils } from 'lucide-react';
import Logo from './Logo';
import { User } from '../types';
import { checkoutPro } from '../lib/stripe';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  auth 
} from '../lib/firebase';
import { dbService } from '../services/dbService';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [previewPhase, setPreviewPhase] = useState<'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal'>('Menstrual');
  const [checkedIngs, setCheckedIngs] = useState<Record<string, boolean>>({});

  const hour = new Date().getHours();
  const currentGreeting = hour >= 6 && hour < 12 ? 'Bom dia' : hour >= 12 && hour < 18 ? 'Boa tarde' : 'Boa noite';

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      let firebaseUser;
      
      if (isSignUp) {
        if (!name) {
          setError('Por favor, introduza o seu nome.');
          setIsLoading(false);
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = result.user;
        await updateProfile(firebaseUser, { displayName: name });
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        firebaseUser = result.user;
      }

      const existingUser = await dbService.getUser(firebaseUser.uid);
      
      const userData: User = existingUser ? (existingUser as User) : {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || name || 'Utilizadora Luna',
        email: firebaseUser.email || email,
        plan: 'free'
      };

      if (!existingUser) {
        await dbService.saveUser(userData, {
          age: 25,
          cycleLength: 28,
          periodLength: 5
        });
      }

      onAuthSuccess(userData);
    } catch (err: any) {
      console.error("Auth Error details:", err);
      const errorCode = err.code;
      
      if (errorCode === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este e-mail. Verifique se digitou corretamente ou crie uma conta.');
      } else if (errorCode === 'auth/wrong-password') {
        setError('A palavra-passe está incorreta. Tente novamente ou use a recuperação de senha.');
      } else if (errorCode === 'auth/invalid-credential') {
        setError('E-mail ou palavra-passe incorretos. Verifique os seus dados.');
      } else if (errorCode === 'auth/email-already-in-use') {
        setError('Este e-mail já está associado a uma conta. Tente fazer login em vez de criar conta.');
      } else if (errorCode === 'auth/weak-password') {
        setError('A palavra-passe é demasiado fraca. Use pelo menos 6 caracteres.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('O formato do e-mail não é válido. Exemplo: seu@email.com');
      } else if (errorCode === 'auth/user-disabled') {
        setError('Esta conta foi desativada. Entre em contacto com o suporte.');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Muitas tentativas falhadas. A conta foi temporariamente bloqueada. Tente mais tarde.');
      } else if (errorCode === 'auth/operation-not-allowed') {
        setError('O login por e-mail/senha não está ativo no Firebase. Por favor, ative-o no Console.');
      } else {
        setError(`Erro inesperado (${errorCode || "desconhecido"}). Verifique a sua ligação à internet.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const Feature = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <div className="flex flex-col gap-3 p-6 rounded-3xl bg-white/50 border border-white/50 backdrop-blur-sm">
      <div className="w-12 h-12 bg-pink-light text-pink-primary rounded-2xl flex items-center justify-center text-xl shadow-inner uppercase font-bold tracking-tighter">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );

  const BentoFeature = ({ icon: Icon, title, desc, className = "", delay = 0 }: { icon: any, title: string, desc: string, className?: string, delay?: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`p-8 rounded-[40px] bg-white border border-gray-100 shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:border-pink-100 transition-all duration-500 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );

  const SectionTitle = ({ subtitle, title, centered = false }: { subtitle: string, title: string, centered?: boolean }) => (
    <div className={`flex flex-col gap-6 ${centered ? 'items-center text-center' : ''}`}>
      <div className="inline-flex items-center gap-2 bg-pink-light/50 border border-pink-100 rounded-full px-4 py-2 w-fit">
        <Star className="w-3 h-3 text-pink-primary fill-pink-primary" />
        <span className="text-[8px] sm:text-[10px] font-black text-pink-primary uppercase tracking-[0.2em]">{subtitle}</span>
      </div>
      <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 leading-[1.05] text-balance">
        {title}
      </h2>
    </div>
  );

  const Testimonial = ({ quote, author, role, initials, stars, location }: { quote: string, author: string, role: string, initials?: string, stars?: number, location?: string }) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-6 text-left hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl bg-pink-light flex items-center justify-center text-pink-primary font-black text-sm">
          {initials || <Quote className="w-5 h-5" />}
        </div>
        {stars && (
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs ${i < stars ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
        )}
      </div>
      <p className="text-gray-600 font-medium leading-relaxed italic">"{quote}"</p>
      <div>
        <h4 className="font-bold text-gray-900">{author}</h4>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{role}</p>
          {location && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{location}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F9] overflow-hidden selection:bg-pink-100 selection:text-pink-primary flex flex-col justify-center transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_top_right,_#FFEDF2_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-[600px] bg-[radial-gradient(circle_at_bottom_left,_#F3E9FF_0%,_transparent_70%)] pointer-events-none" />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8 mb-32"
          >
            <Logo size="lg" />
            
            <div className="inline-flex items-center gap-2 bg-pink-light/50 border border-pink-100 rounded-full px-4 py-2 mt-4">
              <Sparkles className="w-4 h-4 text-pink-primary" />
              <span className="text-[10px] font-bold text-pink-primary uppercase tracking-[0.2em]">Privado & Seguro</span>
            </div>
            
            <h1 className="text-5xl sm:text-9xl font-black tracking-tight text-gray-900 leading-[0.9] mb-8">
              O seu corpo, <br />
              <span className="text-pink-primary italic relative">
                o seu ritmo.
                <motion.span 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute bottom-4 left-0 h-4 bg-pink-light/30 -z-10"
                />
              </span>
            </h1>
            
            <p className="text-xl sm:text-3xl text-gray-400 font-medium leading-relaxed max-w-2xl mb-12">
              Privacidade de elite para a sua saúde hormonal. <br className="hidden sm:block" />
              Monitorização precisa, segura e sem compromissos.
            </p>

            <div className="flex flex-col gap-4 mt-8 w-full max-w-sm">
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleEmailAuth}
                className="space-y-4 w-full"
              >
                {isSignUp && (
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="O seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-pink-light transition-all outline-none"
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-pink-light transition-all outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password"
                    placeholder="Palavra-passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-pink-light transition-all outline-none"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pink-primary text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-pink-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      {isSignUp ? 'Criar Conta' : 'Entrar'} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex flex-col gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-[10px] font-bold text-gray-400 hover:text-pink-primary transition-colors text-center p-2"
                  >
                    {isSignUp ? 'Já tem conta? Entre aqui' : 'Não tem conta? Crie agora'}
                  </button>
                </div>
              </motion.form>
              
              {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-wider bg-red-50 py-3 rounded-xl border border-red-100 mt-4">{error}</p>}
            <div className="flex flex-col items-center gap-6 mt-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Em conformidade com</p>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                <span className="font-serif text-xl italic font-bold">GDPR</span>
                <span className="font-sans text-xl font-black">HIPAA</span>
                <span className="font-mono text-lg font-bold">ISO 27001</span>
                <span className="font-sans text-xl font-black tracking-tighter">APPLE HEALTH</span>
              </div>
            </div>

            {/* Mockup Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 p-8 rounded-[64px] border border-white shadow-[0_32px_64px_-16px_rgba(255,107,157,0.1)] backdrop-blur-2xl w-full max-w-[320px] mx-auto mt-24 mb-12 overflow-hidden relative group"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none" />
              
              <div className="flex justify-between items-center mb-10 text-left">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400">{currentGreeting},</span>
                  <h4 className="text-xl font-black text-gray-900 flex items-center gap-2">Ana Beatriz 👋</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-pink-primary text-white flex items-center justify-center font-bold text-xs shadow-lg shadow-pink-primary/20">AB</div>
              </div>

              <div className="relative flex justify-center mb-10">
                <div className="w-44 h-44 rounded-full border-[12px] border-pink-light/30 relative flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-[12px] border-pink-primary border-r-transparent border-b-transparent -rotate-[30deg] drop-shadow-sm" />
                    <div className="text-center">
                        <span className="text-5xl font-black text-gray-900 block leading-none">14</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 block">dia do ciclo</span>
                    </div>
                </div>
              </div>

              <div className="flex justify-center mb-10">
                <div className="bg-teal-50/50 text-teal-600 px-6 py-2.5 rounded-full border border-teal-100/30 flex items-center gap-2 backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Fase de Ovulação</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { v: "28", l: "Ciclo (dias)" },
                    { v: "5", l: "Período" },
                    { v: "98%", l: "Saúde" }
                ].map((s, i) => (
                    <div key={i} className="bg-white/40 p-4 rounded-3xl border border-white shadow-sm flex flex-col items-center text-center">
                        <span className="text-lg font-black text-gray-900">{s.v}</span>
                        <span className="text-[8px] text-gray-400 font-bold uppercase mt-1.5 leading-tight">{s.l}</span>
                    </div>
                ))}
              </div>

              <div className="bg-white/60 p-6 rounded-[32px] border border-white shadow-sm space-y-4 text-left">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-primary animate-pulse" />
                    <span className="text-[10px] font-black text-pink-primary uppercase tracking-widest">Luna IA</span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                    Ana, está na sua janela fértil! Energia elevada é normal agora. Considere exercício moderado e hidratação extra. ✨
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

          {/* New Sections */}
          <div className="w-full space-y-40 py-24">
            {/* Ciência e Confiança */}
            <section id="ciencia">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-left">
                <div className="space-y-8">
                  <SectionTitle 
                    subtitle="Base Científica" 
                    title="A tecnologia ao serviço da sua biologia." 
                  />
                  <p className="text-lg text-gray-500 font-medium leading-relaxed">
                    A Luna não é apenas um calendário. É uma plataforma de saúde hormonal desenvolvida para traduzir os sinais do seu corpo em insights claros e acionáveis.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Precisão Médica</h4>
                        <p className="text-xs text-gray-400 font-medium">Algoritmos baseados em padrões clínicos.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Dados Soberanos</h4>
                        <p className="text-xs text-gray-400 font-medium">Os seus dados são 100% encriptados e privados.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4 translate-y-8">
                    <div className="w-12 h-12 bg-pink-primary/10 rounded-2xl flex items-center justify-center text-pink-primary">
                      <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <h3 className="font-black text-2xl text-gray-900">98%</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Satisfação</p>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-[24px] border border-gray-800 shadow-xl space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-2xl text-white">256-bit</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Encriptação</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Funcionalidades Bento */}
            <section id="funcionalidades">
              <SectionTitle 
                subtitle="Experiência" 
                title="A app que fala a língua do seu corpo." 
                centered 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-20">
                <BentoFeature 
                  className="md:col-span-3"
                  icon={Calendar} 
                  title="Ciclo Inteligente" 
                  desc="Algoritmos de próxima geração que preveem o seu período, ovulação e sintomas com precisão milimétrica, aprendendo com cada entrada." 
                  delay={0.1}
                />
                <BentoFeature 
                  className="md:col-span-3 lg:col-span-3"
                  icon={MessageSquare} 
                  title="Luna IA (Chat Privado)" 
                  desc="Uma mentora de saúde 24/7. Tire dúvidas sobre nutrição, alterações de humor ou sintomas específicos sem julgamentos." 
                  delay={0.2}
                />
                <BentoFeature 
                  className="md:col-span-2"
                  icon={Fingerprint} 
                  title="Privacidade Zero-Knowledge" 
                  desc="Nem nós conseguimos ver os seus dados. Tudo é encriptado antes de sair do seu dispositivo." 
                  delay={0.3}
                />
                <BentoFeature 
                  className="md:col-span-2"
                  icon={Share2} 
                  title="Modo Parceiro" 
                  desc="Sincronização seletiva com o seu parceiro ou parceira para melhor comunicação." 
                  delay={0.4}
                />
                <BentoFeature 
                  className="md:col-span-2"
                  icon={Activity} 
                  title="Saúde Menstrual" 
                  desc="Vá além da fertilidade. Monitorize o volume do fluxo, padrões de dor e saúde hormonal a longo prazo." 
                  delay={0.5}
                />
              </div>
            </section>

            {/* Health Narrative section */}
            <section className="py-24">
               <div className="bg-pink-50/30 rounded-[64px] p-12 sm:p-24 border border-pink-100/50">
                  <div className="max-w-4xl mx-auto text-center space-y-12">
                     <div className="inline-flex items-center gap-2 bg-white border border-pink-100 rounded-full px-4 py-2">
                        <Heart className="w-3 h-3 text-pink-primary" />
                        <span className="text-[10px] font-black text-pink-primary uppercase tracking-widest">Equilíbrio Holístico</span>
                     </div>
                     <h2 className="text-4xl sm:text-7xl font-black text-gray-900 leading-[1.05]">Não é apenas sobre fertilidade. É sobre o seu <span className="text-pink-primary">bem-estar total</span>.</h2>
                     <p className="text-xl text-gray-500 font-medium leading-relaxed">
                        Muitas apps focam-se apenas em engravidar. A Luna foca-se na sua saúde. <br className="hidden sm:block" />
                        Entender as fases da sua menstruação é fundamental para detetar desequilíbrios hormonais, stress e défices nutritivos.
                     </p>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
                        <div className="text-left">
                           <p className="text-sm font-black text-gray-900 uppercase mb-2">Fase Menstrual</p>
                           <p className="text-xs text-gray-400 font-medium">Renovação e introspeção profunda.</p>
                        </div>
                        <div className="text-left">
                           <p className="text-sm font-black text-gray-900 uppercase mb-2">Fase Foli/Ovu</p>
                           <p className="text-xs text-gray-400 font-medium">Energia, brilho e vitalidade máxima.</p>
                        </div>
                        <div className="text-left">
                           <p className="text-sm font-black text-gray-900 uppercase mb-2">Fase Lútea</p>
                           <p className="text-xs text-gray-400 font-medium">Preparação, sensibilidade e autocuidado.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Luna IA Showcase Section */}
            <section className="py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 lg:order-1">
                  <div className="bg-[#1A1A1A] rounded-[48px] p-8 shadow-2xl relative overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-auto">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#FF3D77_0%,_transparent_50%)] opacity-20" />
                    <div className="relative z-10 h-full flex flex-col pt-12">
                      <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 rounded-full bg-pink-primary flex items-center justify-center text-white">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-widest">Luna IA</p>
                          <p className="text-[10px] text-pink-primary/60 font-bold uppercase">Online & Segura</p>
                        </div>
                      </div>

                      <div className="space-y-6 flex-1">
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl rounded-tl-none max-w-[80%] border border-white/10">
                          <p className="text-sm text-gray-200 font-medium">{currentGreeting}, Ana! Notei que hoje entras na fase lútea. Como te sentes? ✨</p>
                        </div>
                        <div className="bg-pink-primary p-5 rounded-3xl rounded-tr-none max-w-[80%] self-end ml-auto">
                          <p className="text-sm text-white font-medium">Sinto-me um pouco cansada e com dor de cabeça. É normal?</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl rounded-tl-none max-w-[80%] border border-white/10">
                          <p className="text-sm text-gray-200 font-medium leading-relaxed">
                            Sim, a queda de estrogénio nesta fase pode causar isso. Tenta aumentar a ingestão de magnésio e descansar mais 20min hoje. Queres que sugira um snack ideal? 🍎
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                        <div className="flex-1 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4">
                          <span className="text-xs text-gray-500">Escreva uma mensagem...</span>
                        </div>
                        <div className="w-12 h-12 bg-pink-primary rounded-2xl flex items-center justify-center text-white">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-left space-y-8 order-1 lg:order-2">
                  <SectionTitle 
                    subtitle="Inteligência" 
                    title="A sua saúde, explicada por IA." 
                  />
                  <p className="text-lg text-gray-500 font-medium leading-relaxed">
                    Esqueça as pesquisas genéricas no Google. A Luna IA analisa o seu histórico único para fornecer respostas personalizadas e conselhos baseados em literatura médica feminina.
                  </p>
                  <ul className="space-y-6">
                    {[
                      { t: "Análise de Padrões", d: "Deteta irregularidades antes de se tornarem problemas." },
                      { t: "Nutrição por Ciclo", d: "Sugestões de alimentação para cada fase hormonal." },
                      { t: "Bem-estar Holístico", d: "Dicas de exercício e sono personalizadas." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-pink-light text-pink-primary flex items-center justify-center shrink-0 mt-1">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.t}</h4>
                          <p className="text-sm text-gray-500 font-medium">{item.d}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Testemunhos */}
            <section id="testemunhos">
              <SectionTitle 
                subtitle="Comunidade" 
                title="Dezenas de utilizadoras já confiam na Luna." 
                centered 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <Testimonial 
                  stars={5}
                  initials="MC"
                  quote="Finalmente uma app que realmente entende o meu corpo. Os insights da IA são surpreendentemente precisos e o design é lindo."
                  author="Mariana Costa"
                  role="Mariana Costa"
                  location="Lisboa, Portugal"
                />
                <Testimonial 
                  quote="A Luna mudou a forma como olho para as minhas flutuações de humor. Agora percebo o porquê de cada fase."
                  author="Mariana Silva"
                  role="Designer"
                  initials="MS"
                  stars={5}
                />
                <Testimonial 
                  quote="A Luna IA é incrível para tirar dúvidas rápidas que às vezes temos vergonha de perguntar pessoalmente."
                  author="Sofia Costa"
                  role="Atleta"
                  initials="SC"
                  stars={5}
                />
              </div>
            </section>

            {/* Como Funciona */}
            <section id="como-funciona" className="bg-white/50 p-12 sm:p-24 rounded-[64px] border border-white">
              <SectionTitle 
                subtitle="Metodologia" 
                title="A jornada Luna em 3 passos simples." 
                centered 
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 relative">
                 <div className="hidden md:block absolute top-[40px] left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-pink-100" />
                 
                 {[
                   { icon: <UserIcon className="w-8 h-8" />, title: "Perfil Personalizado", desc: "Introduza os seus dados básicos para começar a calibração." },
                   { icon: <Zap className="w-8 h-8" />, title: "Registo Diário", desc: "Registe humor, sintomas e atividade em menos de 30 segundos." },
                   { icon: <Sparkles className="w-8 h-8" />, title: "Insights de IA", desc: "Receba conselhos baseados em dados reais e ciência da saúde hormonal." }
                 ].map((step, i) => (
                   <div key={i} className="flex flex-col items-center text-center gap-6 relative z-10">
                      <div className="w-20 h-20 rounded-[32px] bg-white border border-gray-100 shadow-xl flex items-center justify-center text-pink-primary relative">
                         <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-primary text-white text-xs font-bold flex items-center justify-center shadow-lg">
                           {i + 1}
                         </span>
                         {step.icon}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed px-4">{step.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
            </section>

            {/* Seção de Nutrição Bio-Sincronizada (Landing/Pre-login) */}
            <section id="nutricao-sincronizada" className="bg-gradient-to-br from-pink-50/20 via-white to-orange-50/20 rounded-[64px] border border-gray-100 p-8 sm:p-20 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-pink-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-400/5 rounded-full blur-3xl pointer-events-none" />

              <SectionTitle 
                subtitle="Nutrição Inteligente & Bio-Alinhada" 
                title="Sincronize a sua alimentação com o ritmo das suas hormonas." 
                centered 
              />
              
              <p className="text-sm text-gray-500 text-center max-w-3xl mx-auto mt-8 leading-relaxed font-semibold mb-12">
                O corpo feminino passa por quatro flutuações hormonais distintas a cada ciclo lunar. Otimizar a ingestão de macronutrientes específicos em cada fase ajuda a regular os picos de insulina, estabilizar o humor, obter energia limpa e mitigar as dores menstruais.
              </p>

              {/* Seletor Interativo de Fases */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
                {([
                  { id: 'Menstrual', emoji: '🩸', title: 'Menstrual', subtitle: 'Fase de Restauro', days: 'Dias 1 - 5' },
                  { id: 'Follicular', emoji: '🌱', title: 'Folicular', subtitle: 'Fase de Energia', days: 'Dias 6 - 12' },
                  { id: 'Ovulatory', emoji: '🔥', title: 'Ovulatória', subtitle: 'Pico de Brilho', days: 'Dias 13 - 16' },
                  { id: 'Luteal', emoji: '🍂', title: 'Lútea', subtitle: 'Fase de TPM & Calma', days: 'Dias 17 - 28' }
                ] as const).map((ph) => {
                  const isSelected = previewPhase === ph.id;
                  return (
                    <button
                      key={ph.id}
                      type="button"
                      onClick={() => {
                        setPreviewPhase(ph.id);
                        setCheckedIngs({});
                      }}
                      className={`p-6 rounded-[32px] border text-left transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                        isSelected 
                          ? 'bg-white border-pink-400 shadow-md ring-2 ring-pink-primary/10 scale-[1.03]' 
                          : 'bg-white/80 border-gray-100/80 hover:border-pink-200/50 hover:bg-white hover:scale-101'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-primary to-orange-400" />
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl block filter drop-shadow-sm group-hover:scale-110 transition-transform">{ph.emoji}</span>
                          <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-full">{ph.days}</span>
                        </div>
                        <h4 className="font-extrabold text-gray-950 text-base leading-tight">{ph.title}</h4>
                        <span className="text-[10.5px] text-pink-primary font-bold block mt-1 uppercase tracking-wider">{ph.subtitle}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Container de Recomendação Inteligente de Alta Fidelidade */}
              <div className="mt-10 max-w-5xl mx-auto bg-white rounded-[40px] border border-gray-100/80 shadow-[0_10px_40px_rgba(0,0,0,0.015)] p-6 md:p-10">
                <AnimatePresence mode="wait">
                  {(() => {
                    // Configuração de dados de bio-sincronia por fase
                    const activeData = {
                      Menstrual: {
                        goalTitle: "❤️ Reposição de Ferro, Nutrição Térmica & Anti-inflamatória",
                        biologyDesc: "Durante os dias de perdas hemáticas, os níveis de ferro decrescem abruptamente, e o metabolismo basal desacelera. Alimentos quentes de fácil digestão e temperados com propriedades térmicas aliviam cólicas uterinas e repõem a energia perdida de forma harmoniosa.",
                        hormones: [
                          { name: "Estrogénio", val: "10%", color: "bg-pink-300" },
                          { name: "Progesterona", val: "5%", color: "bg-orange-300" },
                          { name: "Nível de Energia", val: "30%", color: "bg-amber-300" },
                          { name: "Conforto Pélvico", val: "40%", color: "bg-teal-400" }
                        ],
                        plate: [
                          { label: "Carboidratos Quentes", pct: 40, color: "bg-orange-500", tip: "Arroz integral, abóbora assada, aveia morna" },
                          { label: "Proteína Reconstrutora", pct: 25, color: "bg-pink-primary", tip: "Lentilhas, carne magra de pasto, ovos ricos em ferro" },
                          { label: "Gordura Saudável", pct: 20, color: "bg-emerald-500", tip: "Sementes de sésamo, azeite virgem extra" },
                          { label: "Minerais & Detóx", pct: 15, color: "bg-teal-500", tip: "Vegetais escuros cozidos a vapor, algas" }
                        ],
                        nutrients: ["Alimentos ricos em Ferro biodisponível", "Zinco para proteção do endométrio", "Magnésio muscular de cacau e sementes", "Chá de Gengibre ou Canela morno"],
                        recipe: {
                          title: "Creme Concentrado de Abóbora com Gengibre e Sementes",
                          desc: "Sopa aveludada, termogénica e de fácil absorção, idealizada para relaxar a contração uterina, reidratar os órgãos internos de minerais essenciais e acalmar o estômago.",
                          steps: ["Cozinhe abóbora hokkaido com alho-francês molhado e raspas de gengibre fresco.", "Triture no liquidificador até obter consistência pura.", "Sirva com fios de azeite e sementes de abóbora tostadas."]
                        },
                        avoid: "Evitar / Moderar hoje:",
                        avoidList: [
                          { title: "Cafeína em Jejum", explanation: "Estimula o cortisol e acentua os espasmos e cólicas pélvicas dolorosas." },
                          { title: "Bebidas & Gelados Frios", explanation: "Causa contração térmica dos capilares intestinais e aumenta o congestionamento pélvico." },
                          { title: "Açúcar Branco", explanation: "Drena o magnésio disponível que os músculos dependem para o relaxamento de cólicas." }
                        ]
                      },
                      Follicular: {
                        goalTitle: "🌱 Estrogénio Saudável & Ativação de Energia Lumínica",
                        biologyDesc: "O estrogénio ressurge com força, impulsionando a renovação e melhorando a sensibilidade celular à insulina. Favorecemos alimentos frescos ricos em fitoativos suaves, probióticos rejuvenescedores e grãos germinados para manter a vitalidade recém-nascida sob excelente controlo.",
                        hormones: [
                          { name: "Estrogénio", val: "65%", color: "bg-pink-400" },
                          { name: "Progesterona", val: "10%", color: "bg-orange-300" },
                          { name: "Nível de Energia", val: "80%", color: "bg-emerald-400" },
                          { name: "Conforto Pélvico", val: "95%", color: "bg-teal-500" }
                        ],
                        plate: [
                          { label: "Hidratos de Alta Energia", pct: 30, color: "bg-orange-500", tip: "Quinoa germinada, arroz selvagem, painço" },
                          { label: "Proteína Ativadora", pct: 30, color: "bg-pink-primary", tip: "Frango biológico, peixes selvagens, tofu orgânico" },
                          { label: "Gordura Protetora", pct: 20, color: "bg-emerald-500", tip: "Abacate fresco, sementes de abóbora" },
                          { label: "Fibras Pró-Digestivas", pct: 20, color: "bg-teal-500", tip: "Chucrute fermentado fresco, kefir, folhas verdes" }
                        ],
                        nutrients: ["Fitoestrogénios suaves (linhaça, soja orgânica)", "Alimentos ricos em vitaminas do complexo B", "Bactérias benéficas ativas (iogurte)", "Crucíferos para desintoxicação de estrogénio"],
                        recipe: {
                          title: "Ligeira Quinoa Tricolor com Lascas de Abacate e Kefir-Dressing",
                          desc: "Salada fresca de grãos bioativos cobertos com pesto fresco de hortelã-manjericão, folhas de rúcula e abacate cremoso.",
                          steps: ["Cozinhe a quinoa tricolor e deixe arrefecer ligeiramente.", "Envolva com cubos de abacate maduro, rúcula selvagem e fios de sumo de limão.", "Regue com tempero leve à base de kefir ou iogurte natural com alho."]
                        },
                        avoid: "Evitar / Moderar hoje:",
                        avoidList: [
                          { title: "Óleos Industriais", explanation: "Óleos refinados aquecidos competem com a correta absorção de gorduras saudáveis." },
                          { title: "Laticínios de Baixa Qualidade", explanation: "Podem provocar inflamação subclínica, afetando a pele que está na fase de regeneração." },
                          { title: "Bebidas Alcoólicas", explanation: "Complicam o processamento hepático primário do estrogénio que começa a subir." }
                        ]
                      },
                      Ovulatory: {
                        goalTitle: "🔥 Brilho, Metabolização Estrogénica & Força Máxima",
                        biologyDesc: "Momentos de pico máximo de estrogénio e hormona luteinizante. O seu metabolismo basal está acelerado e o apetite tende a estabilizar. É crucial focar em fibras solúveis de alta absorção para ajudar o corpo a eliminar eficazmente os excedentes hormonais pós-pico através da via intestinal.",
                        hormones: [
                          { name: "Estrogénio", val: "100%", color: "bg-pink-500" },
                          { name: "Progesterona", val: "25%", color: "bg-orange-400" },
                          { name: "Nível de Energia", val: "100%", color: "bg-emerald-500" },
                          { name: "Conforto Pélvico", val: "90%", color: "bg-teal-500" }
                        ],
                        plate: [
                          { label: "Hidratos Estabilizadores", pct: 25, color: "bg-orange-500", tip: "Trigo sarraceno, arroz integral de jasmim, batata" },
                          { label: "Proteína Estrutural", pct: 30, color: "bg-pink-primary", tip: "Salmão selvagem de águas limpas, leguminosas germinadas" },
                          { label: "Fibras de Eliminação (Detox)", pct: 25, color: "bg-teal-500", tip: "Brócolos crus ou vaporizados leves, couve-flor, repolho" },
                          { label: "Lípidos Saudáveis", pct: 20, color: "bg-emerald-500", tip: "Nozes inteiras, sementes de girassol" }
                        ],
                        nutrients: ["Fibras insolúveis de alta qualidade (cruas)", "Vitamina C essencial de bagas e citrinos", "Ácidos gordos Omega-3 de alta pureza", "Flavonoides de coloração vermelhas e roxas"],
                        recipe: {
                          title: "Salmão Grelhado com Brócolos Estaladiços no Wok e Sésamo",
                          desc: "Proteína pura harmonizada com vegetais crucíferos ricos em DIM (diindolilmetano), um composto natural que promove a perfeita via de metabolização do estrogénio.",
                          steps: ["Grelhe o lombo de salmão na grelha apenas com flor de sal e limão.", "Salteie floretes de brócolos crus com óleo de coco e sementes de sésamo.", "Sirva com um toque de tahini denso no topo."]
                        },
                        avoid: "Evitar / Moderar hoje:",
                        avoidList: [
                          { title: "Excesso de Sódio Refinado", explanation: "O pico hormonal do ciclo favorece temporariamente a retenção hídrica generalizada." },
                          { title: "Refeições Volumosas Tardias", explanation: "Tarde na noite, a digestão pesada concorre com o sono profundo essencial para a ovulação." },
                          { title: "Carboidratos Simples", explanation: "Gera picos insulínicos acentuados que deprimem as hormonas essenciais da ovulação saudável." }
                        ]
                      },
                      Luteal: {
                        goalTitle: "🍂 Abastecimento de Magnésio, Glicémia Estável & Calmantes Naturais",
                        biologyDesc: "A progesterona reina, o que eleva ligeiramente a temperatura corporal e estimula o apetite. Para evitar picos de compulsação por açúcar refinado ou quebras abruptas de humor de fim de tarde (TPM), introduza carboidratos complexos ricos em amido resistente e magnésio para acalmar o sistema neurossensorial.",
                        hormones: [
                          { name: "Estrogénio", val: "45%", color: "bg-pink-400" },
                          { name: "Progesterona", val: "95%", color: "bg-orange-500" },
                          { name: "Nível de Energia", val: "55%", color: "bg-amber-400" },
                          { name: "Conforto Pélvico", val: "65%", color: "bg-teal-400" }
                        ],
                        plate: [
                          { label: "Hidratos Complexos (Amidos)", pct: 45, color: "bg-orange-500", tip: "Batata-doce, abóbora assada, inhame, aveia integral" },
                          { label: "Proteína de Saciedade", pct: 25, color: "bg-pink-primary", tip: "Ervilhas, peru, ovos biológicos cozidos" },
                          { label: "Gorduras Ricas em Magnésio", pct: 20, color: "bg-emerald-500", tip: "Chocolate preto 85%, sementes de girassol/sésamo" },
                          { label: "Fibras Digestivas Solúveis", pct: 10, color: "bg-teal-500", tip: "Cenouras cozidas, espinafres, vegetais tenros" }
                        ],
                        nutrients: ["Magnésio de alta biodisponibilidade", "Vitamina B6 para modular a síntese da progesterona", "Gorduras essenciais ricas em Zinco", "Ervas relaxantes (Camomila, Cidreira ou Valeriana)"],
                        recipe: {
                          title: "Batata-Doce Espalmada Assada e Cacau Negro de Sobremesa",
                          desc: "Consolo doce totalmente saudável. Carboidratos ricos em minerais que auxiliam a libertação lenta de glicose para estabilizar a ansiedade pélvica.",
                          steps: ["Asse batata-doce com casca, esmague-as levemente e leve de volta ao forno com canela e sementes de coco.", "Finalize com duas fatias de chocolate preto com percentagem superior a 80% cacau."]
                        },
                        avoid: "Evitar / Moderar hoje:",
                        avoidList: [
                          { title: "Estimulantes e Café Tardio", explanation: "A progesterona elevada afeta a qualidade do sono e o café à tarde agrava muito a irritabilidade típica da TPM." },
                          { title: "Doces e Bolacha após refeição", explanation: "Despoleta montanhas russas de insulina, agravando as quebras emotivas e o cansaço cronológico." },
                          { title: "Alimentos Muito Processados", explanation: "Fomentam a asfixia inflamatória e inflamação mamária típica do período pré-menstrual." }
                        ]
                      }
                    } as const;

                    const cur = activeData[previewPhase];

                    return (
                      <motion.div
                        key={previewPhase}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-10"
                      >
                        {/* Linha Principal de Metas da Bio-Nutrição */}
                        <div className="border-b border-gray-100 pb-8">
                          <span className="text-[10px] font-black tracking-widest text-pink-primary uppercase px-3 py-1 bg-pink-50 rounded-full inline-block mb-3">
                            Meta Bio-Metabólica Ativa
                          </span>
                          <h3 className="text-2xl font-black text-gray-950 tracking-tight leading-normal">
                            {cur.goalTitle}
                          </h3>
                          <p className="text-sm text-gray-500 max-w-4xl mt-3 leading-relaxed font-semibold">
                            {cur.biologyDesc}
                          </p>
                        </div>

                        {/* Grade com Painel Hormonal & Distribuição do Prato */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                          
                          {/* Coluna Esquerda: Medidores Clínicos Hormonais & Nutrientes Recomendados */}
                          <div className="lg:col-span-5 space-y-6">
                            
                            {/* Painel de Mini Indicadores de Níveis */}
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100/50 space-y-4">
                              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4 text-pink-primary" />
                                Níveis & Atividade Estimada
                              </h4>
                              <div className="space-y-3 pt-2">
                                {cur.hormones.map((h, i) => (
                                  <div key={i} className="space-y-1">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                                      <span>{h.name}</span>
                                      <span className="text-pink-primary font-black">{h.val}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: h.val }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                        className={`h-full rounded-full ${h.color}`} 
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Alimentos Recomendados - Lista Dinâmica */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-600" />
                                Alimentos Sagrados para Consumir
                              </h4>
                              <ul className="space-y-2">
                                {cur.nutrients.map((nut, index) => (
                                  <li key={index} className="flex gap-2 text-xs text-gray-700 font-bold bg-white p-3 rounded-2xl border border-gray-100 shadow-xs">
                                    <span className="text-emerald-500 font-extrabold shrink-0">✓</span>
                                    <span>{nut}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                          </div>

                          {/* Coluna Direita: O Prato Perfeito & Receita do Dia */}
                          <div className="lg:col-span-7 space-y-6">
                            
                            {/* Grafico de Distribuição Ideal de Macronutrientes no Prato */}
                            <div className="bg-gradient-to-tr from-pink-50/10 via-white to-orange-50/10 p-6 rounded-3xl border border-pink-100/40 shadow-sm space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-gray-950 uppercase tracking-widest flex items-center gap-2">
                                  <Utensils className="w-4.5 h-4.5 text-pink-primary" />
                                  Distribuição Ideal do Prato (% Macro)
                                </h4>
                                <span className="text-[10px] text-gray-400 font-bold">Base Hormonal</span>
                              </div>

                              {/* Stacked Bar representantando a divisão do prato */}
                              <div className="h-6 w-full flex rounded-xl overflow-hidden shadow-inner border border-white mt-4">
                                {cur.plate.map((p, i) => (
                                  <div 
                                    key={i} 
                                    className={`${p.color} h-full relative group cursor-help transition-all duration-300 hover:opacity-90`}
                                    style={{ width: `${p.pct}%` }}
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                                      {p.pct}%
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Legenda Explicativa do Prato com Dicas e Detalhes */}
                              <div className="grid grid-cols-2 gap-3 pt-3">
                                {cur.plate.map((p, i) => (
                                  <div key={i} className="p-3 bg-white border border-gray-50 rounded-2xl space-y-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`w-2.5 h-2.5 rounded-md ${p.color} shrink-0`} />
                                      <span className="text-[11px] font-black text-gray-800">{p.label} ({p.pct}%)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium leading-tight">
                                      {p.tip}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Receita Terapêutica de Apoio Hormonal */}
                            <div className="border border-gray-100 rounded-[32px] p-6 bg-gray-50/30 space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-100/50 text-pink-primary flex items-center justify-center">
                                  <ChefHat className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-sm text-gray-900 leading-snug">
                                    {cur.recipe.title}
                                  </h4>
                                  <span className="text-[9px] text-pink-primary font-bold uppercase tracking-wider block mt-0.5">Dica de Atendimento Terapêutico</span>
                                </div>
                              </div>

                              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                {cur.recipe.desc}
                              </p>

                              <div className="bg-white p-4 rounded-2xl border border-gray-150 space-y-2">
                                <span className="text-[10px] font-black text-pink-primary uppercase tracking-wide block">Instruções de Preparo:</span>
                                {cur.recipe.steps.map((st, i) => (
                                  <div key={i} className="flex gap-2 text-xs text-gray-600 font-semibold leading-relaxed">
                                    <span className="text-pink-primary font-black">{i + 1}.</span>
                                    <span>{st}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Ingredientes Selecionáveis Interativos */}
                              <div className="space-y-2 pt-1">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Verifique se tem na dispensa hoje:</span>
                                <div className="flex flex-wrap gap-2">
                                  {cur.nutrients.slice(0, 3).map((item, idx) => {
                                    const rawLabel = item.split(' para ')[0].split(' de ')[0].split(' ricos em ')[0];
                                    const isIngChecked = !!checkedIngs[rawLabel];
                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCheckedIngs(p => ({ ...p, [rawLabel]: !isIngChecked }))}
                                        className={`py-1.5 px-3 rounded-xl text-[10.5px] font-bold border transition-all flex items-center gap-2 ${
                                          isIngChecked
                                            ? 'bg-pink-100/50 border-pink-300 text-pink-900 line-through'
                                            : 'bg-white border-gray-100 hover:border-pink-200 text-gray-700'
                                        }`}
                                      >
                                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                          isIngChecked ? 'bg-pink-primary border-pink-primary text-white' : 'bg-white border-gray-200'
                                        }`}>
                                          {isIngChecked && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                                        </div>
                                        {rawLabel}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                            </div>

                          </div>

                        </div>

                        {/* Bloco de Recursos a Evitar com Detalhamento */}
                        <div className="pt-6 border-t border-gray-150">
                          <h4 className="text-xs font-black text-[#851111] uppercase tracking-widest flex items-center gap-2 mb-4">
                            🚫 {cur.avoid}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {cur.avoidList.map((av, idx) => (
                              <div key={idx} className="bg-[#fffcfc] border border-red-100/50 p-4 rounded-2xl flex flex-col gap-1.5">
                                <span className="font-extrabold text-xs text-red-950 block">⚠️ {av.title}</span>
                                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                                  {av.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA de Conversão Directa de Vendas */}
                        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-pink-50/30 to-orange-50/10 p-6 rounded-[32px] border border-pink-100/20">
                          <div className="space-y-1 text-center sm:text-left">
                            <h4 className="font-extrabold text-gray-900 text-sm">Pronta para o seu plano de nutrição individualizado?</h4>
                            <p className="text-xs text-gray-500 font-semibold">Registe o seu ciclo, sintomas e receba menus perfeitamente calibrados pela nossa IA baseada em ciência desportiva feminina.</p>
                          </div>
                          
                          <button
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-pink-primary hover:bg-pink-mid text-white font-extrabold text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-lg shadow-pink-primary/10 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0"
                          >
                            <Sparkles className="w-4 h-4 animate-pulse text-white" />
                            Quero o Meu Plano Personalizado →
                          </button>
                        </div>

                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>

            </section>

            {/* Comparativo de Planos */}
            <section className="bg-white rounded-[64px] border border-gray-100 p-12 sm:p-24 shadow-sm overflow-x-auto">
              <div className="min-w-[600px]">
                <SectionTitle 
                  subtitle="Transparência" 
                  title="Escolha o seu nível de cuidado." 
                  centered 
                />
                
                <div className="mt-20">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-6 pr-8 text-left text-sm font-black text-gray-900 uppercase tracking-widest">Recurso</th>
                        <th className="py-6 px-8 text-center text-sm font-black text-gray-400 uppercase tracking-widest">LUNA FREE</th>
                        <th className="py-6 px-8 text-center text-sm font-black text-pink-primary uppercase tracking-widest bg-pink-50/30 rounded-t-3xl">LUNA PRO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { name: "Previsão de Ciclo & Ovulação", free: true, pro: true },
                        { name: "Registo de Sintomas (20+)", free: true, pro: true },
                        { name: "Assistente de IA (Básico)", free: true, pro: true },
                        { name: "IA de Saúde Profunda (Insights)", free: false, pro: true },
                        { name: "Modo Parceiro Ilimitado", free: false, pro: true },
                        { name: "Exportação de Dados (PDF Médicos)", free: false, pro: true },
                        { name: "Sincronização entre Dispositivos", free: false, pro: true },
                        { name: "Insights Nutricionais p/ cada fase", free: false, pro: true },
                      ].map((row, i) => (
                        <tr key={i} className="group">
                          <td className="py-6 pr-8 text-sm font-bold text-gray-600">{row.name}</td>
                          <td className="py-6 px-8 text-center">
                            {row.free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200 mx-auto" />}
                          </td>
                          <td className="py-6 px-8 text-center bg-pink-50/30 group-last:rounded-b-3xl">
                            {row.pro ? <Check className="w-5 h-5 text-pink-primary mx-auto" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200 mx-auto" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Preços */}
            <section id="precos">
              <SectionTitle 
                subtitle="Upgrade" 
                title="O plano certo para a sua saúde." 
                centered 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
                 <div className="bg-white p-12 rounded-[48px] border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-xl transition-all text-left">
                    <h3 className="text-xl font-bold text-gray-900">Luna Free</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Essencial</p>
                    <div className="flex items-baseline gap-1 my-10">
                       <span className="text-5xl font-black text-gray-900">0€</span>
                       <span className="text-gray-400 font-bold text-sm uppercase">/sempre</span>
                    </div>
                    <ul className="space-y-6 mb-12 flex-1">
                       {["Calendário de Ciclo", "Previsões Básicas", "Registo de Sintomas", "Privacidade Local"].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                            <Check className="w-5 h-5 text-green-500 bg-green-50 p-1 rounded-full" /> {item}
                         </li>
                       ))}
                    </ul>
                    <button className="w-full py-5 rounded-2xl bg-gray-50 text-gray-900 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">
                      Começar Grátis
                    </button>
                 </div>

                 <div className="bg-gray-900 p-12 rounded-[48px] border-4 border-pink-primary/30 shadow-2xl flex flex-col h-full relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex-1">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h3 className="text-xl font-bold text-white">Luna Pro</h3>
                            <p className="text-[10px] font-bold text-pink-primary uppercase tracking-widest mt-1">SaaS de Saúde</p>
                         </div>
                         <div className="bg-pink-primary px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">Popular</div>
                      </div>
                      <div className="flex items-baseline gap-1 mb-10">
                         <span className="text-5xl font-black text-white">12,99€</span>
                         <span className="text-gray-400 font-bold text-sm uppercase">/mês</span>
                      </div>
                      <ul className="space-y-6 mb-12">
                         {["IA de Saúde Completa", "Modo Parceiro Ilimitado", "Relatórios Médicos PDF", "Insights Nutricionais"].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                              <Check className="w-5 h-5 text-pink-primary bg-pink-primary/10 p-1 rounded-full" /> {item}
                           </li>
                         ))}
                      </ul>
                    </div>
                    <button 
                      onClick={() => checkoutPro()}
                      className="w-full py-5 rounded-2xl bg-pink-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-pink-mid transition-all shadow-lg shadow-pink-primary/20 relative z-10"
                    >
                      Subscrever Agora
                    </button>
                    {/* Payment Methods */}
                    <div className="mt-6 flex flex-col items-center gap-3 opacity-60">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Pagamento Seguro</p>
                      <div className="flex items-center gap-4 text-gray-400">
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
            <section id="faq">
              <SectionTitle 
                subtitle="Dúvidas" 
                title="Perguntas Frequentes" 
                centered 
              />
              <div className="mt-16 flex flex-col gap-4 max-w-3xl mx-auto">
                 {[
                   { q: "Os meus dados estão seguros?", a: "Sim. A Luna utiliza encriptação de ponta a ponta. Nem a nossa equipa tem acesso aos seus dados de saúde individuais. Cumprimos rigorosamente o RGPD." },
                   { q: "Como funciona a Luna IA?", a: "A Luna IA é treinada em literatura médica feminina para responder a dúvidas sobre sintomas e bem-estar, mas não substitui aconselhamento médico profissional." },
                   { q: "Posso cancelar o plano Pro?", a: "Sim, pode cancelar a sua subscrição a qualquer momento nas definições de perfil." },
                   { q: "O Modo Parceiro é privado?", a: "Totalmente. Você escolhe exatamente quais as informações que deseja partilhar." }
                 ].map((item, i) => (
                   <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm text-left">
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full px-8 py-6 flex items-center justify-between gap-4"
                      >
                        <span className="font-bold text-gray-900 text-base">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-gray-50"
                          >
                             <div className="px-8 py-6 text-base text-gray-500 leading-relaxed font-medium">
                                {item.a}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                 ))}
              </div>
            </section>

            {/* Final CTA */}
            <section className="relative overflow-hidden bg-pink-primary rounded-[64px] p-12 sm:p-24 text-white text-center">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_70%)]" />
              <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl mx-auto">
                <Heart className="w-12 h-12 fill-current mb-4" />
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">Chegou a hora de ouvir o seu corpo.</h2>
                <p className="text-xl text-pink-100 font-medium leading-relaxed">
                  Junte-se a milhares de mulheres que escolheram a Luna para monitorizar a sua saúde com dignidade e inteligência.
                </p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-white text-pink-primary px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all"
                >
                  Começar Agora Grátis
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-16 w-full border-t border-gray-100/50 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Logo size="sm" />
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              A sua saúde, o seu ritmo, a sua privacidade. Luna Health © 2026.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Produto</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><a href="#funcionalidades" className="hover:text-pink-primary">Funcionalidades</a></li>
              <li><a href="#precos" className="hover:text-pink-primary">Preços</a></li>
              <li><a href="#ciencia" className="hover:text-pink-primary">Ciência</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Ajuda</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><a href="#faq" className="hover:text-pink-primary">FAQ</a></li>
              <li><a href="#" className="hover:text-pink-primary">Suporte</a></li>
              <li><a href="#" className="hover:text-pink-primary">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><a href="#" className="hover:text-pink-primary">Privacidade</a></li>
              <li><a href="#" className="hover:text-pink-primary">Termos</a></li>
              <li><a href="#" className="hover:text-pink-primary">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-gray-50">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Designed by Antigravity AI.</p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:border-pink-200 transition-colors cursor-pointer">
                <Heart className="w-3 h-3 text-pink-primary" />
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


