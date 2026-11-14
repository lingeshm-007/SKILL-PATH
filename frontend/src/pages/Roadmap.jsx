import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Award, 
  Sparkles, 
  BookOpen,
  AlertTriangle,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Roadmap() {
  const { 
    roadmap, 
    stats, 
    profile, 
    setActiveQuizSkill, 
    setActiveTab 
  } = useApp();

  const handleStartQuiz = (step) => {
    setActiveQuizSkill(step.skill);
    setActiveTab('quiz');
  };

  const completedCount = (roadmap || []).filter(r => r.completed).length;
  const totalCount = (roadmap || []).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
              Agent 3: Learning Curator
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Sequential Step-by-Step Curriculum</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Personalized Learning Roadmap
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Engineered for <strong className="text-slate-800">{profile?.name || 'Lingesh'}</strong> to bridge competency gaps for <strong className="text-indigo-600">{profile?.targetCareer || 'Full Stack Developer'}</strong>
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>Overall Roadmap Progress</span>
            <span className="text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-1">
            <div 
              style={{ width: `${progressPercent}%` }} 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {completedCount} of {totalCount} competencies verified
          </p>
        </div>
      </div>

      {/* Ordered Steps Timeline */}
      <div className="space-y-4">
        {(roadmap || []).map((step, idx) => {
          const isRemediation = step.isRemediation;
          return (
            <div
              key={step.id || idx}
              className={`rounded-2xl p-6 border transition-all ${
                isRemediation
                  ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                  : step.completed
                  ? 'bg-white border-emerald-200 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Step Info */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-slate-100 text-slate-800">
                      Step {idx + 1}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                      {step.skill}
                    </span>

                    {isRemediation && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-200 text-amber-900 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Adaptive Remediation Booster (Triggered by Quiz Failure)
                      </span>
                    )}

                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {step.duration}
                    </span>

                    <span className="text-xs text-slate-400 font-medium">
                      • {step.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {step.course}
                  </h3>

                  <p className="text-xs text-slate-600">
                    Platform: <strong className="text-slate-800">{step.platform}</strong>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <a
                    href={step.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Launch Resource</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {step.completed ? (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Verified ({step.quizScore || 'Pass'})
                      </span>
                      <button
                        onClick={() => handleStartQuiz(step)}
                        className="text-xs text-slate-400 hover:text-indigo-600 underline"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartQuiz(step)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-200 flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Award className="w-4 h-4" />
                      <span>Take Quiz &amp; Mark Complete</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
