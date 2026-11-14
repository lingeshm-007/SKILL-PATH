import { callClaude, extractJson } from './claudeClient.js';

export const SYSTEM_PROMPT = `You are a career requirements expert. Given a target job role and a user's skill gaps, return a match score and breakdown. Return JSON only: {matchPercentage: number, requiredSkills: [], userHas: [], userMissing: []}`;

export async function runCareerMatcherAgent({ targetCareer, skillGaps = [], currentSkills = [] }) {
  const userPrompt = `
Target Job Role: ${targetCareer}
User's Identified Skill Gaps: ${Array.isArray(skillGaps) ? skillGaps.join(', ') : skillGaps}
User's Current Skills: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}

Calculate a realistic match score (percentage 0-100), full list of required skills for this role, which skills the user has, and which are missing.
Return strictly valid JSON only:
{
  "matchPercentage": 45,
  "requiredSkills": ["skill1", "skill2", ...],
  "userHas": ["skill1", ...],
  "userMissing": ["skill2", ...]
}
`.trim();

  const fallbackFn = () => {
    const careerSkillsDatabase = {
      'Full Stack Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Git'],
      'Data Scientist': ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistics', 'Data Visualization', 'Machine Learning'],
      'Cybersecurity Analyst': ['Linux', 'Networking Protocols', 'Network Security', 'SIEM Tools', 'Cryptography', 'Ethical Hacking', 'Vulnerability Assessment'],
      'AI Engineer': ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Prompt Engineering', 'LangChain', 'Vector Databases', 'Transformers'],
      'Cloud Architect': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Microservices Architecture'],
    };

    const required = careerSkillsDatabase[targetCareer] || careerSkillsDatabase['Full Stack Developer'];
    const currentList = Array.isArray(currentSkills) ? currentSkills : [];
    const gapsList = Array.isArray(skillGaps) ? skillGaps : [];

    const userHas = currentList.length > 0 ? currentList : ['Python', 'SQL', 'HTML'];
    const userMissing = gapsList.length > 0 ? gapsList : ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'];

    const total = required.length;
    const hasCount = userHas.filter(h => required.some(r => r.toLowerCase() === h.toLowerCase())).length;
    // Calculate realistic match score e.g. 42% or 45%
    const calculatedPercentage = Math.round(Math.max(25, Math.min(88, (hasCount / total) * 100))) || 42;

    return {
      matchPercentage: calculatedPercentage,
      requiredSkills: required,
      userHas: userHas,
      userMissing: userMissing,
    };
  };

  const response = await callClaude({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    fallbackFn,
  });

  const parsed = extractJson(response.text);
  return {
    ...parsed,
    meta: {
      agent: 'Career Matcher Agent',
      model: response.model,
      source: response.source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  };
}

