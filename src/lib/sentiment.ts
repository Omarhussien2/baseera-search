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
