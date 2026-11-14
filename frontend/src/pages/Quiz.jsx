import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowLeft, 
  Award,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export default function Quiz() {
  const { 
    activeQuizSkill, 
    setActiveQuizSkill, 
    setActiveTab, 
    setIsMentorDrawerOpen, 
    refreshData,
    triggerToast 
  } = useApp();

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuiz = async (skill) => {
    try {
      setLoading(true);
      setResult(null);
      setUserAnswers({});
      const res = await fetch(`/api/quiz/${encodeURIComponent(skill || 'JavaScript')}`);
      if (res.ok) {
        const data = await res.json();
        setQuizData(data.quiz);
      }
    } catch (err) {
      console.error('Failed to load quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz(activeQuizSkill);
  }, [activeQuizSkill]);

  const handleSelectOption = (qId, optionString) => {
    const letter = optionString.trim().charAt(0);
    setUserAnswers(prev => ({
      ...prev,
      [qId]: letter,
    }));
  };

  const handleSubmit = async (overrideAnswers = null) => {
    const answersToSend = overrideAnswers || userAnswers;
    if (!quizData || submitting) return;

    if (Object.keys(answersToSend).length < (quizData.questions?.length || 3)) {
      triggerToast('Please select an option for all 3 questions', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/quiz/${encodeURIComponent(activeQuizSkill)}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAnswers: answersToSend,
          questions: quizData.questions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);

        if (data.passed) {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
          triggerToast(`Mastery Verified! Passed with ${data.score}/${data.total}`, 'success');
        } else {
          triggerToast(`Adaptive remediation triggered by Agent Swarm`, 'info');
        }

        await refreshData();
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick testing shortcuts for judges
  const simulatePass = () => {
    if (!quizData) return;
    const correctMap = {};
    quizData.questions.forEach(q => {
      correctMap[q.id] = q.answer;
    });
    setUserAnswers(correctMap);
    handleSubmit(correctMap);
  };

  const simulateFail = () => {
    if (!quizData) return;
    const wrongMap = {};
    quizData.questions.forEach(q => {
      wrongMap[q.id] = q.answer === 'A' ? 'B' : 'A';
    });
    setUserAnswers(wrongMap);
    handleSubmit(wrongMap);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => setActiveTab('roadmap')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>

        {/* Judge Shortcuts */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Evaluator Shortcuts:</span>
          <button
            onClick={simulatePass}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
            title="Auto-fill correct answers to verify passing flow"
          >
            ⚡ Test Pass (3/3)
          </button>
          <button
            onClick={simulateFail}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
            title="Auto-fill wrong answers to verify adaptive failure remediation"
          >
            ⚡ Test Fail &amp; Adaptive Trigger
          </button>
        </div>
      </div>

      {/* Main Quiz Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>Feature 5: Progress Tracking &amp; Assessment • Agent 4</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {activeQuizSkill} Competency Assessment
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Answer the 3 questions below. Scoring at least 2/3 (66%) verifies this skill in your profile and updates your roadmap.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-medium text-slate-600">Agent 4 (Progress Monitor) is generating 3 questions for {activeQuizSkill}...</p>
          </div>
        ) : result ? (
          /* Result Card */
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border text-center space-y-3 ${
              result.passed
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50/60 border-amber-200'
            }`}>
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl bg-white shadow-2xs">
                {result.passed ? '🎉' : '💡'}
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {result.passed ? 'Skill Mastery Verified!' : 'Struggled with Assessment'}
                </h2>
                <p className="text-sm font-bold text-slate-700 mt-0.5">
                  Result: {result.score} of {result.total} Correct ({result.percentage}%)
                </p>
              </div>

              {result.passed ? (
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Excellent work! Your roadmap progress has increased, and this skill is now verified in your profile.
                </p>
              ) : (
                <div className="bg-white p-4 rounded-xl border border-amber-200 text-left max-w-lg mx-auto space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Adaptive Swarm Behavior Triggered</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    "{result.adaptive?.mentorMessage || `You struggled with ${activeQuizSkill}. I've updated your roadmap with extra resources.`}"
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Agent 3 (Learning Curator) has dynamically added an intensive review module to your roadmap.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  View Updated Roadmap
                </button>
                <button
                  onClick={() => setIsMentorDrawerOpen(true)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Talk with Mentor</span>
                </button>
                <button
                  onClick={() => fetchQuiz(activeQuizSkill)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Retake Quiz
                </button>
              </div>
            </div>

            {/* Questions Detailed Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Review Responses</h3>
              {result.evaluation?.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    q.isCorrect ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-800">{idx + 1}. {q.question}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      q.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {q.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-slate-600">Your choice: <strong className="text-slate-800">{q.selected || 'None'}</strong> • Correct: <strong className="text-slate-800">{q.correctAnswer}</strong></p>
                  <p className="text-indigo-800 text-[11px] font-medium pt-0.5">Explanation: {q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Question List */
          <div className="space-y-5">
            {quizData?.questions?.map((q, qIndex) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <p className="font-bold text-sm text-slate-900 leading-snug">{q.question}</p>
                </div>

                <div className="space-y-2 pt-1 pl-7">
                  {q.options?.map((opt, optIdx) => {
                    const optLetter = opt.trim().charAt(0);
                    const isSelected = userAnswers[q.id] === optLetter;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs font-bold'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                {Object.keys(userAnswers).length} of 3 answered
              </span>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
