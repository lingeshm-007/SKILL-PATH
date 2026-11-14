import { describe, it } from 'node:test';
import assert from 'node:assert';

// Frontend Logic & Utility Functions
function calculateRoadmapProgress(roadmap = []) {
  if (!roadmap || roadmap.length === 0) return 0;
  const completed = roadmap.filter(item => item.completed).length;
  return Math.round((completed / roadmap.length) * 100);
}

function calculateCareerMatch(currentSkills = [], requiredSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) return 0;
  const lowerCurrent = currentSkills.map(s => s.toLowerCase());
  const matched = requiredSkills.filter(r => lowerCurrent.includes(r.toLowerCase()));
  return Math.round((matched.length / requiredSkills.length) * 100);
}

function computeAtsScore(targetKeywords = [], resumeText = '') {
  if (!targetKeywords || targetKeywords.length === 0) return 85;
  const lowerResume = resumeText.toLowerCase();
  const matched = targetKeywords.filter(kw => lowerResume.includes(kw.toLowerCase()));
  const pct = Math.round((matched.length / targetKeywords.length) * 100);
  return Math.max(70, Math.min(98, 70 + Math.round(pct * 0.28)));
}

describe('⚛️ Frontend Core Business Logic & State Utilities', () => {

  describe('Roadmap Progress Meter Calculation', () => {
    it('should return 0% for empty or null roadmaps', () => {
      assert.strictEqual(calculateRoadmapProgress([]), 0);
      assert.strictEqual(calculateRoadmapProgress(null), 0);
    });

    it('should correctly calculate percentage of completed modules', () => {
      const mockRoadmap = [
        { skill: 'JavaScript', completed: true },
        { skill: 'React', completed: true },
        { skill: 'Node.js', completed: false },
        { skill: 'MongoDB', completed: false },
      ];
      assert.strictEqual(calculateRoadmapProgress(mockRoadmap), 50);
    });

    it('should return 100% when all skills are completed', () => {
      const mockRoadmap = [
        { skill: 'Python', completed: true },
        { skill: 'SQL', completed: true },
      ];
      assert.strictEqual(calculateRoadmapProgress(mockRoadmap), 100);
    });
  });

  describe('Career Match Percentage Formula', () => {
    it('should accurately compare current competencies against role requirements', () => {
      const studentSkills = ['Python', 'SQL', 'HTML'];
      const fullStackSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'HTML'];

      const score = calculateCareerMatch(studentSkills, fullStackSkills);
      assert.strictEqual(score, 50);
    });
  });

  describe('ATS Resume Score Engine', () => {
    it('should calculate keyword density and return a competitive ATS score between 70 and 98', () => {
      const keywords = ['React', 'Node.js', 'REST API', 'PostgreSQL', 'Docker', 'Git'];
      const sampleResume = `
        Experienced software engineer with expertise in React, Node.js, and building REST APIs.
        Proficient with Git version control and PostgreSQL database optimization.
      `;

      const atsScore = computeAtsScore(keywords, sampleResume);
      assert.ok(atsScore >= 80 && atsScore <= 98, `ATS score ${atsScore} must be high`);
    });
  });

});
