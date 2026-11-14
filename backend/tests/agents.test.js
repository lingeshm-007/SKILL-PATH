import { describe, it } from 'node:test';
import assert from 'node:assert';
import { runSkillAnalyzerAgent } from '../src/agents/skillAnalyzerAgent.js';
import { runCareerMatcherAgent } from '../src/agents/careerMatcherAgent.js';
import { runLearningCuratorAgent } from '../src/agents/learningCuratorAgent.js';
import { runProgressMonitorAgent } from '../src/agents/progressMonitorAgent.js';
import { runResumeArchitectAgent, generateSmartAtsResume } from '../src/agents/resumeAgent.js';
import { chatWithMentor, generateAdaptiveAlert } from '../src/agents/mentorAgent.js';

describe('🤖 Autonomous Multi-Agent Swarm Unit Tests', () => {

  describe('Agent 1: Skill Analyzer Agent', () => {
    it('should accurately evaluate student skills and extract strengths and gaps', async () => {
      const result = await runSkillAnalyzerAgent({
        currentSkills: ['Python', 'SQL', 'HTML'],
        targetCareer: 'Full Stack Developer',
        certifications: 'Google IT Certificate',
        projects: 'Personal Blog in HTML',
      });

      assert.ok(result, 'Result should be defined');
      assert.ok(Array.isArray(result.strengths), 'Strengths should be an array');
      assert.ok(Array.isArray(result.weaknesses), 'Weaknesses should be an array');
      assert.ok(Array.isArray(result.gaps), 'Gaps should be an array');
      assert.ok(result.gaps.length > 0, 'Should identify missing competency gaps');
      assert.ok(result.gaps.some(g => g.toLowerCase().includes('react') || g.toLowerCase().includes('javascript')),
        'Should identify React or JavaScript as a gap for Full Stack Developer');
    });
  });

  describe('Agent 2: Career Matcher Agent', () => {
    it('should compute career match percentage and categorize acquired vs missing skills', async () => {
      const result = await runCareerMatcherAgent({
        targetCareer: 'Full Stack Developer',
        skillGaps: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        currentSkills: ['Python', 'SQL', 'HTML'],
      });

      assert.ok(result, 'Result should be defined');
      assert.strictEqual(typeof result.matchPercentage, 'number', 'Match percentage should be numeric');
      assert.ok(result.matchPercentage >= 0 && result.matchPercentage <= 100, 'Match percentage must be between 0 and 100');
      assert.ok(Array.isArray(result.userHas), 'userHas should be an array');
      assert.ok(Array.isArray(result.userMissing), 'userMissing should be an array');
      assert.strictEqual(result.userHas.length, 3, 'Should match 3 current skills');
    });
  });

  describe('Agent 3: Learning Curator Agent', () => {
    it('should generate personalized roadmap recommendations with course platforms and durations', async () => {
      const result = await runLearningCuratorAgent({
        skillGaps: ['JavaScript', 'React', 'Node.js'],
      });

      assert.ok(result, 'Result should be defined');
      assert.ok(Array.isArray(result.recommendations), 'Recommendations should be an array');
      assert.ok(result.recommendations.length > 0, 'Should curate courses for missing skills');
      
      const firstItem = result.recommendations[0];
      assert.ok(firstItem.skill, 'Roadmap item must specify skill');
      assert.ok(firstItem.course || firstItem.title, 'Roadmap item must have course title');
      assert.ok(firstItem.platform, 'Roadmap item must have platform');
      assert.ok(firstItem.url, 'Roadmap item must have valid link');
      assert.strictEqual(typeof firstItem.completed, 'boolean', 'Completed status must be boolean');
    });
  });

  describe('Agent 4: Progress Monitor Agent', () => {
    it('should generate 3 MCQ assessment questions for any skill', async () => {
      const result = await runProgressMonitorAgent({
        skillName: 'React',
        learnerContext: { name: 'Lingesh', targetCareer: 'Full Stack Developer' },
      });

      assert.ok(result, 'Result should be defined');
      assert.strictEqual(result.skill, 'React', 'Assessment skill must match input');
      assert.ok(Array.isArray(result.questions), 'Questions should be an array');
      assert.strictEqual(result.questions.length, 3, 'Must generate exactly 3 MCQs per assessment');
      
      result.questions.forEach((q, idx) => {
        assert.ok(q.question, `Question ${idx + 1} must have question text`);
        assert.ok(Array.isArray(q.options), `Question ${idx + 1} must have options array`);
        assert.strictEqual(q.options.length, 4, `Question ${idx + 1} must have 4 multiple-choice options`);
        const ans = q.answer || q.correct;
        assert.ok(['A', 'B', 'C', 'D'].includes(ans), `Question ${idx + 1} correct key must be A, B, C, or D`);
      });
    });
  });

  describe('Agent 5: AI Mentor Agent (Flash Pro)', () => {
    it('should produce intelligent, empathetic chat responses with injected learner context', async () => {
      const result = await chatWithMentor({
        message: 'How do I start learning React and building full stack projects?',
        chatHistory: [],
        userContext: {
          name: 'Lingesh',
          targetCareer: 'Full Stack Developer',
          currentSkills: ['Python', 'SQL', 'HTML'],
          skillGaps: ['JavaScript', 'React', 'Node.js'],
        },
      });

      assert.ok(result, 'Chat result should be defined');
      assert.ok(result.reply, 'Should return a reply string');
      assert.ok(result.reply.length > 50, 'Reply should be detailed and educational');
    });

    it('should generate adaptive alerts upon goal change or assessment failure', async () => {
      const alert = await generateAdaptiveAlert({
        triggerType: 'QUIZ_FAIL',
        detail: { skill: 'Node.js', score: 1 },
        userContext: { name: 'Lingesh', targetCareer: 'Full Stack Developer' },
      });

      assert.ok(alert, 'Adaptive alert must be generated');
      assert.ok(alert.message, 'Alert must have message text');
      assert.ok(alert.message.includes('Node.js'), 'Alert must reference the failed skill');
    });
  });

  describe('Agent 6: Resume Architect Agent', () => {
    it('should generate an ATS-friendly, role-tailored resume with score and keyword metrics', async () => {
      const result = await runResumeArchitectAgent({
        targetRole: 'Full Stack Developer',
        targetCompany: 'Google',
        experienceLevel: 'Entry-Level / Fresher',
        studentProfile: {
          name: 'Lingesh',
          email: 'lingesh@gmail.com',
          phone: '+91 98765 43210',
          location: 'Bengaluru, India',
          currentSkills: ['Python', 'SQL', 'HTML', 'JavaScript'],
          projects: 'Task Manager in React, Portfolio Website',
          certifications: 'Google Professional Web Development',
        },
      });

      assert.ok(result, 'Resume result must be defined');
      assert.ok(result.summary, 'Resume must contain executive summary');
      assert.ok(result.skills, 'Resume must contain structured skills');
      assert.ok(result.atsScore >= 70, 'ATS Score should meet minimum baseline threshold');
      assert.ok(Array.isArray(result.matchedKeywords), 'Matched keywords must be an array');
    });
  });

});
