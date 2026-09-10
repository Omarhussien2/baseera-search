import { Sentiment } from '@/types';

// Simple heuristic dictionary for Arabic sentiment (Mix of MSA and Egyptian slang)
const POSITIVE_WORDS = ['ممتاز', 'رائع', 'جيد', 'حلو', 'بطل', 'عاش', 'جميل', 'هايل', 'عظيم', 'تحفة', 'عالمي', 'نجاح', 'فرح', 'إنجاز', 'عجبني', 'مفيد'];
const NEGATIVE_WORDS = ['سيء', 'وحش', 'زفت', 'غبي', 'فشل', 'ضعيف', 'كارثة', 'حرام', 'غلط', 'مشكلة', 'مصيبة', 'أسوأ', 'مقرف', 'نصب', 'غضب'];

/**
 * Analyzes Arabic text to determine sentiment.
 * Currently uses a fast heuristic approach suitable for live monitoring.
 * Can be swapped with an AI model call (e.g. OpenAI/GLM) in the future.
 */
export function analyzeSentiment(text: string): { sentiment: Sentiment; confidence: number } {
  if (!text || text.trim() === '') return { sentiment: 'neutral', confidence: 1.0 };
  
  let score = 0;
  const normalizedText = text.toLowerCase();
  
  for (const word of POSITIVE_WORDS) {
    if (normalizedText.includes(word)) score += 1;
  }
  
  for (const word of NEGATIVE_WORDS) {
    if (normalizedText.includes(word)) score -= 1;
  }
  
  if (score > 0) {
    return { sentiment: 'positive', confidence: Math.min(0.5 + (score * 0.1), 0.99) };
  } else if (score < 0) {
    return { sentiment: 'negative', confidence: Math.min(0.5 + (Math.abs(score) * 0.1), 0.99) };
  }
  
  return { sentiment: 'neutral', confidence: 0.8 };
}

/**
 * Async sentiment analysis with optional AI provider (e.g., Google Gemini).
 * Falls back to heuristic analysis if AI provider fails or is not configured.
 */
export async function analyzeSentimentAsync(
  text: string,
  aiSettings?: { provider: string; apiKey?: string }
): Promise<{ sentiment: Sentiment; confidence: number }> {
  if (!text || text.trim() === '') {
    return analyzeSentiment(text);
  }

  if (aiSettings?.provider === 'gemini' && aiSettings.apiKey && aiSettings.apiKey.trim() !== '') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${aiSettings.apiKey.trim()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze the sentiment of this Arabic text. Reply with strictly one word: positive, negative, or neutral. Text: ${text}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || '';

        if (rawText.includes('positive')) {
          return { sentiment: 'positive', confidence: 0.95 };
        } else if (rawText.includes('negative')) {
          return { sentiment: 'negative', confidence: 0.95 };
        } else if (rawText.includes('neutral')) {
          return { sentiment: 'neutral', confidence: 0.95 };
        }
      }
    } catch (error) {
      console.error('Gemini sentiment analysis error, falling back to heuristic:', error);
    }
  } else if (aiSettings?.provider === 'tokenrouter') {
    if (aiSettings.apiKey && aiSettings.apiKey.trim() !== '') {
      try {
        const response = await fetch('https://api.tokenrouter.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${aiSettings.apiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'z-ai/glm-5.3-free',
            messages: [
              {
                role: 'user',
                content: `Analyze the sentiment of this Arabic text. Reply with strictly ONE english word: positive, negative, or neutral. Do not add any other text. Text: ${text}`,
              },
            ],
            temperature: 0,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.choices?.[0]?.message?.content?.trim().toLowerCase() || '';

          if (rawText.includes('positive')) {
            return { sentiment: 'positive', confidence: 0.95 };
          } else if (rawText.includes('negative')) {
            return { sentiment: 'negative', confidence: 0.95 };
          } else if (rawText.includes('neutral')) {
            return { sentiment: 'neutral', confidence: 0.95 };
          }
        }
      } catch (error) {
        console.error('TokenRouter sentiment analysis error, falling back to heuristic:', error);
      }
    }
  }

  return analyzeSentiment(text);
}

