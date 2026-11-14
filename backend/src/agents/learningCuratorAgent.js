import { callClaude, extractJson } from './claudeClient.js';

export const SYSTEM_PROMPT = `You are a learning resource curator. Given a list of skill gaps, recommend one learning resource per skill. Return JSON only: [{skill: string, course: string, platform: string, duration: string, difficulty: string, url: string}]`;

export async function runLearningCuratorAgent({ skillGaps = [], isRemediation = false, failedSkill = null }) {
  const userPrompt = isRemediation
    ? `The student struggled with "${failedSkill}". Provide an intensive deep-dive remediation resource specifically targeting ${failedSkill} to reinforce understanding.`
    : `List of skill gaps to cure: ${Array.isArray(skillGaps) ? skillGaps.join(', ') : skillGaps}. Recommend the best top-tier resource per skill.`;

  const fallbackFn = () => {
    // Curated high quality educational resources for demo & real use
    const library = {
      'JavaScript': {
        course: 'JavaScript Algorithms and Data Structures Certification',
        platform: 'freeCodeCamp',
        duration: '15 hours',
        difficulty: 'Beginner to Intermediate',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
      },
      'React': {
        course: 'React Official Documentation & Interactive Deep Dive',
        platform: 'React.dev',
        duration: '10 hours',
        difficulty: 'Intermediate',
        url: 'https://react.dev/learn',
      },
      'Node.js': {
        course: 'Node.js & Express Crash Course',
        platform: 'Traversy Media / YouTube',
        duration: '6 hours',
        difficulty: 'Intermediate',
        url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
      },
      'MongoDB': {
        course: 'Introduction to MongoDB & Aggregation Framework',
        platform: 'MongoDB University',
        duration: '8 hours',
        difficulty: 'Beginner to Intermediate',
        url: 'https://learn.mongodb.com/',
      },
      'REST APIs': {
        course: 'Mastering RESTful API Architecture & Postman',
        platform: 'Udemy / freeCodeCamp',
        duration: '5 hours',
        difficulty: 'Intermediate',
        url: 'https://www.freecodecamp.org/news/build-a-restful-api/',
      },
      'PyTorch': {
        course: 'Deep Learning with PyTorch: Zero to GANs',
        platform: 'freeCodeCamp',
        duration: '12 hours',
        difficulty: 'Intermediate to Advanced',
        url: 'https://www.freecodecamp.org/news/deep-learning-with-pytorch/',
      },
      'Transformers': {
        course: 'Hugging Face NLP Course with Transformers',
        platform: 'Hugging Face',
        duration: '14 hours',
        difficulty: 'Advanced',
        url: 'https://huggingface.co/learn/nlp-course',
      },
      'LangChain': {
        course: 'Building Generative AI Applications with LangChain',
        platform: 'DeepLearning.AI',
        duration: '4 hours',
        difficulty: 'Intermediate',
        url: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/',
      },
      'Vector Databases': {
        course: 'Vector Embeddings & Semantic Search Masterclass',
        platform: 'Pinecone / YouTube',
        duration: '5 hours',
        difficulty: 'Intermediate',
        url: 'https://www.pinecone.io/learn/',
      },
      'Network Security': {
        course: 'Network Defense & Protocol Analysis',
        platform: 'Coursera',
        duration: '16 hours',
        difficulty: 'Intermediate',
        url: 'https://www.coursera.org',
      },
      'Docker': {
        course: 'Docker for Developers: Containerization from Scratch',
        platform: 'YouTube / TechWorld with Nana',
        duration: '4 hours',
        difficulty: 'Intermediate',
        url: 'https://www.youtube.com',
      },
      'AWS': {
        course: 'AWS Certified Solutions Architect Training',
        platform: 'freeCodeCamp',
        duration: '14 hours',
        difficulty: 'Intermediate',
        url: 'https://www.freecodecamp.org',
      }
    };

    const targetGaps = Array.isArray(skillGaps) && skillGaps.length > 0
      ? skillGaps
      : ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'];

    if (isRemediation && failedSkill) {
      return [{
        skill: failedSkill,
        course: `${failedSkill} Foundations: Guided Remediation & Hands-On Debugging`,
        platform: 'SkillPath Guided Lab / YouTube',
        duration: '2.5 hours',
        difficulty: 'Foundational Review',
        url: 'https://developer.mozilla.org/',
        isRemediation: true,
      }];
    }

    return targetGaps.map((skill) => {
      const match = library[skill] || {
        course: `${skill} Essential Masterclass & Best Practices`,
        platform: 'Udemy / freeCodeCamp',
        duration: '8 hours',
        difficulty: 'Intermediate',
        url: 'https://www.freecodecamp.org',
      };
      return {
        skill,
        course: match.course,
        platform: match.platform,
        duration: match.duration,
        difficulty: match.difficulty,
        url: match.url,
      };
    });
  };

  const response = await callClaude({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    fallbackFn,
  });

  const parsed = extractJson(response.text);
  const items = Array.isArray(parsed) ? parsed : [parsed];

  return {
    recommendations: items.map((item, idx) => ({
      id: `rec-${Date.now()}-${idx}`,
      skill: item.skill,
      course: item.course,
      platform: item.platform,
      duration: item.duration,
      difficulty: item.difficulty,
      url: item.url,
      completed: false,
      isRemediation: !!item.isRemediation,
    })),
    meta: {
      agent: 'Learning Curator Agent',
      model: response.model,
      source: response.source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  };
}

