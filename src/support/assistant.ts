/*
 * Support assistant: answers visitors' questions ONLY from the shared FAQ (./faqData.ts).
 *
 * Matching is a small, deterministic keyword scorer — no AI service, no API key, nothing sent
 * anywhere, nothing stored. When no FAQ fits well enough it says so and offers human support
 * instead of guessing.
 *
 * To add an AI layer later, implement `SupportResponder` (e.g. call a server endpoint that only
 * uses the FAQ as its knowledge) and swap it in where `faqResponder` is used; the UI only depends
 * on the `AssistantReply` shape.
 */
import { FAQ_ITEMS, normalise, type FaqItem } from './faqData.ts';

export type SupportContext = 'home' | 'services' | 'course' | 'support';

export type AssistantReply =
  | { kind: 'answer'; item: FaqItem; related: FaqItem[] }
  | { kind: 'unknown'; suggestions: FaqItem[] }
  | { kind: 'smalltalk'; text: string; suggestions: FaqItem[] };

export type SupportResponder = (question: string, context: SupportContext) => Promise<AssistantReply>;

const byId = (ids: string[]) => ids.map((id) => FAQ_ITEMS.find((i) => i.id === id)).filter((i): i is FaqItem => !!i);

/** Suggested questions per page. Every id must exist in FAQ_ITEMS (checked by tests). */
export const CONTEXT_SUGGESTIONS: Record<SupportContext, string[]> = {
  home: ['what-is-here', 'services-available', 'pay-to-book', 'how-to-book', 'start-pmp', 'contact-rahul'],
  services: ['pay-to-book', 'how-to-book', 'book-mock-interview', 'change-cancel', 'link-when', 'contact-rahul'],
  course: ['start-pmp', 'learning-materials', 'content-not-loading', 'course-help', 'progress-missing', 'cannot-sign-in'],
  support: ['contact-rahul', 'how-to-book', 'where-link', 'cannot-sign-in', 'pay-to-book', 'report-issue'],
};

export const suggestionsFor = (context: SupportContext) => byId(CONTEXT_SUGGESTIONS[context]);

const STOP = new Set(
  'a an and are as at be but by can could do does for from get got have how i if in into is it its me my of on or our please should so that the their them then there this to us was we what which who why will with would you your yours hi hello hey thanks thank ok okay rahul website site want need know tell about any some'.split(' '),
);

/** A few everyday words mapped to the words the FAQ uses. */
const SYNONYMS: Record<string, string[]> = {
  price: ['free', 'pay', 'fee', 'cost'],
  cost: ['free', 'pay', 'fee', 'price'],
  pay: ['free', 'payment', 'fee', 'price'],
  paid: ['free', 'pay', 'payment'],
  charge: ['free', 'pay', 'fee'],
  money: ['free', 'pay', 'fee'],
  rupees: ['free', 'pay', 'fee', 'price'],
  reschedule: ['change', 'cancel'],
  postpone: ['change', 'cancel'],
  login: ['sign', 'signin'],
  logon: ['sign', 'signin'],
  password: ['sign', 'password'],
  zoom: ['meet', 'link', 'meeting'],
  meet: ['meeting', 'link'],
  call: ['session', 'meeting'],
  appointment: ['book', 'session', 'slot'],
  schedule: ['book', 'slot'],
  register: ['sign', 'account', 'create'],
  signup: ['sign', 'account', 'create'],
  materials: ['lessons', 'learning', 'resources'],
  resources: ['materials', 'lessons', 'learning'],
  notes: ['lessons', 'materials'],
  broken: ['error', 'loading', 'working'],
  crash: ['error', 'loading'],
  slow: ['loading'],
  contact: ['support', 'help', 'whatsapp'],
  phone: ['whatsapp', 'number', 'mobile'],
  mobile: ['phone'],
  interview: ['mock', 'interview'],
  pmp: ['course', 'pmp'],
};

const stem = (w: string) => w.replace(/(ings|ing|ed|es|s)$/, '') || w;

export function tokens(text: string): string[] {
  return normalise(text)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

interface Indexed {
  item: FaqItem;
  q: Set<string>;
  k: Set<string>;
  a: Set<string>;
}

const INDEX: Indexed[] = FAQ_ITEMS.map((item) => ({
  item,
  q: new Set(tokens(item.question).map(stem)),
  k: new Set((item.keywords ?? []).flatMap((k) => tokens(k)).map(stem)),
  a: new Set(tokens(item.answer.join(' ')).map(stem)),
}));

/** Scores every FAQ item for a question; higher is better. Exported for tests. */
export function rank(question: string): { item: FaqItem; score: number }[] {
  const words = tokens(question);
  if (!words.length) return [];
  const scored = INDEX.map((ix) => {
    let score = 0;
    for (const w of words) {
      const s = stem(w);
      const alts = (SYNONYMS[w] ?? []).map(stem);
      if (ix.q.has(s)) score += 3;
      else if (alts.some((x) => ix.q.has(x))) score += 2;
      if (ix.k.has(s)) score += 2;
      else if (alts.some((x) => ix.k.has(x))) score += 1;
      if (ix.a.has(s)) score += 1;
    }
    // Whole-question phrase match ("meeting link", "mock interview") is a strong signal.
    const nq = normalise(question);
    if (nq.length > 6 && normalise(ix.item.question).includes(nq)) score += 4;
    return { item: ix.item, score: score / Math.sqrt(words.length) };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
}

/** Minimum normalised score for a confident answer; below it the assistant admits it doesn't know. */
export const CONFIDENT = 2.4;

const GREETING = /^(hi|hello|hey|hii+|namaste|good (morning|afternoon|evening))\b[\s!.]*$/i;
const THANKS = /^(thanks|thank you|thx|ty|great|ok(ay)?|cool|got it)\b[\s!.]*$/i;

/** The built-in FAQ responder. */
export function answerFromFaq(question: string, context: SupportContext): AssistantReply {
  const q = question.trim();
  if (GREETING.test(q)) return { kind: 'smalltalk', text: 'Hello! Ask me a question, or pick one below.', suggestions: suggestionsFor(context) };
  if (THANKS.test(q)) return { kind: 'smalltalk', text: 'You’re welcome. Anything else I can help with?', suggestions: suggestionsFor(context) };

  const ranked = rank(q);
  const best = ranked[0];
  if (!best || best.score < CONFIDENT) {
    // Not confident: never guess. Offer the closest topics (if any) plus human support.
    const close = ranked.filter((r) => r.score >= 1).slice(0, 3).map((r) => r.item);
    return { kind: 'unknown', suggestions: close.length ? close : suggestionsFor(context).slice(0, 3) };
  }
  const related = ranked
    .slice(1)
    .filter((r) => r.score >= best.score * 0.5)
    .map((r) => r.item)
    .concat(FAQ_ITEMS.filter((i) => i.category === best.item.category))
    .filter((i, n, all) => i.id !== best.item.id && all.findIndex((x) => x.id === i.id) === n)
    .slice(0, 3);
  return { kind: 'answer', item: best.item, related };
}

export const faqResponder: SupportResponder = async (question, context) => answerFromFaq(question, context);
