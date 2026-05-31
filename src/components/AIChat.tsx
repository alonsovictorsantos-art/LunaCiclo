import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User as UserIcon, Loader2, Info, RefreshCcw, History, Trash2, ChevronLeft, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, UserProfile, CycleLog, Message, AIChatSession } from '../types';
import { chatWithLuna } from '../lib/gemini';
import { dbService } from '../services/dbService';
import { t } from '../lib/i18n';

interface AIChatProps {
  user: User;
  profile: UserProfile;
  logs: CycleLog[];
}

export default function AIChat({ user, profile, logs }: AIChatProps) {
  const getInitialMessage = () => {
    const name = user.nickname || user.name.split(' ')[0];
    if (user.nickname) {
      return t('chatWelcome', profile.language).replace('{name}', name);
    }
    return t('chatWelcomeNoNickname', profile.language).replace('{name}', name);
  };

  const [currentSessionId, setCurrentSessionId] = useState<string>(crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: getInitialMessage() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<AIChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = dbService.subscribeToAIChats(user.id, (chats) => {
      setHistory(chats);
    });
    return () => unsubscribe();
  }, [user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    // Prepare context
    const today = new Date().toLocaleDateString('pt-AO', { month: 'short', day: 'numeric' });
    const todayLog = logs.find(l => l.date === today);

    const context = {
      userName: user.name,
      nickname: user.nickname,
      age: profile.age,
      cycleLength: profile.cycleLength,
      periodLength: profile.periodLength,
      currentCycleDay: 16, // Demo day
      todaySymptoms: todayLog?.symptoms || [],
      todayMood: todayLog?.mood || 'Bem',
      language: profile.language
    };

    const historyForAI = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await chatWithLuna(userMessage, historyForAI, context);
    
    const finalMessages: Message[] = [...newMessages, { role: 'model', text: responseText }];
    setMessages(finalMessages);
    setIsTyping(false);

    // Save to Firestore
    dbService.saveAIChat(user.id, {
      id: currentSessionId,
      userId: user.id,
      messages: finalMessages,
      title: userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '')
    });
  };

  const startNewChat = () => {
    setCurrentSessionId(crypto.randomUUID());
    setMessages([{ role: 'model', text: getInitialMessage() }]);
    setShowHistory(false);
  };

  const loadSession = (session: AIChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const deleteSession = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    await dbService.deleteAIChat(user.id, chatId);
    if (currentSessionId === chatId) {
      startNewChat();
    }
  };

  const Suggestion = ({ text }: { text: string }) => (
    <button 
      onClick={() => { setInput(text); }}
      className="px-4 py-2 rounded-full border border-pink-100 bg-pink-50/50 text-xs font-semibold text-pink-700 hover:bg-pink-100 hover:border-pink-200 transition-all whitespace-nowrap shadow-sm"
    >
      {text}
    </button>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-200px)] relative overflow-hidden">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {t('lunaAssistantTitle', profile.language)} <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          </h2>
          <p className="text-gray-400 text-sm">{t('lunaAssistantDesc', profile.language)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-all ${showHistory ? 'bg-pink-primary text-white' : 'text-gray-400 hover:text-pink-primary hover:bg-pink-50'}`}
            title={t('chatHistory', profile.language)}
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={startNewChat}
            className="p-2 text-gray-400 hover:text-pink-primary hover:bg-pink-50 rounded-xl transition-all font-bold"
            title={t('newChat', profile.language)}
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 relative overflow-hidden">
        {/* History Sidebar - Desktop */}
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="absolute md:relative z-20 w-[280px] h-full bg-white rounded-[32px] border border-gray-100 shadow-xl md:shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-sm">{t('chatHistory', profile.language)}</h3>
                <button 
                   onClick={() => setShowHistory(false)}
                   className="md:hidden p-1 hover:bg-gray-50 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {history.length === 0 ? (
                  <div className="text-center py-10">
                    <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('noChats', profile.language)}</p>
                  </div>
                ) : (
                  history.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className={`w-full p-4 rounded-2xl text-left transition-all relative group flex items-center justify-between gap-2 ${
                        currentSessionId === session.id 
                          ? 'bg-pink-50 border border-pink-100' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-xs font-bold truncate ${currentSessionId === session.id ? 'text-pink-700' : 'text-gray-700'}`}>
                          {session.title || t('untitledChat', profile.language)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {session.messages.length} {t('messages', profile.language)}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => deleteSession(e, session.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </button>
                  ))
                )}
              </div>
              <div className="p-4 bg-gray-50/50">
                <button 
                  onClick={startNewChat}
                  className="w-full py-3 rounded-xl bg-pink-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-pink-primary/20 hover:opacity-90 transition-all"
                >
                  {t('continueNewChat', profile.language)}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm flex flex-col transition-colors overflow-hidden">
          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth"
          >
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm ${
                  m.role === 'model' 
                    ? 'bg-pink-light text-pink-primary border border-pink-100' 
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  {m.role === 'model' ? '🌙' : <UserIcon className="w-5 h-5" />}
                </div>
                <div className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 rounded-3xl text-sm leading-relaxed prose prose-sm ${
                  m.role === 'model' 
                    ? 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100 shadow-sm' 
                    : 'bg-pink-primary text-white rounded-tr-none shadow-md shadow-pink-primary/20'
                }`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.text}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-light text-pink-primary flex items-center justify-center text-lg animate-pulse border border-pink-100">🌙</div>
                <div className="bg-gray-50 p-5 rounded-3xl rounded-tl-none border border-gray-100">
                  <div className="flex gap-1.5 px-2">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      className="w-2 h-2 bg-pink-primary/30 rounded-full" 
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                      className="w-2 h-2 bg-pink-primary/30 rounded-full" 
                    />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }} 
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                      className="w-2 h-2 bg-pink-primary/30 rounded-full" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-gray-50 mt-auto bg-gray-50/30">
            <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
              <Suggestion text={t('suggestionCramps', profile.language)} />
              <Suggestion text={t('suggestionFertile', profile.language)} />
              <Suggestion text={t('suggestionSleep', profile.language)} />
              <Suggestion text={t('suggestionBloat', profile.language)} />
              <Suggestion text={t('suggestionMood', profile.language)} />
            </div>

            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t('askLunaPlaceholder', profile.language)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-6 pr-16 text-sm outline-none focus:ring-4 focus:ring-pink-primary/5 focus:border-pink-primary/20 shadow-sm transition-all resize-none max-h-32"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-pink-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-pink-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-300 font-bold uppercase tracking-wider">
              <Info className="w-3 h-3" />
              {t('lunaDisclaimer', profile.language)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

