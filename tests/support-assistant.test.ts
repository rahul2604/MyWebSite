/* Support chatbot: answers only from the shared FAQ, context-aware suggestions, honest fallback. */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { answerFromFaq, CONTEXT_SUGGESTIONS, faqResponder, suggestionsFor, type SupportContext } from '../src/support/assistant.ts';
import { FAQ_CATEGORIES, FAQ_ITEMS } from '../src/support/faqData.ts';

const answerId = (q: string, ctx: SupportContext = 'home') => {
  const r = answerFromFaq(q, ctx);
  return r.kind === 'answer' ? r.item.id : r.kind;
};

describe('context-aware suggestions', () => {
  test('every suggested question exists in the shared FAQ and each page has its own set', () => {
    for (const [ctx, ids] of Object.entries(CONTEXT_SUGGESTIONS)) {
      assert.ok(ids.length >= 4, ctx);
      for (const id of ids) assert.ok(FAQ_ITEMS.some((i) => i.id === id), `${ctx}: unknown FAQ id ${id}`);
    }
    assert.notDeepEqual(CONTEXT_SUGGESTIONS.services, CONTEXT_SUGGESTIONS.course);
  });

  test('services page suggestions cover the requested topics', () => {
    const qs = suggestionsFor('services').map((i) => i.id);
    for (const id of ['pay-to-book', 'how-to-book', 'book-mock-interview', 'change-cancel', 'link-when', 'contact-rahul']) assert.ok(qs.includes(id), id);
  });

  test('course page suggestions cover access, materials, loading problems and help', () => {
    const qs = suggestionsFor('course').map((i) => i.id);
    for (const id of ['start-pmp', 'learning-materials', 'content-not-loading', 'course-help']) assert.ok(qs.includes(id), id);
  });
});

describe('matching typed questions to FAQ answers', () => {
  const cases: [string, string, SupportContext?][] = [
    ['Are the services free?', 'pay-to-book', 'services'],
    ['how much does it cost', 'pay-to-book'],
    ['Do I have to pay?', 'pay-to-book'],
    ['How do I book a service?', 'how-to-book', 'services'],
    ['How can I schedule a mock interview?', 'book-mock-interview', 'services'],
    ['can I reschedule my booking', 'change-cancel'],
    ['How do I cancel?', 'change-cancel'],
    ['When will I receive my meeting link?', 'link-when'],
    ['google meet link not working', 'link-not-working'],
    ['How can I contact support?', 'contact-rahul'],
    ['How do I access the course?', 'start-pmp', 'course'],
    ['Where can I find the learning materials?', 'learning-materials', 'course'],
    ['course is not loading', 'content-not-loading', 'course'],
    ['forgot my password', 'cannot-sign-in'],
    ['what does the mock interview cover', 'interview-covers'],
    ['is the pmp course free', 'course-price'],
  ];
  for (const [q, id, ctx] of cases) {
    test(`"${q}" → ${id}`, () => assert.equal(answerId(q, ctx), id));
  }

  test('answers come verbatim from the FAQ and include related questions, never the same one', () => {
    const r = answerFromFaq('How do I book a service?', 'services');
    assert.equal(r.kind, 'answer');
    if (r.kind !== 'answer') return;
    assert.deepEqual(r.item, FAQ_ITEMS.find((i) => i.id === 'how-to-book'));
    assert.ok(r.related.length > 0 && r.related.length <= 3);
    assert.ok(r.related.every((i) => i.id !== r.item.id));
  });
});

describe('unknown questions and small talk', () => {
  test('unrelated questions are not answered with a guess', () => {
    for (const q of ['What is the weather in Mumbai?', 'Who won the cricket match yesterday', 'asdfgh qwerty', 'Can you write my CV for me']) {
      const r = answerFromFaq(q, 'home');
      assert.equal(r.kind, 'unknown', q);
      if (r.kind === 'unknown') assert.ok(r.suggestions.length > 0 && r.suggestions.length <= 3);
    }
  });

  test('empty input and greetings are handled without inventing answers', () => {
    assert.equal(answerFromFaq('   ', 'home').kind, 'unknown');
    assert.equal(answerFromFaq('Hi', 'course').kind, 'smalltalk');
    assert.equal(answerFromFaq('thanks!', 'services').kind, 'smalltalk');
  });

  test('the responder interface is async (ready for a future AI layer) and needs no network', async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = (() => {
      throw new Error('the FAQ assistant must not make network calls');
    }) as typeof fetch;
    try {
      const r = await faqResponder('Are the services free?', 'services');
      assert.equal(r.kind, 'answer');
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});

describe('FAQ categories for the support page', () => {
  test('includes the requested sections', () => {
    const labels = FAQ_CATEGORIES.map((c) => c.label);
    for (const l of ['General support', 'Services', 'Bookings & appointments', 'PMP® course', 'Mock interviews', 'Technical issues']) assert.ok(labels.includes(l), l);
  });
});
