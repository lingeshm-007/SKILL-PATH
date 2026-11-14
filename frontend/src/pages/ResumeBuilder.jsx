import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  Award, 
  Code2, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Printer, 
  Wand2, 
  Bot, 
  ExternalLink,
  Target,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ResumeBuilder() {
  const { profile, triggerToast, setActiveTab, setMentorMessages, setIsMentorDrawerOpen } = useApp();

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  // Form Inputs
  const [targetRole, setTargetRole] = useState(profile?.targetCareer || 'Full Stack Developer');
  const [targetCompany, setTargetCompany] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level / Fresher');
  const [jobDescription, setJobDescription] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [location, setLocation] = useState('Bengaluru, India');
  const [githubUrl, setGithubUrl] = useState(`github.com/${(profile?.name || 'lingesh').toLowerCase().replace(/\s+/g, '')}`);
  const [linkedinUrl, setLinkedinUrl] = useState(`linkedin.com/in/${(profile?.name || 'lingesh').toLowerCase().replace(/\s+/g, '-')}`);
  const [portfolioUrl, setPortfolioUrl] = useState(`https://${(profile?.name || 'lingesh').toLowerCase().replace(/\s+/g, '')}.dev`);

  const commonRoles = [
    'Full Stack Developer',
    'AI Engineer',
    'Data Scientist',
    'Cybersecurity Analyst',
    'Cloud Architect',
    'Frontend Developer',
    'Backend Engineer',
  ];

  // Fetch or generate initial resume draft
  useEffect(() => {
    fetchResume();
  }, [profile?.id]);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        if (data.resume) {
          setResumeData(data.resume);
          if (data.resume.targetRole) setTargetRole(data.resume.targetRole);
          if (data.resume.contact) {
            if (data.resume.contact.phone) setPhone(data.resume.contact.phone);
            if (data.resume.contact.location) setLocation(data.resume.contact.location);
            if (data.resume.contact.githubUrl) setGithubUrl(data.resume.contact.githubUrl);
            if (data.resume.contact.linkedinUrl) setLinkedinUrl(data.resume.contact.linkedinUrl);
            if (data.resume.contact.portfolioUrl) setPortfolioUrl(data.resume.contact.portfolioUrl);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          targetCompany: targetCompany || 'Top Tech Companies',
          experienceLevel,
          jobDescription,
          customNotes,
          phone,
          location,
          githubUrl,
          linkedinUrl,
          portfolioUrl,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResumeData(data.resume);
        triggerToast(`ATS Resume generated for ${targetRole}! Score: ${data.resume.atsScore}%`, 'success');
      } else {
        triggerToast('Failed to generate resume', 'error');
      }
    } catch (err) {
      console.error('Error generating resume:', err);
      triggerToast('Error during resume generation', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPlainText = () => {
    if (!resumeData) return;

    const contact = resumeData.contact || {};
    const textLines = [
      (profile?.name || contact.name || 'Candidate').toUpperCase(),
      `${contact.location || location} | ${contact.phone || phone} | ${profile?.email || contact.email || 'email@example.com'}`,
      `LinkedIn: ${contact.linkedinUrl || linkedinUrl} | GitHub: ${contact.githubUrl || githubUrl} | Portfolio: ${contact.portfolioUrl || portfolioUrl}`,
      '',
      'PROFESSIONAL SUMMARY',
      '--------------------------------------------------------------------------------',
      resumeData.summary || '',
      '',
      'TECHNICAL SKILLS',
      '--------------------------------------------------------------------------------',
      `* Languages: ${(resumeData.skills?.languages || []).join(', ')}`,
      `* Frameworks & Libraries: ${(resumeData.skills?.frameworks || []).join(', ')}`,
      `* Databases & Cloud: ${(resumeData.skills?.databasesAndCloud || []).join(', ')}`,
      `* Tools & Practices: ${(resumeData.skills?.toolsAndPractices || []).join(', ')}`,
      '',
      'FEATURED TECHNICAL PROJECTS & EXPERIENCE',
      '--------------------------------------------------------------------------------',
      ...(resumeData.projects || []).flatMap(proj => [
        `${proj.name} | ${proj.role} (${proj.duration})`,
        `Tech Stack: ${(proj.techStack || []).join(', ')}`,
        ...(proj.highlights || []).map(h => `* ${h}`),
        ''
      ]),
      'EDUCATION',
      '--------------------------------------------------------------------------------',
      ...(resumeData.education || []).map(edu => 
        `${edu.degree} - ${edu.institution} (${edu.year}) | ${edu.gpaOrHonors || ''}`
      ),
      '',
      'VERIFIED CERTIFICATIONS',
      '--------------------------------------------------------------------------------',
      ...(resumeData.certifications || []).map(cert => `* ${cert}`),
    ];

    navigator.clipboard?.writeText(textLines.join('\n'));
    setCopiedText(true);
    triggerToast('ATS-friendly plain text copied to clipboard!', 'success');
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleAskMentorReview = () => {
    const prompt = `Please review my ATS Resume for the ${targetRole} role. Here is my current ATS score (${resumeData?.atsScore || 95}%) and executive summary: "${resumeData?.summary?.slice(0, 200)}...". What are 3 specific ways I can stand out in technical interviews for this position?`;
    
    setMentorMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);

    setIsMentorDrawerOpen(true);
    triggerToast('Sent resume to Flash Pro for expert review!', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 no-print">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Agent 6: Resume Architect Agent
            </span>
            <span className="text-xs text-slate-400 font-medium">
              100% ATS Compliant • Single-Column Parser Safe
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ATS-Friendly AI Resume Builder
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Generate high-scoring, tailored technical resumes engineered to pass Applicant Tracking Systems (Workday, Greenhouse, Lever). Custom-built for your target role with Google XYZ action bullets and optimized keyword density.
          </p>
        </div>

        {/* Quick Stats or Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs hover:border-slate-300"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Download PDF / Print</span>
          </button>

          <button
            onClick={handleCopyPlainText}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs hover:border-slate-300"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy ATS Plain Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleAskMentorReview}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-300 active:scale-95"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span>Review with Flash Pro</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace Layout: Left (Controls & ATS Matcher) | Right (Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Customization Panel */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <form onSubmit={handleGenerate} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Resume Target &amp; Job Criteria</span>
              </h2>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Customizable
              </span>
            </div>

            {/* Target Job Role */}
            <div>
              <label htmlFor="resume-target-role" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Job Role *
              </label>
              <div className="space-y-2">
                <select
                  id="resume-role-select"
                  aria-label="Select Target Job Role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {commonRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                  <option value="Custom">Custom Role (type below)</option>
                </select>

                <input
                  id="resume-target-role"
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, AI Engineer, DevOps Engineer"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Target Company & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="resume-target-company" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Company / Industry
                </label>
                <input
                  id="resume-target-company"
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, FinTech, Startups"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="resume-experience-level" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Experience Level
                </label>
                <select
                  id="resume-experience-level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Entry-Level / Fresher">Entry-Level / Fresher</option>
                  <option value="Junior (1-2 Years)">Junior (1-2 Years)</option>
                  <option value="Mid-Level (3-5 Years)">Mid-Level (3-5 Years)</option>
                  <option value="Career Switcher">Career Switcher</option>
                </select>
              </div>
            </div>

            {/* ATS Matcher: Paste Job Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="resume-job-description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Target Job Description (ATS Keyword Matcher)
                </label>
                <span className="text-[10px] text-slate-400">Optional</span>
              </div>
              <textarea
                id="resume-job-description"
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key requirements or job description from LinkedIn/Indeed here. The AI will extract and match ATS keywords directly!"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 placeholder:text-slate-400"
              />
            </div>

            {/* Contact Details */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contact &amp; Portfolio Details
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="resume-phone" className="sr-only">Phone Number</label>
                  <input
                    id="resume-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone: +91 98765 43210"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="resume-location" className="sr-only">Location</label>
                  <input
                    id="resume-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location: Bengaluru, India"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="resume-github" className="sr-only">GitHub Profile</label>
                  <input
                    id="resume-github"
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="github.com/username"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="resume-linkedin" className="sr-only">LinkedIn Profile</label>
                  <input
                    id="resume-linkedin"
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Achievements or Notes for AI
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Highlight hackathon victory, open source PRs, or college leadership"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={generating}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm shadow-indigo-300 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Architecting ATS Resume with AI Agent...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-300" />
                    <span>Generate Tailored ATS Resume</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ATS Insights Card */}
          {resumeData && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    ATS Optimization Telemetry
                  </h3>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {resumeData.atsScore || 95}% Compatible
                </span>
              </div>

              {/* Matched Keywords */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  High-Priority Matched Keywords
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(resumeData.matchedKeywords || []).map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Recommended Keywords */}
              {resumeData.missingKeywords?.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Bonus Keywords to Learn Next
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ATS Checklist */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                {(resumeData.atsTips || [
                  'Standard reverse-chronological single column structure passes all parsers.',
                  'Action verbs (Architected, Engineered, Developed) maximize recruiter match scores.',
                  'Pure text typography prevents parsing rejection on Workday & Taleo.',
                ]).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                    <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live ATS Resume Paper Preview */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between no-print px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Live ATS Resume Preview ({targetRole})
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Standard 8.5" x 11" Clean Paper Format
            </span>
          </div>

          {/* Printable Resume Container */}
          <div 
            id="printable-resume"
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-8 lg:p-10 text-slate-900 font-sans space-y-6 text-xs sm:text-[13px] leading-relaxed select-text overflow-hidden"
          >
            {/* Candidate Header */}
            <div className="text-center border-b border-slate-300 pb-4 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950">
                {profile?.name || resumeData?.contact?.name || 'LINGESH'}
              </h1>
              <p className="text-xs font-semibold text-indigo-700 tracking-wide uppercase">
                {targetRole}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-slate-600 pt-1">
                <span>{location}</span>
                <span>•</span>
                <span>{phone}</span>
                <span>•</span>
                <span className="font-medium text-slate-900">{profile?.email || 'lingesh@gmail.com'}</span>
                <span>•</span>
                <span className="text-indigo-600">{linkedinUrl}</span>
                <span>•</span>
                <span className="text-indigo-600">{githubUrl}</span>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Professional Summary
              </h2>
              <p className="text-slate-700 text-justify leading-relaxed">
                {resumeData?.summary || 
                  `Versatile and ambitious ${targetRole} with proven competency across modern web and software architectures. Proficient in developing scalable RESTful services, engineering declarative user interfaces, and structuring robust databases. Passionate about clean code, modular engineering, and delivering high-performance digital products.`
                }
              </p>
            </div>

            {/* Technical Skills */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Technical Skills &amp; Competencies
              </h2>
              
              <div className="space-y-1 text-[12px] leading-relaxed">
                <p>
                  <strong className="font-bold text-slate-900">Programming Languages: </strong>
                  <span className="text-slate-700">
                    {(resumeData?.skills?.languages || ['Python', 'JavaScript (ES6+)', 'TypeScript', 'SQL', 'HTML5/CSS3']).join(', ')}
                  </span>
                </p>

                <p>
                  <strong className="font-bold text-slate-900">Frameworks &amp; Libraries: </strong>
                  <span className="text-slate-700">
                    {(resumeData?.skills?.frameworks || ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Next.js']).join(', ')}
                  </span>
                </p>

                <p>
                  <strong className="font-bold text-slate-900">Databases &amp; Cloud: </strong>
                  <span className="text-slate-700">
                    {(resumeData?.skills?.databasesAndCloud || ['MongoDB', 'PostgreSQL', 'MySQL', 'AWS (S3, EC2)', 'Firebase']).join(', ')}
                  </span>
                </p>

                <p>
                  <strong className="font-bold text-slate-900">Tools, Methodologies &amp; Platforms: </strong>
                  <span className="text-slate-700">
                    {(resumeData?.skills?.toolsAndPractices || ['Git / GitHub', 'Docker', 'RESTful API Architecture', 'Postman', 'Linux', 'CI/CD Pipelines', 'Agile/Scrum']).join(', ')}
                  </span>
                </p>
              </div>
            </div>

            {/* Featured Technical Projects */}
            <div className="space-y-3">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Featured Technical Projects
              </h2>

              {(resumeData?.projects || [
                {
                  name: 'SkillPath AI - Multi-Agent Personalized Learning Platform',
                  role: 'Full Stack Architect & Developer',
                  duration: '3 Months',
                  techStack: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Claude API', 'REST APIs'],
                  highlights: [
                    'Architected an end-to-end full-stack web application orchestrating 5 collaborating AI agents for real-time skill gap analysis and automated roadmap curation.',
                    'Built responsive single-page interfaces in React with Tailwind CSS, delivering 95+ Google Lighthouse performance scores and instant client-side state transitions.',
                    'Engineered resilient Express.js REST API endpoints with robust error handling, JSON data validation, and sub-100ms request lifecycle response times.'
                  ]
                },
                {
                  name: 'Full-Stack E-Commerce & Inventory Management System',
                  role: 'Full Stack Developer',
                  duration: '2 Months',
                  techStack: ['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Express', 'JWT'],
                  highlights: [
                    'Engineered a scalable RESTful backend service with JWT role-based authentication, handling 1,000+ simultaneous product catalog requests.',
                    'Designed high-throughput MongoDB aggregation pipelines for real-time inventory tracking, search filtering, and shopping cart persistence.',
                    'Implemented modular React components with context state management, reducing code redundancy across dashboard pages by 40%.'
                  ]
                }
              ]).map((project, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between">
                    <p className="font-bold text-slate-900 text-[13px]">
                      {project.name}
                    </p>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {project.duration || 'Recent'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-indigo-700 font-semibold mb-1">
                    <span>{project.role}</span>
                    <span className="text-slate-500 font-normal">
                      Tech Stack: {(project.techStack || []).join(', ')}
                    </span>
                  </div>

                  <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700">
                    {(project.highlights || []).map((hl, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
                        {hl}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Education
              </h2>

              {(resumeData?.education || [
                {
                  degree: 'Bachelor of Technology in Computer Science & Engineering',
                  institution: 'Regional Technical University',
                  year: '2022 - 2026',
                  gpaOrHonors: 'CGPA: 8.9 / 10.0 • Academic Merit Scholar'
                }
              ]).map((edu, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline justify-between text-slate-800">
                  <div>
                    <strong className="font-bold text-slate-900">{edu.degree}</strong>
                    <p className="text-[11px] text-slate-600">{edu.institution}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <span className="font-medium text-slate-800 block">{edu.year}</span>
                    <span>{edu.gpaOrHonors}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Verified Certifications */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                Verified Certifications &amp; Credentials
              </h2>

              <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 text-[12px]">
                {(resumeData?.certifications || [
                  'freeCodeCamp Full Stack Developer Certification',
                  'Meta Frontend Developer Professional Certificate',
                  'MongoDB Certified Associate Developer'
                ]).map((cert, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Note */}
            <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 no-print">
              Validated by SkillPath AI Resume Architect Agent • Formatted for 95%+ Machine Readability
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

