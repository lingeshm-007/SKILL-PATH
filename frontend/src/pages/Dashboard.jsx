import React from 'react';
import { 
  Sparkles, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Play, 
  FileText, 
  Award, 
  ExternalLink,
  Bot,
  Brain,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AgentActivityLog from '../components/AgentActivityLog';

export default function Dashboard() {
  const { 
    profile, 
    analysis, 
    matching, 
    roadmap, 
    stats, 
    setActiveTab,
    setActiveQuizSkill,
    refreshData 
  } = useApp();

  const acquiredSkills = matching?.userHas || ['Python', 'SQL', 'HTML'];
  const missingSkills = matching?.userMissing || ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'];
  const matchPct = matching?.matchPercentage || 42;
  const progressPct = stats.progress || 20;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Clean Scenario & Learner Hero Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-4 max-w-full min-w-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0 overflow-hidden ring-2 ring-indigo-100">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile?.name ? profile.name.charAt(0) : 'L'
            )}
          </div>
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Problem Statement Scenario
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                Organizations &amp; Universities Skills Gap Resolver
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
              Learner: {profile?.name || 'Lingesh'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Target Career: <strong className="text-indigo-600 font-bold">{profile?.targetCareer || 'Full Stack Developer'}</strong>. 
              Our multi-agent system identified <strong className="text-slate-800">{acquiredSkills.length} acquired skills</strong> and pinpointed <strong className="text-amber-600">{missingSkills.length} missing competency gaps</strong> to construct your customized learning path.
            </p>

            {/* Quick Skill Tags */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-400 mr-1">Current Skills:</span>
              {acquiredSkills.map((s) => (
                <span key={s} className="px-2.5 py-0.5 sm:py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick CTA Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('roadmap')}
            className="w-full lg:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Follow Learning Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className="w-full lg:w-auto px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Skill Gap Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className="w-full lg:w-auto px-5 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Build ATS Resume</span>
          </button>
        </div>
      </div>

      {/* 2. Four Clean Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Career Match */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500">
            <span>Career Match</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">Agent 2</span>
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{matchPct}%</span>
            <span className="text-[10px] sm:text-xs text-slate-500 truncate">for {profile?.targetCareer || 'Full Stack'}</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
            <div style={{ width: `${matchPct}%` }} className="h-full bg-indigo-600 rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Metric 2: Skills Identified */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500">
            <span>Competencies</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">Agent 1</span>
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{acquiredSkills.length}</span>
            <span className="text-[10px] sm:text-xs text-slate-500">Acquired / <strong className="text-amber-600">{missingSkills.length} Gaps</strong></span>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate">{matching?.requiredSkills?.length || 8} core skills</p>
        </div>

        {/* Metric 3: Roadmap Progress */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500">
            <span>Progress</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-pink-50 text-pink-700 text-[10px] font-bold">Agent 3</span>
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{progressPct}%</span>
            <span className="text-[10px] sm:text-xs text-slate-500">Done</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
            <div style={{ width: `${progressPct}%` }} className="h-full bg-pink-500 rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Metric 4: Assessment Performance */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500">
            <span>Quiz Rate</span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Agent 4</span>
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{stats.quizAccuracy || 90}%</span>
            <span className="text-[10px] sm:text-xs text-slate-500">Accuracy</span>
          </div>
          <p className="text-[10px] sm:text-xs text-emerald-600 font-semibold flex items-center gap-1 truncate">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            Verified by Agent 4
          </p>
        </div>
      </div>

      {/* 3. Core Comparison Grid: Career Matching vs Skill Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Career Matching & Skills Gap Table (Feature 3) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Feature 3: Career Matching Comparison</span>
              </h2>
              <p className="text-xs text-slate-500">
                Current skills compared against <strong>{profile?.targetCareer || 'Full Stack Developer'}</strong> standards
              </p>
            </div>
            <button
              onClick={() => setActiveTab('analysis')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Details →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {(matching?.requiredSkills || ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'SQL']).map((skill) => {
              const hasIt = acquiredSkills.some(h => h.toLowerCase() === skill.toLowerCase());
              return (
                <div key={skill} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {hasIt ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-800">{skill}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasIt ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Acquired
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveQuizSkill(skill);
                          setActiveTab('quiz');
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors flex items-center gap-1"
                      >
                        <span>Missing Gap</span>
                        <span className="text-amber-600 font-extrabold">• Take Quiz</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Skill Analysis Dashboard (Feature 2) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Feature 2: Skill Analysis (Strengths &amp; Weaknesses)</span>
              </h2>
              <p className="text-xs text-slate-500">Generated by Agent 1 (Skill Analyzer Agent)</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">JSON Engine</span>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Identified Strengths</span>
            </span>
            <div className="space-y-1.5">
              {(analysis?.strengths || ['Foundational knowledge in Python', 'Relational database proficiency in SQL', 'Basic document structure in HTML']).map((str, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Identified Weaknesses &amp; Gaps</span>
            </span>
            <div className="space-y-1.5">
              {(analysis?.weaknesses || ['Lack of client-side scripting in JavaScript', 'No hands-on component framework experience with React', 'Backend server runtime with Node.js/Express missing']).map((wk, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{wk}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. Feature 4: Learning Recommendations & Roadmap Preview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Feature 4: Curated Learning Roadmap Steps</span>
            </h2>
            <p className="text-xs text-slate-500">
              Personalized courses for each missing skill recommended by Agent 3 (Learning Curator)
            </p>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Interactive Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(roadmap || []).slice(0, 3).map((item, index) => (
            <div
              key={item.id || index}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                item.completed
                  ? 'bg-slate-50 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    Step {index + 1}: {item.skill}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.duration}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 line-clamp-2">
                  {item.course}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Platform: <strong>{item.platform}</strong></p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Learn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {item.completed ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setActiveQuizSkill(item.skill);
                      setActiveTab('quiz');
                    }}
                    className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                  >
                    Take Quiz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Live Agent Collaboration Feed (Crucial Judging Requirement) */}
      <AgentActivityLog />

    </div>
  );
}
