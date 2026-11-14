import React from 'react';
import { 
  Sparkles, 
  Target, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  Brain,
  Layers,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SkillAnalysis() {
  const { analysis, matching, profile, setActiveQuizSkill, setActiveTab } = useApp();

  const acquired = matching?.userHas || ['Python', 'SQL', 'HTML'];
  const missing = matching?.userMissing || ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'];
  const matchPct = matching?.matchPercentage || 42;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
              Features 2 &amp; 3: Skill Analysis &amp; Career Matching
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Agents 1 &amp; 2 Swarm</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Competency Gap &amp; Career Benchmark Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comparing <strong className="text-slate-800">{profile?.name || 'Lingesh'}</strong>'s skillset against industry requirements for <strong className="text-indigo-600">{profile?.targetCareer || 'Full Stack Developer'}</strong>
          </p>
        </div>

        {/* Match Percentage Pill */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Career Match Score</p>
            <p className="text-3xl font-black text-white">{matchPct}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* 3 Core Skill Analysis Columns (Agent 1 Output) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strengths */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Identified Strengths</span>
          </div>
          <p className="text-xs text-slate-500">Existing foundational skills verified:</p>
          <div className="space-y-2">
            {(analysis?.strengths || ['Foundational knowledge in Python', 'Relational database querying in SQL', 'Basic web document structure in HTML']).map((str, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exact Gaps */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Missing Competency Gaps</span>
          </div>
          <p className="text-xs text-slate-500">Skills required to achieve {profile?.targetCareer}:</p>
          <div className="space-y-2">
            {(analysis?.gaps || missing).map((gap, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-900">{gap}</span>
                <button
                  onClick={() => {
                    setActiveQuizSkill(gap);
                    setActiveTab('quiz');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  Verify in Quiz
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Growth Areas &amp; Weaknesses</span>
          </div>
          <p className="text-xs text-slate-500">Specific engineering blindspots identified:</p>
          <div className="space-y-2">
            {(analysis?.weaknesses || ['Lack of client-side JavaScript execution experience', 'No component lifecycle framework knowledge in React', 'Backend server runtime with Node.js/Express missing']).map((weakness, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-slate-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                <span className="font-medium leading-relaxed">{weakness}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Comparison Table (Agent 2 Output) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Career Role Skill Requirements Table</h2>
            <p className="text-xs text-slate-500">Benchmark breakdown produced by Agent 2 (Career Matcher Agent)</p>
          </div>
          <button
            onClick={() => setActiveTab('roadmap')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Proceed to Learning Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-bold">Role Requirement</th>
                <th className="py-3 px-4 font-bold">Relevance</th>
                <th className="py-3 px-4 font-bold">Learner Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(matching?.requiredSkills || ['HTML', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'SQL']).map((skill) => {
                const hasIt = acquired.some(h => h.toLowerCase() === skill.toLowerCase());
                return (
                  <tr key={skill} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{skill}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">Core Skill</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {hasIt ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Acquired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <XCircle className="w-3.5 h-3.5 text-amber-600" />
                          Missing Gap
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {hasIt ? (
                        <span className="text-[11px] text-slate-400 font-medium">Verified in Profile</span>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveQuizSkill(skill);
                            setActiveTab('quiz');
                          }}
                          className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition-colors"
                        >
                          Verify in Quiz
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
