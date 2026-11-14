import React, { useState } from 'react';
import { 
  X, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Brain, 
  Code2, 
  LogIn, 
  Mail, 
  Lock, 
  UserPlus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginModal() {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    loginWithGoogle,
    loginWithEmail,
    triggerToast 
  } = useApp();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetCareer, setTargetCareer] = useState('Full Stack Developer');
  const [customSkills, setCustomSkills] = useState('Python, SQL, HTML');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      triggerToast('Please enter your email address', 'warning');
      return;
    }
    setLoading(true);
    const result = await loginWithEmail(email);
    setLoading(false);
    if (!result?.success) {
      // Suggest registration if not found
      setMode('signup');
    }
  };

  const handleGoogleSignIn = async () => {
    // If an email is typed, use that; otherwise prompt or use primary demo Google ID
    const targetEmail = email.trim() || prompt('Enter your Google Account Email (e.g. yourname@gmail.com):', 'student@gmail.com');
    if (!targetEmail) return;

    setLoading(true);
    await loginWithGoogle({
      email: targetEmail,
      name: name.trim() || targetEmail.split('@')[0],
      targetCareer,
      currentSkills: customSkills.split(',').map(s => s.trim()).filter(Boolean),
    });
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      triggerToast('Please enter your student email', 'warning');
      return;
    }
    setLoading(true);
    const skillsArray = customSkills.split(',').map(s => s.trim()).filter(Boolean);
    await loginWithGoogle({
      email: email.trim(),
      name: name.trim() || email.split('@')[0],
      targetCareer,
      currentSkills: skillsArray.length > 0 ? skillsArray : ['Python', 'SQL', 'HTML'],
    });
    setLoading(false);
  };

  const careerOptions = [
    'Full Stack Developer',
    'AI Engineer',
    'Data Scientist',
    'Cybersecurity Analyst',
    'Cloud Architect',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="login-modal-title"
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Student Authentication
              </span>
            </div>
            <h2 id="login-modal-title" className="text-xl font-black text-slate-900 mt-1">
              {mode === 'signin' ? 'Sign In to SkillPath AI' : 'Create Your Student Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'signin' 
                ? 'Access your private personalized roadmap, quiz history, and Flash Pro AI mentor.' 
                : 'Every student gets a completely distinct, private workspace and custom learning path.'}
            </p>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            aria-label="Close authentication modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* 1-Click Google Sign In Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            aria-label="Continue with Google Authentication"
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-3 transition-all shadow-2xs hover:shadow-xs active:scale-98 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.57H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.43l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.57l4.03 3.15c.95-2.83 3.6-4.97 6.72-4.97z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <hr className="flex-1 border-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Or Use Student Email
          </span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Form: Sign In vs Sign Up */}
        {mode === 'signin' ? (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. lingesh@gmail.com, priya.sharma@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="signin-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-indigo-600 cursor-pointer hover:underline">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-300 transition-all flex items-center justify-center gap-2 active:scale-98 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
            >
              <LogIn className="w-4 h-4" aria-hidden="true" />
              <span>{loading ? 'Authenticating...' : 'Sign In to My Account'}</span>
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                New to SkillPath AI?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-career" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Career Goal
              </label>
              <select
                id="signup-career"
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {careerOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="signup-skills" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Initial Skills (Comma-separated)
              </label>
              <input
                id="signup-skills"
                type="text"
                value={customSkills}
                onChange={(e) => setCustomSkills(e.target.value)}
                placeholder="e.g. Python, SQL, HTML"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-300 transition-all flex items-center justify-center gap-2 active:scale-98 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
            >
              <UserPlus className="w-4 h-4" aria-hidden="true" />
              <span>{loading ? 'Initializing Agent Swarm...' : 'Create Account & Start Learning'}</span>
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );

      </div>
    </div>
  );
}
