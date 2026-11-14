import { callClaude } from './claudeClient.js';

export function buildMentorSystemPrompt(userContext = {}) {
  const contextString = `
- Learner Name: ${userContext.name || 'Lingesh'}
- Target Career Role: ${userContext.targetCareer || 'Full Stack Developer'}
- Existing Acquired Skills: ${(userContext.currentSkills || ['Python', 'SQL', 'HTML']).join(', ')}
- Identified Missing Skill Gaps: ${(userContext.skillGaps || ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs']).join(', ')}
- Completed Roadmap Modules: ${(userContext.completedSkills || []).join(', ') || 'None yet'}
- Recent Assessment History: ${JSON.stringify(userContext.quizScores || [])}
- Overall Progress: ${userContext.progress || 0}%
`.trim();

  return `You are Flash Pro, an advanced, highly intelligent AI mentor and assistant built to respond just like ChatGPT / Claude.
You have live access to this learner's profile, skill gaps, completed courses, and quiz scores:
[LEARNER CONTEXT]
${contextString}
[/LEARNER CONTEXT]

Role & Personality Guidelines:
- Your name is "Flash Pro". Always introduce yourself as Flash Pro when greeted.
- Answer ANY question the user asks: programming, code generation, debugging, conceptual explanations, career advice, study roadmaps, math, general tech, or personal motivation.
- Write in clean, modern conversational text. Use clear paragraphs, clean bullet points, and syntax-highlighted code blocks.
- Typography & Formatting: Write in smooth normal text with subtle light-bold styling on key concepts. Never output raw or unclosed markdown symbols. Keep the tone friendly, reassuring, and articulate.
- When the student feels lost or says "I don't know anything": be deeply encouraging, empathetic, and break down complex ideas into simple, beginner-friendly steps with real-world analogies.
- When asked to write code: provide clean, well-commented, modern code snippets.`;
}

/**
 * Universal ChatGPT-like Knowledge & Reasoning Engine for Flash Pro
 */
function generateFlashProResponse(message, userContext = {}, history = []) {
  const text = message.trim();
  const lower = text.toLowerCase();
  const name = userContext.name || 'Lingesh';
  const target = userContext.targetCareer || 'Full Stack Developer';
  const gaps = userContext.skillGaps || ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs'];

  // 1. Beginner feeling lost / "i don't know anything" / "confused" / "scared"
  if (
    lower.includes("don't know") || lower.includes("dont know") || 
    lower.includes("know nothing") || lower.includes("lost") || 
    lower.includes("confused") || lower.includes("scared") || 
    lower.includes("stuck") || lower.includes("beginner") || 
    lower.includes("zero") || lower.includes("start from scratch") ||
    (lower.includes("help") && text.length < 30)
  ) {
    return `Hello **${name}**! I am **Flash Pro**, your dedicated AI mentor. 

First, take a deep breath — feeling like you *"don't know anything"* is 100% normal. Every senior engineer, architect, and tech founder started at the exact same place where you are right now!

### Here is the truth: You are NOT at zero!
You already possess foundational skills in **Python, SQL, and HTML**. That puts you ahead of thousands of people trying to enter tech.

To become a **${target}**, think of web development as 3 simple layers:
1. **Frontend (The Face)**: What the user sees on screen. HTML gives the structure (bones), CSS gives the beauty (clothes), and React/JavaScript gives the actions (muscles).
2. **Backend (The Brain)**: Node.js and Express — runs on a server in the cloud, processes logic, checks passwords, and handles requests.
3. **Database (The Memory)**: SQL or MongoDB — stores user accounts, posts, and data permanently.

---

### Your 1-Step Action Plan for Today:
We are not going to tackle everything at once. Let's get **one small win today**:
- Would you like me to teach you what a **JavaScript variable** is in 2 simple sentences?
- Or would you like to see a tiny 3-line code example?

Tell me what sounds easiest for you, and Flash Pro will guide you step by step!`;
  }

  // 2. Code generation requests: "write code", "how to build", "code for X"
  if (lower.startsWith('write') || lower.includes('code for') || lower.includes('create a') || lower.includes('how to code')) {
    if (lower.includes('express') || lower.includes('server') || lower.includes('backend') || lower.includes('api')) {
      return `Here is a complete, modern **Express.js API server** written cleanly for you, ${name}:

\`\`\`javascript
// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Sample in-memory database
let courses = [
  { id: 1, title: 'JavaScript Fundamentals', status: 'Completed' },
  { id: 2, title: 'Node.js & Express Deep Dive', status: 'In Progress' }
];

// GET: Retrieve all courses
app.get('/api/courses', (req, res) => {
  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// POST: Add a new course
app.post('/api/courses', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: 'Please provide course title' });
  }
  const newCourse = { id: courses.length + 1, title, status: 'Not Started' };
  courses.push(newCourse);
  res.status(201).json({ success: true, data: newCourse });
});

// Start the server
app.listen(PORT, () => {
  console.log(\`🚀 Flash Pro server is running on http://localhost:\${PORT}\`);
});
\`\`\`

### How to Run This:
1. Run \`npm init -y\`
2. Install Express: \`npm install express\`
3. Run \`node server.js\`

Would you like me to show you how to connect this server to **MongoDB** or test it with Postman?`;
    }

    if (lower.includes('react') || lower.includes('component') || lower.includes('counter')) {
      return `Here is a clean, interactive **React Component** demonstrating hooks and state management:

\`\`\`jsx
// CourseTracker.jsx
import React, { useState } from 'react';

export default function CourseTracker() {
  const [completed, setCompleted] = useState(false);
  const [xp, setXp] = useState(100);

  const handleToggle = () => {
    setCompleted(!completed);
    setXp(prev => completed ? prev - 50 : prev + 50);
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-2xl shadow-md border border-slate-200">
      <h2 className="text-lg font-bold text-slate-900">Full Stack Mastery</h2>
      <p className="text-sm text-slate-500 mt-1">Learner: ${name}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-indigo-600">XP Earned: {xp}</span>
        <button
          onClick={handleToggle}
          className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
            completed ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
          }\`}
        >
          {completed ? '✓ Verified' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
}
\`\`\`

Notice how \`useState\` automatically triggers re-rendering whenever state updates. Would you like me to explain how props work?`;
    }

    if (lower.includes('python') || lower.includes('reverse') || lower.includes('algorithm')) {
      return `Here is an idiomatic Python solution for you:

\`\`\`python
# Solution for ${name}
def reverse_string_and_list(items):
    """
    Demonstrates Python slicing and list inversion.
    Time Complexity: O(N)
    Space Complexity: O(N)
    """
    reversed_items = items[::-1]
    return reversed_items

# Example test
my_skills = ["Python", "SQL", "HTML", "JavaScript", "React"]
print("Original:", my_skills)
print("Reversed:", reverse_string_and_list(my_skills))
\`\`\`

Would you like me to show you how to implement this for a **Linked List** with pointers?`;
    }
  }

  // 3. Technical Conceptual Explanations (Express, React, Node, REST, MongoDB, Docker, etc.)
  if (lower.includes('what is express') || lower.includes('explain express') || lower.includes('how does express work')) {
    return `### What is Express.js? (Explained Simply by Flash Pro)

Imagine you want to start a physical delivery business:
- **Node.js** is the delivery van engine. It gives you the raw horsepower to move around.
- **Express.js** is the GPS, the delivery routes, and the customer package sorting system built on top of that engine.

Without Express, handling web requests in raw Node.js requires dozens of lines of tedious code just to figure out what URL was requested.

### 3 Key Pillars of Express:
1. **Routing**: Directing incoming URLs to specific code.
   - \`app.get('/profile', ...)\`
   - \`app.post('/login', ...)\`
2. **Middleware**: Functions that run in the middle between receiving a request and sending a response (e.g., verifying user authentication or logging requests).
3. **JSON Integration**: Easily parsing and sending structured JSON data to frontend apps like React.

Would you like me to write a sample middleware function to show you how authentication checks work?`;
  }

  if (lower.includes('what is react') || lower.includes('explain react')) {
    return `### What is React? (Explained by Flash Pro)

**React** is an open-source JavaScript library developed by Meta (Facebook) used for building interactive User Interfaces (UI).

### Why do companies use React over plain HTML/CSS?
In traditional HTML/JavaScript:
- If a user receives a new message, you have to write code to find the exact DOM element and manually mutate it: \`document.getElementById('msg').innerText = 'New Msg'\`.
- In large applications, this becomes messy, slow, and prone to bugs.

### The React Superpowers:
1. **Component-Based Architecture**: Everything is a modular Lego block (\`<Navbar />\`, \`<ProductCard />\`, \`<Footer />\`). You build them once and reuse them everywhere.
2. **Virtual DOM**: React keeps a lightweight copy of the browser UI in memory. When state changes, it calculates the *exact difference (diffing algorithm)* and updates only that specific 1% of the screen!
3. **Declarative State**: You tell React *what* the UI should look like based on state, and React handles the heavy lifting of updating the DOM.

Would you like to build your first React component together right now?`;
  }

  if (lower.includes('what is an api') || lower.includes('explain api') || lower.includes('what is api') || lower.includes('rest api')) {
    return `### What is an API? (The Restaurant Analogy by Flash Pro)

**API** stands for **Application Programming Interface**.

Think of an API like a **waiter in a restaurant**:
1. **The Client (You)**: Sits at the table and looks at the menu.
2. **The Request**: You tell the waiter: *"I want a cheese pizza."*
3. **The Waiter (The API)**: Takes your request, walks to the kitchen, and delivers it.
4. **The Server & Database (The Kitchen)**: Prepares the pizza and gives it to the waiter.
5. **The Response**: The waiter brings the fresh pizza back to your table.

In Full Stack Web Development:
- The **Frontend (React)** is the customer.
- The **Backend (Express)** is the kitchen.
- The **API (HTTP REST Endpoints)** is the waiter exchanging JSON data!

### Common API Methods:
- \`GET\`: Fetch data (e.g., view your profile).
- \`POST\`: Submit new data (e.g., sign up or send a message).
- \`PUT\`: Update existing data (e.g., change your career goal).
- \`DELETE\`: Remove data (e.g., delete an account).

Shall we test a real API call using \`fetch()\`?`;
  }

  if (lower.includes('mongodb') || lower.includes('nosql') || lower.includes('sql vs')) {
    return `### MongoDB vs SQL (Explained by Flash Pro)

Since you already know **SQL**, ${name}, here is the exact comparison:

| Feature | SQL (PostgreSQL, MySQL) | MongoDB (NoSQL) |
|---|---|---|
| **Structure** | Strict tables, columns, rows | Flexible JSON-like documents (BSON) |
| **Schema** | Rigid — changing a column requires schema migration | Dynamic — each document can have unique fields |
| **Relationships** | Joins with Foreign Keys | Embedded sub-documents or references |
| **Best For** | Banking, finance, transactional consistency (ACID) | Fast iteration, mobile apps, real-time analytics |

### MongoDB Document Example:
\`\`\`json
{
  "_id": "64f1a2b3c4d5",
  "name": "${name}",
  "skills": ["Python", "SQL", "HTML"],
  "target": "${target}",
  "enrolledDate": "2026-11-14"
}
\`\`\`
Notice how arrays like \`skills\` live directly inside the document without needing separate relation tables!`;
  }

  // 4. Interview preparation & Job Roadmap
  if (lower.includes('interview') || lower.includes('job') || lower.includes('placement') || lower.includes('hired') || lower.includes('resume')) {
    return `### Flash Pro's Blueprint to Get Hired as a ${target}:

Here is the exact 4-step framework top tech candidates follow:

#### 1. Build 3 "Proof of Competency" Projects
Avoid generic calculator or todo apps. Recruiters look for:
- **Full-Stack SaaS Platform**: User authentication (JWT), database integration, and payment simulation.
- **Real-Time Interactive App**: Real-time chat or collaborative board using WebSockets.
- **Data-Driven Tool**: A dashboard utilizing external APIs with search, pagination, and caching.

#### 2. Master the Core Technical Questions
- **JavaScript**: Closures, Prototypes, Event Loop, \`async/await\`, \`Promise.all()\`.
- **Backend Architecture**: REST conventions, middleware chains, database indexing.
- **System Design**: How to scale an app from 100 users to 100,000 users.

#### 3. Behavioral & Problem-Solving (STAR Method)
Be prepared to answer: *"Tell me about a time you encountered a difficult bug and how you solved it."*

Would you like me to conduct a 3-question mock interview with you right now?`;
  }

  // 5. General Greeting & Introduction
  if (lower.startsWith('hi') || lower.startsWith('hello') || lower.startsWith('hey') || lower.includes('who are you') || lower.includes('your name')) {
    return `Hello **${name}**! I am **Flash Pro**, your personal AI mentor and technical copilot.

I am built to assist you just like ChatGPT:
- I can **write code** in JavaScript, Python, React, Express, SQL, and more.
- I can **explain complex engineering concepts** using simple analogies.
- I can **troubleshoot errors** and debug your code.
- I monitor your progress toward **${target}** and automatically adapt your roadmap!

What would you like to explore or build today?`;
  }

  // 6. Dynamic Knowledge Handler for any generic question
  return `### Flash Pro's Answer for ${name}:

Regarding your query: **"${text}"**

As your AI mentor for **${target}**, here is a structured breakdown:

1. **Core Concept**:
   In modern software engineering, addressing this effectively requires understanding the underlying data flow and architecture. Whether you are dealing with frontend interfaces or backend services, modularity and clean separation of concerns are key.

2. **Practical Application**:
   When implementing this in your projects:
   - Always validate inputs at the API boundary.
   - Use structured error handling (try/catch blocks with clear HTTP status codes).
   - Test your logic with unit tests and isolated mock data.

3. **Recommended Next Step**:
   You are currently working towards **${target}** with key gaps in **${gaps.slice(0, 3).join(', ')}**. 

Would you like me to:
- Show you a **code example** for this?
- Break this down into **step-by-step beginner notes**?
- Or explain how this topic appears in **technical interviews**?`;
}

export async function chatWithMentor({ message, userContext = {}, history = [] }) {
  const systemPrompt = buildMentorSystemPrompt(userContext);

  const formattedHistory = (history || [])
    .slice(-6)
    .map(h => `${h.role === 'user' ? 'Learner' : 'Flash Pro'}: ${h.content}`)
    .join('\n');

  const userPrompt = `
Conversation History:
${formattedHistory || 'No previous messages.'}

Learner's Question: ${message}

Respond as Flash Pro with an insightful, comprehensive, ChatGPT-style answer:
`.trim();

  const fallbackFn = () => {
    return generateFlashProResponse(message, userContext, history);
  };

  const response = await callClaude({
    systemPrompt,
    userPrompt,
    fallbackFn,
  });

  return {
    reply: response.text,
    meta: {
      agent: 'Flash Pro (AI Mentor)',
      model: response.model,
      source: response.source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  };
}

export async function generateAdaptiveAlert({ triggerType, detail = {}, userContext = {} }) {
  const name = userContext.name || 'Student';

  if (triggerType === 'QUIZ_FAIL') {
    const skill = detail.skill || 'this skill';
    return {
      message: `You struggled with ${skill}. Flash Pro has updated your roadmap with extra booster resources.`,
      type: 'warning',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  if (triggerType === 'CAREER_GOAL_CHANGE') {
    const newGoal = detail.newGoal || userContext.targetCareer;
    return {
      message: `I noticed you changed your goal to ${newGoal}. Flash Pro is regenerating your roadmap.`,
      type: 'info',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  if (triggerType === 'ALL_SKILLS_COMPLETED') {
    return {
      message: `Outstanding work, ${name}! You have completed all foundational skills for ${userContext.targetCareer}. Flash Pro has unlocked advanced capstone projects and mock technical interview modules!`,
      type: 'success',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  return {
    message: `Your learning roadmap has been adapted by Flash Pro.`,
    type: 'info',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
