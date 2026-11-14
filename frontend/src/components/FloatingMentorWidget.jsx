import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Maximize2, 
  RotateCcw,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import FormattedChatMessage from './FormattedChatMessage';

export default function FloatingMentorWidget() {
  const { 
    isMentorDrawerOpen, 
    setIsMentorDrawerOpen, 
    mentorMessages, 
    setMentorMessages,
    profile,
    refreshData,
    setActiveTab,
    triggerToast
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isMentorDrawerOpen) {
      scrollToBottom();
    }
  }, [mentorMessages, isMentorDrawerOpen]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sending) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMentorMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        setMentorMessages(data.messages || []);
        if (data.roadmap) {
          await refreshData();
        }
      }
    } catch (err) {
      console.error('Error in Flash Pro chat:', err);
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    'Explain how to start web development',
    'What is Express.js and how does it work?',
    'Write code for an Express API server',
    'How do I prepare for Full Stack interviews?',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isMentorDrawerOpen && (
        <button
          onClick={() => setIsMentorDrawerOpen(true)}
          className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-300 transition-all active:scale-95"
          title="Open Flash Pro"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
          </div>
          <div className="text-left pr-1">
            <p className="text-xs font-bold leading-none">Flash Pro</p>
            <p className="text-[10px] text-indigo-200 mt-0.5">AI Copilot</p>
          </div>
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isMentorDrawerOpen && (
        <div className="fixed inset-x-2 sm:inset-x-auto bottom-2 sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[420px] max-w-[calc(100vw-1rem)] h-[85vh] sm:h-[580px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">Flash Pro</h3>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500/30 text-indigo-300 rounded border border-indigo-400/30">
                    ChatGPT-Style Copilot
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  Target: {profile?.targetCareer || 'Full Stack Developer'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsMentorDrawerOpen(false);
                  setActiveTab('mentor');
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMentorDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="bg-indigo-50/80 px-3.5 py-1.5 border-b border-indigo-100 flex items-center justify-between text-[11px] text-indigo-900 font-medium">
            <span>Injected Learner Context: Active</span>
            <span className="font-bold text-indigo-700">Conversational AI Engine</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
            {mentorMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {msg.badge && (
                    <span className="mb-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      {msg.badge}
                    </span>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <FormattedChatMessage text={msg.content} isUser={isUser} />
                    <span
                      className={`block text-[9px] mt-2 border-t pt-1 ${
                        isUser ? 'text-indigo-200 text-right border-indigo-500/30' : 'text-slate-400 border-slate-100'
                      }`}
                    >
                      {msg.timestamp || 'Now'} • {isUser ? 'You' : 'Flash Pro'}
                    </span>
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-1.5">
                <Zap className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Flash Pro is generating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors shrink-0 font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Flash Pro anything (code, concepts, career)..."
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sending}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
