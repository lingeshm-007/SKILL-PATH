import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  LayoutDashboard, 
  Target, 
  Map, 
  FileQuestion, 
  MessageSquare, 
  User,
  Users,
  Key,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TopNav() {
  const { 
    profile, 
    activeTab, 
    setActiveTab, 
    resetDemo, 
    logout,
    setIsMentorDrawerOpen,
    setIsLoginModalOpen,
    mentorMessages,
    triggerToast 
  } = useApp();

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keyStatus, setKeyStatus] = useState(null);
  const [savingKey, setSavingKey] = useState(false);

  useEffect(() => {
    fetch('/api/settings/api-key')
      .then(res => res.json())
      .then(data => setKeyStatus(data))
      .catch(() => {});
  }, []);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    setSavingKey(true);
    try {
      const res = await fetch('/api/settings/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(data.message, 'success');
        setShowKeyModal(false);
        setKeyStatus(prev => ({ ...prev, configured: !!apiKeyInput, provider: data.provider }));
      }
    } catch (err) {
      triggerToast('Failed to save API key', 'error');
    } finally {
      setSavingKey(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis', label: 'Skill Gap', icon: Target },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'quiz', label: 'Assessments', icon: FileQuestion },
    { id: 'resume', label: 'Resume AI', icon: FileText },
    { id: 'mentor', label: 'Flash Pro', icon: MessageSquare, badge: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <header role="banner" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* Left: Brand - Clean typography, zero clipping */}
            <div className="flex items-center shrink-0">
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className="flex items-center text-left group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg"
                title="SkillPath AI - Return to Dashboard"
                aria-label="SkillPath AI Home - Return to Dashboard"
              >
                <div className="flex items-baseline gap-1 whitespace-nowrap">
                  <span className="font-black text-slate-900 text-xl sm:text-2xl tracking-tight">
                    SkillPath
                  </span>
                  <span className="font-black text-indigo-600 text-xl sm:text-2xl tracking-tight">
                    AI
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Navigation Tabs (Desktop only) */}
            <nav role="navigation" aria-label="Desktop Primary Navigation" className="hidden md:flex items-center space-x-1 shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Go to ${item.label}`}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} aria-hidden="true" />
                    <span>{item.label}</span>

                    {item.badge && mentorMessages.length > 1 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" aria-hidden="true"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions - Mobile Adaptive */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Optional AI Key Config (compact on desktop) */}
              <button
                onClick={() => setShowKeyModal(true)}
                aria-label="Configure Live AI Model API Key"
                className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none ${
                  keyStatus?.configured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
                title="Configure Live Claude / Gemini / OpenAI Key"
              >
                <Key className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{keyStatus?.configured ? 'Live AI' : 'AI Key'}</span>
              </button>

              {/* Launch Flash Pro AI Mentor */}
              <button
                onClick={() => setIsMentorDrawerOpen(true)}
                aria-label="Ask Flash Pro AI Mentor Assistant"
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-300 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
                title="Ask Flash Pro AI Mentor"
              >
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" aria-hidden="true" />
                <span className="hidden xs:inline">Flash Pro</span>
              </button>

              {/* Active Student Profile Pill or Sign In Button */}
              {profile ? (
                <div className="relative shrink-0">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    aria-expanded={showUserDropdown}
                    aria-haspopup="true"
                    aria-label={`Student account options for ${profile?.name || 'Student'}`}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1.5 sm:pr-2.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                      {profile?.avatar ? (
                        <img src={profile.avatar} alt={`Avatar for ${profile.name}`} className="w-full h-full object-cover" />
                      ) : (
                        profile?.name ? profile.name.charAt(0) : 'L'
                      )}
                    </div>
                    <div className="text-left hidden md:block max-w-[110px] truncate">
                      <p className="text-xs font-bold text-slate-800 leading-none truncate">{profile?.name || 'Student'}</p>
                      <p className="text-[10px] text-slate-500 leading-none mt-0.5 truncate">{profile?.targetCareer || 'Career Goal'}</p>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div role="menu" aria-label="Student Account Menu" className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-2xs">
                          {profile?.avatar ? (
                            <img src={profile.avatar} alt={`Avatar for ${profile.name}`} className="w-full h-full object-cover" />
                          ) : (
                            profile?.name?.charAt(0) || 'L'
                          )}
                        </div>
                        <div className="overflow-hidden min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{profile?.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{profile?.email || 'student@gmail.com'}</p>
                          <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 truncate">
                            {profile?.targetCareer}
                          </span>
                        </div>
                      </div>

                      <button
                        role="menuitem"
                        onClick={() => {
                          setShowUserDropdown(false);
                          setActiveTab('profile');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-500" aria-hidden="true" />
                        <span>Edit Profile &amp; Picture</span>
                      </button>

                      <button
                        role="menuitem"
                        onClick={() => {
                          setShowUserDropdown(false);
                          setShowKeyModal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Key className="w-4 h-4 text-amber-500" aria-hidden="true" />
                        <span>Configure Live AI Key</span>
                      </button>

                      <button
                        role="menuitem"
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" aria-hidden="true" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  aria-label="Sign In to Student Account"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-300 transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
                >
                  <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Sign In</span>
                </button>
              )}
              </div>

            </div>

          {/* Mobile Navigation Row */}
          <nav role="navigation" aria-label="Mobile Category Carousel" className="md:hidden flex items-center justify-start gap-2 py-2.5 px-3.5 border-t border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Switch to ${item.label}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </header>

      {/* AI Key Configuration Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">AI Model Settings</h3>
                  <p className="text-[11px] text-slate-500">Claude Sonnet 4-6 / Gemini / OpenAI</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              SkillPath AI runs with an intelligent built-in conversational brain. To connect external LLMs, paste your API key below:
            </p>

            <form onSubmit={handleSaveKey} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  API Key (Claude, Gemini, or OpenAI)
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="e.g. sk-ant-... or AIzaSy..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {keyStatus?.configured && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live provider connected: <strong>{keyStatus.provider}</strong></span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingKey}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  {savingKey ? 'Saving...' : 'Save & Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
