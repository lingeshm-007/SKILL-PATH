import React from 'react';
import { 
  Home, 
  Map, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  User, 
  Compass,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, profile, mentorMessages } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'analysis', label: 'Skill Gap', icon: Sparkles },
    { id: 'mentor', label: 'AI Mentor', icon: MessageSquare, badge: true },
    { id: 'onboarding', label: 'New Onboarding', icon: Compass },
    { id: 'profile', label: 'Profile & Goals', icon: User },
  ];

  return (
    <aside className="w-20 md:w-24 bg-[#181824] flex flex-col items-center py-6 justify-between select-none shrink-0 border-r border-slate-800/80">
      {/* Top Logo */}
      <div className="flex flex-col items-center space-y-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#C084FC] flex items-center justify-center shadow-lg shadow-purple-600/40 hover:scale-105 transition-transform duration-200"
          title="SkillPath AI"
        >
          <div className="w-5 h-5 border-2 border-white rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </button>
        <span className="text-[10px] font-bold tracking-wider text-purple-300 uppercase">SkillPath</span>
      </div>

      {/* Middle Navigation Icons */}
      <nav className="flex flex-col items-center space-y-4 my-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative group w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-[#7C3AED] text-white shadow-lg shadow-purple-600/40'
                  : 'text-slate-400 hover:text-white hover:bg-[#252538]'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

              {/* Red dot badge for mentor updates */}
              {item.badge && mentorMessages.length > 1 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-[#181824] animate-pulse"></span>
              )}

              {/* Tooltip on hover */}
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Avatar */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={() => setActiveTab('profile')}
          className="relative group focus:outline-none"
          title={profile?.name || 'User Profile'}
        >
          <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-pink-500 hover:ring-2 hover:ring-purple-400 transition-all">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${profile?.name || 'Lingesh'}`}
              alt="Avatar"
              className="w-full h-full rounded-full bg-slate-800 object-cover"
            />
          </div>
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#181824] rounded-full"></span>

          {/* Hover popup with name */}
          <div className="absolute bottom-2 left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            <p className="font-semibold">{profile?.name || 'Lingesh'}</p>
            <p className="text-[10px] text-purple-300">{profile?.targetCareer || 'Full Stack Dev'}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

