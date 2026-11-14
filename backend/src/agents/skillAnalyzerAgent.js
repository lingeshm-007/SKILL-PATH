import { callClaude, extractJson } from './claudeClient.js';

export const SYSTEM_PROMPT = `You are a skill analysis expert. Given a user's current skills and target career, identify their strengths, weaknesses, and exact skill gaps. Return JSON only: {strengths: [], weaknesses: [], gaps: []}`;

export async function runSkillAnalyzerAgent({ currentSkills = [], targetCareer = 'Full Stack Developer', certifications = '', projects = '' }) {
  const userPrompt = `
User Profile:
- Current Skills: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills}
- Target Career: ${targetCareer}
- Certifications: ${certifications || 'None provided'}
- Projects: ${projects || 'None provided'}

Identify their key strengths, weaknesses in relation to the target career, and exact skill gaps needed to achieve the role.
Return strictly valid JSON only:
{
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "gaps": ["string", ...]
}
`.trim();

  const fallbackFn = () => {
    // Standard role mappings for high-fidelity fallback
    const careerGapsMap = {
      'Full Stack Developer': {
        required: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'HTML', 'CSS', 'Git', 'SQL', 'TypeScript'],
        gaps: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'],
      },
      'Data Scientist': {
        required: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'Machine Learning', 'Data Visualization', 'Statistics'],
        gaps: ['Pandas', 'NumPy', 'Scikit-Learn', 'Machine Learning', 'Statistics'],
      },
      'Cybersecurity Analyst': {
        required: ['Network Security', 'Linux', 'Ethical Hacking', 'SIEM Tools', 'Cryptography', 'Vulnerability Assessment'],
        gaps: ['Network Security', 'SIEM Tools', 'Cryptography', 'Vulnerability Assessment', 'Ethical Hacking'],
      },
      'AI Engineer': {
        required: ['Python', 'PyTorch', 'Transformers', 'LLM Fine-Tuning', 'Vector Databases', 'Prompt Engineering', 'LangChain'],
        gaps: ['PyTorch', 'Transformers', 'LLM Fine-Tuning', 'Vector Databases', 'LangChain'],
      },
      'Cloud Architect': {
        required: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Microservices Architecture'],
        gaps: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Microservices Architecture'],
      }
    };

    const target = careerGapsMap[targetCareer] || careerGapsMap['Full Stack Developer'];
    const currentList = Array.isArray(currentSkills) ? currentSkills : [currentSkills];
    const normalizedCurrent = currentList.map(s => s.toLowerCase().trim());

    // Dynamically calculate gaps
    const calculatedGaps = target.required.filter(skill => 
      !normalizedCurrent.some(cs => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
    );

    const finalGaps = calculatedGaps.length > 0 ? calculatedGaps : target.gaps;

    return {
      strengths: currentList.length > 0 ? currentList.slice(0, 4).map(s => `Foundational knowledge in ${s}`) : ['Eagerness to learn technical disciplines', 'Analytical thinking'],
      weaknesses: [
        `Limited hands-on production experience in ${finalGaps[0] || 'modern frameworks'}`,
        `End-to-end architecture integration missing for ${targetCareer}`,
        `Lack of verified automated testing and containerized deployments`
      ],
      gaps: finalGaps
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
      agent: 'Skill Analyzer Agent',
      model: response.model,
      source: response.source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  };
}

