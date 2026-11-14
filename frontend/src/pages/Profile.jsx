import React, { useState, useRef } from 'react';
import { 
  User, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Award, 
  Target, 
  Bot, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { profile, setProfile, refreshData, triggerToast } = useApp();

  const [name, setName] = useState(profile?.name || 'Lingesh');
  const [currentSkills, setCurrentSkills] = useState(profile?.currentSkills || ['Python', 'SQL', 'HTML']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [certifications, setCertifications] = useState(profile?.certifications || '');
  const [projects, setProjects] = useState(profile?.projects || '');
  const [targetCareer, setTargetCareer] = useState(profile?.targetCareer || 'Full Stack Developer');
  const [avatar, setAvatar] = useState(profile?.avatar || '');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [adaptiveNotice, setAdaptiveNotice] = useState(null);

  const fileInputRef = useRef(null);

  const careerOptions = [
    'Full Stack Developer',
    'AI Engineer',
    'Data Scientist',
    'Cybersecurity Analyst',
    'Cloud Architect',
  ];

  const presetAvatars = [
    { id: 'av-1', name: 'Developer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { id: 'av-2', name: 'Engineer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'av-3', name: 'Analyst', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { id: 'av-4', name: 'Coder', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { id: 'av-5', name: 'AI Scholar', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { id: 'av-6', name: 'Tech Lead', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
    { id: 'av-7', name: 'Bot/AI', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=SkillPathAI' },
    { id: 'av-8', name: 'Avataaars', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LingeshTech' },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast('Please select a valid image file (JPG, PNG, WebP)', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Image is larger than 5MB. Please choose a smaller file.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatar(dataUrl);
      triggerToast('Profile picture loaded! Click "Save Profile & Update Swarm" to save.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (customUrlInput.trim()) {
      setAvatar(customUrlInput.trim());
      setCustomUrlInput('');
      triggerToast('Image URL applied! Click "Save Profile & Update Swarm" to save.', 'info');
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    triggerToast('Profile picture removed (reverted to initials).', 'info');
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !currentSkills.includes(newSkillInput.trim())) {
      setCurrentSkills([...currentSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setCurrentSkills(currentSkills.filter(s => s !== skill));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAdaptiveNotice(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          currentSkills,
          certifications,
          projects,
          targetCareer,
          avatar,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        await refreshData();

        if (data.careerChanged) {
          setAdaptiveNotice({
            message: `I noticed you changed your goal to ${targetCareer}. Let me regenerate your roadmap.`,
            newGoal: targetCareer,
          });
          triggerToast(`Career goal switched to ${targetCareer}! Agents re-analyzed roadmap.`, 'success');
        } else {
          triggerToast('Profile and picture updated successfully!', 'success');
        }
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      triggerToast('Error saving profile changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center font-black text-2xl shadow-sm border-2 border-white ring-2 ring-slate-100 overflow-hidden shrink-0">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                name ? name.charAt(0) : 'L'
              )}
            </div>
            {/* Quick Upload Button on avatar */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 border-2 border-white"
              title="Upload New Profile Picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{name}</h1>
            <p className="text-xs text-indigo-600 font-bold mt-0.5">{targetCareer}</p>
            <p className="text-[11px] text-slate-400">Profile ID: {profile?.id || 'user-lingesh-1'}</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active Profile
        </span>
      </div>

      {/* Adaptive Change Notification Banner */}
      {adaptiveNotice && (
        <div className="p-4 rounded-xl bg-indigo-900 text-white shadow-sm flex items-start gap-3 animate-in fade-in">
          <Bot className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Mentor Agent Triggered (Autonomous Adaptive Swarm)
            </p>
            <p className="text-sm font-semibold mt-0.5">
              "{adaptiveNotice.message}"
            </p>
            <p className="text-xs text-indigo-200 mt-1">
              Agent 1 (Skill Analyzer) and Agent 3 (Learning Curator) have recalculated your skills matrix and repopulated your roadmap.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Profile Picture Upload Section */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-600" />
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Profile Picture
              </label>
            </div>
            {avatar && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Option A: Upload from Device */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Upload from Device</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold text-indigo-700 flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <Upload className="w-4 h-4" />
                <span>Choose Image (PNG, JPG, WebP)</span>
              </button>
            </div>

            {/* Option B: Custom Image URL */}
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Or Paste Image URL</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Option C: Preset Developer Avatars */}
          <div className="pt-2 border-t border-slate-200/80">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Or Choose a Preset Developer Avatar
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {presetAvatars.map((preset) => {
                const isSelected = avatar === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setAvatar(preset.url);
                      triggerToast(`Selected ${preset.name} avatar!`, 'info');
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-300 hover:scale-105'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center text-white">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Learner Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          {/* Target Career Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Target Career Goal
            </label>
            <select
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              className="w-full px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {careerOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 block mt-1">
              Switching this triggers automatic roadmap regeneration via Agent 1 &amp; Agent 3.
            </span>
          </div>
        </div>

        {/* Current Skills Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Verified Skills
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px] mb-3">
            {currentSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-indigo-200 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add skill..."
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100"
            >
              + Add Skill
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Certifications
          </label>
          <input
            type="text"
            value={certifications}
            onChange={(e) => setCertifications(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Projects */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Projects Portfolio
          </label>
          <textarea
            rows={3}
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Synchronizing with Agent Swarm...' : 'Save Profile & Update Swarm'}</span>
          </button>
        </div>
      </form>

    </div>
  );
}