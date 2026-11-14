import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const DEFAULT_STUDENTS = {
  'user-lingesh': {
    profile: {
      id: 'user-lingesh',
      name: 'Lingesh',
      email: 'lingesh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      currentSkills: ['Python', 'SQL', 'HTML'],
      certifications: 'Meta Frontend Specialist, AWS Cloud Practitioner',
      projects: 'SQLite Inventory Tracker, Portfolio Showcase with HTML/CSS',
      targetCareer: 'Full Stack Developer',
      createdAt: '2026-11-14T04:30:00.000Z',
    },
    analysis: {
      strengths: [
        'Strong logical programming foundation in Python',
        'Solid relational database querying skills with SQL',
        'Understands core web document structure and semantics with HTML'
      ],
      weaknesses: [
        'No hands-on client-side scripting experience in JavaScript (ES6+)',
        'Lacks modern declarative UI library experience with React',
        'Backend event-driven server runtime (Node.js/Express) missing'
      ],
      gaps: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs']
    },
    matching: {
      matchPercentage: 42,
      requiredSkills: [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js',
        'Express', 'MongoDB', 'SQL', 'REST APIs', 'Git'
      ],
      userHas: ['HTML', 'SQL', 'Python'],
      userMissing: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs']
    },
    roadmap: [
      {
        id: 'step-1',
        skill: 'JavaScript',
        course: 'JavaScript Algorithms and Data Structures Certification',
        platform: 'freeCodeCamp',
        duration: '15 hours',
        difficulty: 'Beginner to Intermediate',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
        completed: true,
        quizTaken: true,
        quizScore: '3/3 (Pass)',
        isRemediation: false,
      },
      {
        id: 'step-2',
        skill: 'React',
        course: 'React Official Documentation & Interactive Deep Dive',
        platform: 'React.dev',
        duration: '10 hours',
        difficulty: 'Intermediate',
        url: 'https://react.dev/learn',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      },
      {
        id: 'step-3',
        skill: 'Node.js',
        course: 'Node.js & Express Crash Course',
        platform: 'Traversy Media / YouTube',
        duration: '6 hours',
        difficulty: 'Intermediate',
        url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      },
      {
        id: 'step-4',
        skill: 'MongoDB',
        course: 'Introduction to MongoDB & Aggregation Framework',
        platform: 'MongoDB University',
        duration: '8 hours',
        difficulty: 'Beginner to Intermediate',
        url: 'https://learn.mongodb.com/',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      },
      {
        id: 'step-5',
        skill: 'REST APIs',
        course: 'Mastering RESTful API Architecture & Postman',
        platform: 'freeCodeCamp',
        duration: '5 hours',
        difficulty: 'Intermediate',
        url: 'https://www.freecodecamp.org/news/build-a-restful-api/',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      }
    ],
    quizScores: [
      {
        id: 'quiz-log-1',
        skill: 'JavaScript',
        score: 3,
        total: 3,
        passed: true,
        date: '10:10 AM',
      }
    ],
    mentorMessages: [
      {
        id: 'msg-1',
        role: 'mentor',
        content: "Welcome to SkillPath AI, Lingesh! I've loaded your profile for Full Stack Developer. Our AI agents identified 5 key skill gaps to bridge your path. I'm here 24/7 to coach you, provide adaptive learning resources, and evaluate your progress!",
        timestamp: '10:02 AM',
        sender: 'Mentor Agent',
      }
    ],
    agentLogs: [
      {
        id: 'log-1',
        agent: 'Skill Analyzer Agent',
        action: 'Skill Analyzer Agent ran at 10:03 AM — Found 5 skill gaps',
        detail: 'Identified gaps: JavaScript, React, Node.js, MongoDB, REST APIs',
        status: 'success',
        timestamp: '10:03 AM',
      },
      {
        id: 'log-2',
        agent: 'Career Matcher Agent',
        action: 'Career Matcher Agent ran at 10:03 AM — Match: 42%',
        detail: 'Calculated 42% baseline match for Full Stack Developer role',
        status: 'success',
        timestamp: '10:03 AM',
      },
      {
        id: 'log-3',
        agent: 'Learning Curator Agent',
        action: 'Learning Curator Agent ran at 10:04 AM — Generated 5 resources',
        detail: 'Curated 5 personalized courses from freeCodeCamp, React.dev, YouTube, and MongoDB Univ',
        status: 'success',
        timestamp: '10:04 AM',
      }
    ]
  },

  'user-priya': {
    profile: {
      id: 'user-priya',
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      currentSkills: ['Python', 'Linear Algebra', 'NumPy'],
      certifications: 'Google Data Analytics Certificate, DeepLearning.AI Specialization',
      projects: 'Digit Classification with CNNs, Matrix Factorization for Movie Recommendations',
      targetCareer: 'AI Engineer',
      createdAt: '2026-11-14T05:00:00.000Z',
    },
    analysis: {
      strengths: [
        'Advanced mathematical intuition in Linear Algebra & Vector calculus',
        'Proficient in numerical computation and array manipulation with NumPy',
        'Strong foundational scripting in Python'
      ],
      weaknesses: [
        'Has not built production Transformer models or attention mechanisms',
        'Lacks experience with Vector Databases (Pinecone/Milvus) for RAG',
        'No hands-on fine-tuning experience with open-weights LLMs (Llama/Mistral)'
      ],
      gaps: ['PyTorch', 'Transformers', 'LLM Fine-Tuning', 'Vector Databases', 'LangChain']
    },
    matching: {
      matchPercentage: 38,
      requiredSkills: [
        'Python', 'PyTorch', 'Transformers', 'LLM Fine-Tuning',
        'Vector Databases', 'LangChain', 'Prompt Engineering', 'FastAPI'
      ],
      userHas: ['Python', 'Linear Algebra', 'NumPy'],
      userMissing: ['PyTorch', 'Transformers', 'LLM Fine-Tuning', 'Vector Databases', 'LangChain']
    },
    roadmap: [
      {
        id: 'priya-step-1',
        skill: 'PyTorch',
        course: 'Deep Learning with PyTorch: Zero to GANs',
        platform: 'freeCodeCamp',
        duration: '12 hours',
        difficulty: 'Intermediate',
        url: 'https://www.freecodecamp.org/news/deep-learning-with-pytorch/',
        completed: true,
        quizTaken: true,
        quizScore: '3/3 (Pass)',
        isRemediation: false,
      },
      {
        id: 'priya-step-2',
        skill: 'Transformers',
        course: 'Hugging Face NLP Course: Transformers in Action',
        platform: 'Hugging Face',
        duration: '14 hours',
        difficulty: 'Advanced',
        url: 'https://huggingface.co/learn/nlp-course',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      },
      {
        id: 'priya-step-3',
        skill: 'Vector Databases',
        course: 'Vector Embeddings & Semantic Search Masterclass',
        platform: 'Pinecone / YouTube',
        duration: '5 hours',
        difficulty: 'Intermediate',
        url: 'https://www.pinecone.io/learn/',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      },
      {
        id: 'priya-step-4',
        skill: 'LangChain',
        course: 'Building Generative AI Applications with LangChain',
        platform: 'DeepLearning.AI',
        duration: '4 hours',
        difficulty: 'Intermediate',
        url: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      }
    ],
    quizScores: [
      {
        id: 'priya-q-1',
        skill: 'PyTorch',
        score: 3,
        total: 3,
        passed: true,
        date: '10:15 AM',
      }
    ],
    mentorMessages: [
      {
        id: 'priya-m-1',
        role: 'mentor',
        content: "Hello Priya! As your AI Mentor, I am thrilled to guide you on the AI Engineer path. Your math and NumPy background provides a tremendous launchpad. Let's conquer Transformers and Vector search!",
        timestamp: '10:15 AM',
        sender: 'Mentor Agent',
      }
    ],
    agentLogs: [
      {
        id: 'priya-log-1',
        agent: 'Skill Analyzer Agent',
        action: 'Skill Analyzer Agent evaluated Priya at 10:15 AM — Found 5 gaps for AI Engineer',
        detail: 'Gaps: PyTorch, Transformers, LLM Fine-Tuning, Vector Databases, LangChain',
        status: 'success',
        timestamp: '10:15 AM',
      },
      {
        id: 'priya-log-2',
        agent: 'Career Matcher Agent',
        action: 'Career Matcher Agent calculated 38% match for AI Engineer',
        detail: 'Match: 38%. Strong math base, missing generative AI toolchain',
        status: 'success',
        timestamp: '10:15 AM',
      }
    ]
  },

  'user-alex': {
    profile: {
      id: 'user-alex',
      name: 'Alex Chen',
      email: 'alex.chen@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      currentSkills: ['Linux', 'Networking Protocols', 'Bash'],
      certifications: 'Cisco CCNA, CompTIA Network+',
      projects: 'Automated Log Parsing with Bash, Wireshark Packet Inspection Lab',
      targetCareer: 'Cybersecurity Analyst',
      createdAt: '2026-11-14T05:15:00.000Z',
    },
    analysis: {
      strengths: [
        'Deep understanding of Linux kernel administration & permission models',
        'Strong mastery of TCP/IP, DNS, ARP, and packet structure',
        'Automated scripting skills in Bash'
      ],
      weaknesses: [
        'No hands-on SIEM event correlation (Splunk/Wazuh)',
        'Lacks penetration testing methodology and exploit analysis',
        'Has not configured enterprise firewalls or IDS/IPS systems'
      ],
      gaps: ['Network Security', 'SIEM Tools', 'Cryptography', 'Ethical Hacking', 'Vulnerability Assessment']
    },
    matching: {
      matchPercentage: 45,
      requiredSkills: [
        'Linux', 'Networking Protocols', 'Network Security',
        'SIEM Tools', 'Cryptography', 'Ethical Hacking', 'Vulnerability Assessment'
      ],
      userHas: ['Linux', 'Networking Protocols', 'Bash'],
      userMissing: ['Network Security', 'SIEM Tools', 'Cryptography', 'Ethical Hacking', 'Vulnerability Assessment']
    },
    roadmap: [
      {
        id: 'alex-step-1',
        skill: 'Network Security',
        course: 'Network Defense & Protocol Analysis',
        platform: 'Coursera',
        duration: '16 hours',
        difficulty: 'Intermediate',
        url: 'https://www.coursera.org',
        completed: true,
        quizTaken: true,
        quizScore: '3/3 (Pass)',
        isRemediation: false,
      },
      {
        id: 'alex-step-2',
        skill: 'SIEM Tools',
        course: 'Enterprise Security Monitoring with Splunk',
        platform: 'Udemy',
        duration: '10 hours',
        difficulty: 'Intermediate',
        url: 'https://www.udemy.com',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      },
      {
        id: 'alex-step-3',
        skill: 'Ethical Hacking',
        course: 'Ethical Hacking & Penetration Testing Foundations',
        platform: 'freeCodeCamp',
        duration: '15 hours',
        difficulty: 'Intermediate',
        url: 'https://www.freecodecamp.org',
        completed: false,
        quizTaken: false,
        isRemediation: false,
      }
    ],
    quizScores: [
      {
        id: 'alex-q-1',
        skill: 'Network Security',
        score: 3,
        total: 3,
        passed: true,
        date: '09:45 AM',
      }
    ],
    mentorMessages: [
      {
        id: 'alex-m-1',
        role: 'mentor',
        content: "Welcome Alex! With your Linux and networking foundations, you are positioned well for a Cybersecurity Analyst career. Let's master SIEM and Threat Hunting!",
        timestamp: '09:45 AM',
        sender: 'Mentor Agent',
      }
    ],
    agentLogs: [
      {
        id: 'alex-log-1',
        agent: 'Skill Analyzer Agent',
        action: 'Skill Analyzer Agent ran for Alex at 09:45 AM — Identified 5 gaps for Cybersecurity',
        status: 'success',
        timestamp: '09:45 AM',
      }
    ]
  }
};

const INITIAL_DB_STRUCTURE = {
  activeUserId: 'user-lingesh',
  users: DEFAULT_STUDENTS,
  settings: {
    apiKey: '',
  }
};

export function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB_STRUCTURE, null, 2), 'utf8');
  } else {
    // Migration check: if old structure without users object, migrate to multi-user
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (!data.users) {
        const migrated = {
          activeUserId: data.profile?.id || 'user-lingesh',
          users: {
            [data.profile?.id || 'user-lingesh']: {
              profile: data.profile || DEFAULT_STUDENTS['user-lingesh'].profile,
              analysis: data.analysis || DEFAULT_STUDENTS['user-lingesh'].analysis,
              matching: data.matching || DEFAULT_STUDENTS['user-lingesh'].matching,
              roadmap: data.roadmap || DEFAULT_STUDENTS['user-lingesh'].roadmap,
              quizScores: data.quizScores || DEFAULT_STUDENTS['user-lingesh'].quizScores,
              mentorMessages: data.mentorMessages || DEFAULT_STUDENTS['user-lingesh'].mentorMessages,
              agentLogs: data.agentLogs || DEFAULT_STUDENTS['user-lingesh'].agentLogs,
            },
            ...DEFAULT_STUDENTS,
          },
          settings: data.settings || { apiKey: '' },
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(migrated, null, 2), 'utf8');
      }
    } catch (e) {
      console.error('Migration error in db.js:', e);
    }
  }
}

export function readDB() {
  try {
    initDB();
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, returning defaults:', err);
    return INITIAL_DB_STRUCTURE;
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

/**
 * Get active student user data
 */
export function getActiveStudent(reqUserId = null) {
  const db = readDB();
  const userId = reqUserId || db.activeUserId || 'user-lingesh';
  let student = db.users[userId];

  // If user not found, fallback to active or Lingesh
  if (!student) {
    student = db.users[db.activeUserId] || db.users['user-lingesh'];
  }
  return {
    userId: student.profile.id,
    data: student,
    db,
  };
}

/**
 * Save student data
 */
export function saveStudentData(userId, studentData) {
  const db = readDB();
  db.users[userId] = studentData;
  writeDB(db);
  return studentData;
}

/**
 * Get all students list for switching
 */
export function getAllStudents() {
  const db = readDB();
  return Object.values(db.users).map(u => ({
    id: u.profile.id,
    name: u.profile.name,
    email: u.profile.email,
    avatar: u.profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.profile.name}`,
    targetCareer: u.profile.targetCareer,
    currentSkills: u.profile.currentSkills,
    matchPercentage: u.matching?.matchPercentage || 40,
    progress: Math.round(((u.roadmap?.filter(r => r.completed)?.length || 0) / (u.roadmap?.length || 1)) * 100),
  }));
}

/**
 * Add agent log for specific student
 */
export function addAgentLogForUser(userId, { agent, action, detail = '', status = 'success' }) {
  const db = readDB();
  const student = db.users[userId] || db.users[db.activeUserId] || db.users['user-lingesh'];
  const newLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    agent,
    action,
    detail,
    status,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  student.agentLogs = student.agentLogs || [];
  student.agentLogs.unshift(newLog);
  if (student.agentLogs.length > 30) {
    student.agentLogs = student.agentLogs.slice(0, 30);
  }
  writeDB(db);
  return newLog;
}

export function resetDemoData() {
  writeDB(INITIAL_DB_STRUCTURE);
  return INITIAL_DB_STRUCTURE;
}
