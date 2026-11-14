# SkillPath AI — Agentic AI Personalized Career Platform
> **PromptWars X RTC Hackathon Deliverable**

An AI-powered personalized learning platform that understands an individual's skills, identifies missing competencies, and dynamically creates, tracks, and adapts a personalized learning path to help students achieve their target career. Powered by a collaborative swarm of specialized AI agents with intelligent Claude Sonnet 4-6 orchestration.

---

## 🌟 Expected Features & Implementation

### 1. User Profile & Multi-User Authentication (`/profile`, Top Bar)
- **Individual Student Accounts**: Secure authentication via **Google ID** or **Student Email** with dedicated, isolated student workspaces.
- Learner details, target career goal, existing skills, certifications, and project portfolio.
- Profile picture customization (upload custom picture or pick modern preset avatars).
- Clean **Sign Out** flow allowing different students to log into their respective accounts.

### 2. Skill Analysis — Agent 1: Skill Analyzer Agent (`/analysis`, `/dashboard`)
- Deep semantic evaluation of user's declared skills, projects, and assessment scores.
- Clear categorization into verified strengths, growth areas, and missing competency gaps.

### 3. Career Matching — Agent 2: Career Matcher Agent (`/dashboard`, `/analysis`)
- Compares student's current skills against industry requirements for selected job roles (Full Stack Developer, AI Engineer, Data Scientist, Cybersecurity Analyst, Cloud Architect).
- Calculates real-time career match percentages and side-by-side gap matrices.

### 4. Learning Recommendations — Agent 3: Learning Curator Agent (`/roadmap`)
- Curates structured learning roadmaps with courses, tutorials, and practical hands-on exercises from top providers (freeCodeCamp, React.dev, YouTube, MDN, Coursera).
- Interactive timeline with estimated hours, platform badges, difficulty tags, and direct links.

### 5. Progress Tracking & Assessments — Agent 4: Progress Monitor Agent (`/quiz/:skill`)
- Generates 3-question MCQ assessments on demand for each missing skill.
- Scoring ≥ 2/3 verifies mastery, updates roadmap completion, and moves skills from "Missing" to "Acquired".
- Built-in evaluator shortcuts: `⚡ Test Pass (3/3)` and `⚡ Test Fail & Adaptive Trigger`.

### 6. AI Mentor ("Flash Pro") — Agent 5: Mentor Agent (`/mentor`, Floating Drawer)
- Conversational ChatGPT/Claude-style copilot with full injected context (profile, skill gaps, roadmap, quiz history).
- Answers coding, career, and conceptual questions with deep explanations, code snippets, and study tips.
- Displays live Injected Context Inspector showing agent memory.

### 7. ATS-Friendly Resume Builder (`/resume`) — Agent 6: Resume Architect Agent
- Dedicated tool allowing students to generate role-targeted, ATS-optimized resumes.
- Automatically tailors summary, skills matrices, STAR-format project bullets, and career achievements based on the student's profile.
- 1-click **Copy to Clipboard** and **Download Markdown Resume**.

### 8. Adaptive Progress & Autonomous Swarm Collaboration
- **Career Goal Shift**: Changing target career automatically re-triggers Agent 1 & Agent 3 to restructure the roadmap and notifies the student.
- **Assessment Failure & Remediation**: Failing a quiz triggers Agent 4 + Agent 3 to inject an Adaptive Booster Lab and Agent 5 to provide targeted mentoring.
- **Agent Activity Log**: Real-time timestamped event stream displaying autonomous multi-agent coordination.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React, Canvas Confetti, Vite.
- **Backend**: Node.js, Express, CORS, persistent multi-student JSON database (`backend/src/data/db.json`).
- **AI Architecture**: Claude API (`claude-sonnet-4-6`) via `@anthropic-ai/sdk`, with intelligent local fallbacks for seamless offline resilience.
- **Responsive**: Fully optimized for mobile, tablet, and desktop viewports.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Configure Environment (Optional)
Create `backend/.env` (see `backend/.env.example`):
```env
PORT=5001
ANTHROPIC_API_KEY=your_claude_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-6
```
*(If no API key is provided, the built-in intelligent fallback engine powers all 5 agents with realistic, context-aware responses.)*

### 3. Start Backend Server
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5001
```

### 4. Start Frontend Application
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 📋 Sample Scenario (Full Stack Developer)
- **Learner**: Lingesh
- **Current Skills**: Python, SQL, basic HTML
- **Missing Skills**: JavaScript, React, Node.js, MongoDB, REST APIs
- **Target**: Full Stack Developer
- **Outcome**: Swarm identifies missing skills, builds custom roadmap, tracks quiz progress, updates career match score, and Flash Pro mentors the student through every milestone.
