import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/db.json');

function getStoredApiKey() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return data.settings?.apiKey || data.settings?.anthropicApiKey || data.settings?.geminiApiKey;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function getActiveClient() {
  const customKey = getStoredApiKey();
  const anthropicKey = customKey?.startsWith('sk-ant') ? customKey : process.env.ANTHROPIC_API_KEY;
  const geminiKey = (customKey?.startsWith('AIza') || !customKey?.startsWith('sk-')) ? (customKey || process.env.GEMINI_API_KEY) : null;
  const openaiKey = (customKey?.startsWith('sk-') && !customKey?.startsWith('sk-ant')) ? customKey : process.env.OPENAI_API_KEY;

  if (anthropicKey && anthropicKey !== 'your_claude_api_key_here') {
    try {
      return {
        type: 'anthropic',
        client: new Anthropic({ apiKey: anthropicKey }),
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      };
    } catch (e) {
      console.warn('Anthropic client error:', e.message);
    }
  }

  if (geminiKey && geminiKey !== 'your_gemini_api_key_here' && geminiKey.length > 20) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      return {
        type: 'gemini',
        client: genAI,
        model: 'gemini-1.5-flash',
      };
    } catch (e) {
      console.warn('Gemini client error:', e.message);
    }
  }

  if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
    return {
      type: 'openai',
      apiKey: openaiKey,
      model: 'gpt-4o-mini',
    };
  }

  return null;
}

/**
 * Cleanly extracts JSON from an LLM response string
 */
export function extractJson(text) {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        // Fallback
      }
    }
    throw new Error(`Failed to parse JSON response: ${err.message}. Raw: ${text.slice(0, 100)}...`);
  }
}

/**
 * Universal caller for Claude, Gemini, or OpenAI with graceful intelligent fallback
 */
export async function callClaude({ systemPrompt, userPrompt, model = 'claude-sonnet-4-6', temperature = 0.4, maxTokens = 1500, fallbackFn }) {
  const active = getActiveClient();

  if (active) {
    try {
      if (active.type === 'anthropic') {
        const targetModel = model.includes('claude') ? model : 'claude-3-5-sonnet-20241022';
        const response = await active.client.messages.create({
          model: targetModel,
          max_tokens: maxTokens,
          temperature,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        });
        const responseText = response.content?.[0]?.text || '';
        return {
          text: responseText,
          source: 'claude-api',
          model: targetModel,
        };
      }

      if (active.type === 'gemini') {
        const genModel = active.client.getGenerativeModel({
          model: active.model,
          systemInstruction: systemPrompt,
        });
        const result = await genModel.generateContent(userPrompt);
        const responseText = result.response.text();
        return {
          text: responseText,
          source: 'gemini-api',
          model: active.model,
        };
      }

      if (active.type === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${active.apiKey}`,
          },
          body: JSON.stringify({
            model: active.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
        });
        const data = await res.json();
        const responseText = data.choices?.[0]?.message?.content || '';
        return {
          text: responseText,
          source: 'openai-api',
          model: active.model,
        };
      }
    } catch (apiError) {
      console.warn(`Live AI call failed (${apiError.message}), using high-intelligence conversational engine.`);
    }
  }

  // If no external API key, invoke the dynamic fallback engine
  if (fallbackFn) {
    const fallbackResult = await fallbackFn();
    return {
      text: typeof fallbackResult === 'string' ? fallbackResult : JSON.stringify(fallbackResult),
      source: 'smart-engine',
      model: 'SkillPath AI Conversational Brain',
    };
  }

  throw new Error('AI service unavailable and no fallback generator provided.');
}
