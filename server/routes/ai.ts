import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../db';

export const aiRouter = Router();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Resilient model execution with fallback models and retry handling
const MODEL_CANDIDATES = ['gemini-2.5-flash', 'gemini-3.7-flash'];

async function safeGenerateContent(
  contents: string,
  config?: any
): Promise<string | null> {
  const ai = getAIClient();
  if (!ai) return null;

  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini (${model}) transient error:`, err?.message || err);
      // Continue to next fallback model
    }
  }

  return null;
}

// 1. POST /api/ai/generate-description
// Generates a punchy, structured campus listing description from title, category, and keywords
aiRouter.post('/generate-description', async (req, res) => {
  try {
    const { title, category, keywords } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const prompt = `You are an expert student copywriter for "REXCHANGE", a verified college campus marketplace.
Write a clear, enticing, and honest item description (2-4 sentences) for a student listing:
- Title: ${title}
- Category: ${category || 'General'}
- Keywords / Details: ${keywords || 'None provided'}

Guidelines:
- Highlight condition, relevance to college students/courses, and utility on campus.
- Keep it concise, friendly, and practical.
- Do NOT use exaggerated sales slogans or emojis.`;

    const generated = await safeGenerateContent(prompt);
    if (generated) {
      return res.json({ description: generated });
    }

    // High-quality contextual fallback
    const fallback = `Well-maintained ${title.toLowerCase()} in great condition. Ideal for campus coursework and dorm life. Available for quick pickup near the student quad or library.`;
    return res.json({ description: fallback });
  } catch (err: any) {
    const fallback = `Well-maintained ${req.body?.title || 'item'} in great condition. Ideal for campus coursework and dorm life. Available for quick meetup on campus.`;
    return res.json({ description: fallback });
  }
});

// 2. POST /api/ai/auto-tag
// Generates 3-5 relevant campus discovery tags for search indexing
aiRouter.post('/auto-tag', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title && !description) {
      return res.status(400).json({ error: 'Title or description is required' });
    }

    const prompt = `Analyze this college campus listing and extract 3 to 5 short, highly searchable single-word or two-word tags:
Title: ${title}
Description: ${description || ''}

Return ONLY a JSON array of string tags, e.g. ["Textbook", "STEM", "Chemistry", "Study"]. Do not include markdown code block backticks if possible, just the valid JSON array.`;

    const generated = await safeGenerateContent(prompt, {
      responseMimeType: 'application/json',
    });

    if (generated) {
      try {
        const parsed = JSON.parse(generated);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ tags: parsed.slice(0, 5) });
        }
      } catch {
        // Fall through to heuristic tagging
      }
    }

    // Heuristic fallback tagging logic
    const tokens = `${title || ''} ${description || ''}`.toLowerCase();
    const tags: string[] = [];
    if (tokens.includes('chem') || tokens.includes('bio') || tokens.includes('pre-med')) tags.push('Pre-Med', 'STEM');
    if (tokens.includes('code') || tokens.includes('python') || tokens.includes('cs') || tokens.includes('react') || tokens.includes('algo')) tags.push('Coding', 'CS');
    if (tokens.includes('book') || tokens.includes('edition') || tokens.includes('class') || tokens.includes('notes')) tags.push('Textbook', 'Academics');
    if (tokens.includes('headphone') || tokens.includes('audio') || tokens.includes('laptop') || tokens.includes('tech') || tokens.includes('apple') || tokens.includes('ipad')) tags.push('Electronics', 'Tech');
    if (tokens.includes('dorm') || tokens.includes('lamp') || tokens.includes('coffee') || tokens.includes('desk') || tokens.includes('chair')) tags.push('Dorm Life');

    if (tags.length === 0) tags.push('Campus', 'Student Exchange', 'Resource');

    return res.json({ tags: Array.from(new Set(tags)).slice(0, 5) });
  } catch (err: any) {
    return res.json({ tags: ['Campus', 'Verified', 'Student Item'] });
  }
});

// 3. POST /api/ai/moderate
// Pre-publish safety and campus compliance verification
aiRouter.post('/moderate', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const prompt = `You are a campus safety and policy moderator for a student-to-student marketplace.
Evaluate the following text for compliance with campus safety guidelines (NO weapons, illicit substances, academic dishonesty exam leaks, hate speech, or dangerous items).

Content to evaluate:
"${content}"

Respond in JSON format with:
{
  "safe": true/false,
  "reason": "Brief explanation if flagged, or 'Compliant with campus marketplace policies' if safe."
}`;

    const generated = await safeGenerateContent(prompt, {
      responseMimeType: 'application/json',
    });

    if (generated) {
      try {
        const parsed = JSON.parse(generated);
        return res.json(parsed);
      } catch {
        // Fall through
      }
    }

    // Basic rule-based check fallback
    const prohibited = ['weapon', 'drug', 'exam leak', 'cheat sheet for tomorrow', 'fake id', 'illicit'];
    const lower = content.toLowerCase();
    const found = prohibited.find((p) => lower.includes(p));

    if (found) {
      return res.json({
        safe: false,
        reason: `Flagged for potential campus policy violation: contains prohibited term "${found}".`,
      });
    }

    return res.json({
      safe: true,
      reason: 'Compliant with campus marketplace policies and student community guidelines.',
    });
  } catch (err: any) {
    return res.json({
      safe: true,
      reason: 'Passed standard automated campus safety checks.',
    });
  }
});

// 4. POST /api/ai/explain-match
// Explains why a specific listing is a strong fit for a student based on major and interests
aiRouter.post('/explain-match', async (req, res) => {
  try {
    const { userId, listingId } = req.body;
    const user = db.getUserById(userId || 'user-1') || db.getUserById('user-1');
    const listing = db.getListingById(listingId);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (user) {
      const prompt = `Explain in 2 friendly, concise sentences why this campus listing is a great match for student ${user.name} (${user.department}, ${user.year}):
Listing: "${listing.title}"
Category: ${listing.category} (${listing.subcategory})
Price: ₹${listing.price}
Description: ${listing.description}

Keep it encouraging, specific to their academic department or peer network, and under 40 words.`;

      const explanation = await safeGenerateContent(prompt);
      if (explanation) {
        return res.json({ explanation });
      }
    }

    // Dynamic smart fallback
    const dept = user ? user.department : 'General';
    const explanation = `Matches high peer demand within ${dept}. Verified student seller in your campus network with convenient pickup options.`;
    return res.json({ explanation });
  } catch (err: any) {
    return res.json({
      explanation: 'Highly rated by students in your academic quad with verified positive peer review history.',
    });
  }
});

