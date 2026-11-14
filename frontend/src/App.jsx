import React from 'react';
import { useApp } from './context/AppContext';
import TopNav from './components/TopNav';
import LoginModal from './components/LoginModal';
import FloatingMentorWidget from './components/FloatingMentorWidget';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Quiz from './pages/Quiz';
import MentorChat from './pages/MentorChat';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import SkillAnalysis from './pages/SkillAnalysis';
import ResumeBuilder from './pages/ResumeBuilder';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const { activeTab, notificationToast } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analysis':
        return <SkillAnalysis />;
      case 'roadmap':
        return <Roadmap />;
      case 'quiz':
        return <Quiz />;
      case 'resume':
        return <ResumeBuilder />;
      case 'mentor':
        return <MentorChat />;
      case 'onboarding':
        return <Onboarding />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col w-full overflow-x-hidden pb-16 md:pb-0">
      {/* Accessible Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-xl outline-none ring-2 ring-white"
      >
        Skip to main content
      </a>

      {/* Toast Notification Banner with Accessibility Live Region */}
      {notificationToast && (
        <div 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-5 sm:top-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          {notificationToast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          ) : notificationToast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="w-5 h-5 text-indigo-400 shrink-0" aria-hidden="true" />
          )}
          <span className="text-xs font-semibold">{notificationToast.message}</span>
        </div>
      )}

      {/* Top Navigation Bar with Multi-Student Switcher */}
      <TopNav />

      {/* Main Full-Width Content Container with Semantic Landmark */}
      <main id="main-content" role="main" tabIndex="-1" className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 overflow-x-hidden focus:outline-none">
        {renderActiveScreen()}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav role="navigation" aria-label="Mobile Bottom Navigation" className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-2 py-1 flex items-center justify-around shadow-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
          { id: 'roadmap', label: 'Roadmap', icon: 'Map' },
          { id: 'resume', label: 'Resume', icon: 'FileText' },
          { id: 'mentor', label: 'Flash Pro', icon: 'MessageSquare' },
          { id: 'profile', label: 'Profile', icon: 'User' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={`Navigate to ${tab.label}`}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`text-[10px] ${isActive ? 'font-black scale-105' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-0.5" aria-hidden="true"></span>}
            </button>
          );
        })}
      </nav>

      {/* Clean Footer with Semantic Landmark */}
      <footer role="contentinfo" className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SkillPath AI</span>
            <span>• Multi-Student Personalized Career Accelerator</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Role-Specific AI Dashboards</span>
            <span>•</span>
            <span>Claude Sonnet 4-6 Swarm</span>
            <span>•</span>
            <span>Google Login Supported</span>
          </div>
        </div>
      </footer>

      {/* Multi-Student Login / Persona Switcher Modal */}
      <LoginModal />

      {/* Persistent AI Mentor Widget */}
      <FloatingMentorWidget />
    </div>
  );
}
