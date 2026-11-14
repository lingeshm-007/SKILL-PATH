import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { initDB } from './data/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize database
initDB();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for agent calls
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`);
  }
  next();
});

// API Routes
app.use('/api', apiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillPath AI Agentic Backend',
    model: 'claude-sonnet-4-6',
    agents: [
      'Agent 1: Skill Analyzer Agent',
      'Agent 2: Career Matcher Agent',
      'Agent 3: Learning Curator Agent',
      'Agent 4: Progress Monitor Agent',
      'Agent 5: Mentor Agent (Orchestrator)',
      'Agent 6: Resume Architect Agent'
    ],
    timestamp: new Date().toISOString(),
  });
});

// Optional static serve if frontend is built
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) {
      // In dev mode, frontend is served by Vite on port 3000
      res.status(200).send('SkillPath AI Backend running. Frontend available at http://localhost:3000');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SkillPath AI Backend running on http://localhost:${PORT}`);
  console.log(`🤖 Claude Model configured: claude-sonnet-4-6`);
  console.log(`🧠 5 Multi-Agent Swarm initialized and ready`);
});
