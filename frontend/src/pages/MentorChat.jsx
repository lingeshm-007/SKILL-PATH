import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Layers, 
  CheckCircle2, 
  RotateCcw,
  Target,
  Code2,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import FormattedChatMessage from '../components/FormattedChatMessage';

export default function MentorChat() {
  const { 
    profile, 
    analysis, 
    roadmap, 
    stats, 
    mentorMessages, 
    setMentorMessages, 
    refreshData,
    triggerToast 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mentorMessages]);

  const handleSend = async (customText = null) => {
    const text = customText || inputMessage;
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
      triggerToast('Failed to connect to Flash Pro', 'error');
    } finally {
      setSending(false);
    }
  };

  const sampleTriggers = [
    { label: '🚀 Explain how to start web development', prompt: 'I dont know anything, how should I start web development from scratch?' },
    { label: '⚡ Write code for an Express API', prompt: 'Write a complete Node.js Express server code with GET and POST endpoints' },
    { label: '⚛️ Explain React components simply', prompt: 'Explain how React components and useState work with a code example' },
    { label: '🎯 Interview Preparation Guide', prompt: 'How do I prepare for Full Stack Developer technical interviews?' },
  ];

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* Left: Chat Window */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-slate-900">Flash Pro</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-md">
                  ChatGPT-Style AI Mentor
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ask anything: code generation, debugging, conceptual explanations, or career guidance
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Flash Pro Online
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {mentorMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {msg.badge && (
                  <span className="mb-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {msg.badge}
                  </span>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <FormattedChatMessage text={msg.content} isUser={isUser} />
                  <span
                    className={`block text-[10px] mt-2.5 border-t pt-1.5 ${
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
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl w-fit text-slate-600 text-xs font-medium">
              <Zap className="w-4 h-4 animate-spin text-amber-500" />
              <span>Flash Pro is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Try Prompts:</span>
          {sampleTriggers.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(t.prompt)}
              className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors shrink-0"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Flash Pro anything (e.g. 'Write a React counter', 'What is Express?')..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Right: Injected Context Inspector */}
      <div className="w-full lg:w-80 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between overflow-y-auto space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Injected Context Inspector</h3>
              <p className="text-[10px] text-slate-400">Live memory injected into Flash Pro</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <span className="font-bold text-slate-700">Learner Profile:</span>
            <p className="text-slate-600">{profile?.name || 'Lingesh'}</p>
            <span className="font-bold text-slate-700 block pt-1">Active Career Goal:</span>
            <p className="text-indigo-600 font-bold">{profile?.targetCareer || 'Full Stack Developer'}</p>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-700 block">Identified Gaps:</span>
            <div className="flex flex-wrap gap-1">
              {(analysis?.gaps || []).map((gap) => (
                <span key={gap} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                  {gap}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-[11px] space-y-1 text-slate-700">
            <span className="font-bold text-indigo-900 block">Flash Pro AI Capabilities:</span>
            <p>• Code generation &amp; syntax explanations</p>
            <p>• Step-by-step beginner mentoring</p>
            <p>• Live roadmap adaptation &amp; career guidance</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono text-center">
          Flash Pro Memory Synchronized
        </div>
      </div>

    </div>
  );
}
