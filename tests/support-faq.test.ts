/* Support FAQ content and search/filter logic (shared by #support and #pmp/support). */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { categoryCounts, FAQ_CATEGORIES, FAQ_ITEMS, filterFaq, normalise } from '../src/support/faqData.ts';
import { SUPPORT_MESSAGE, whatsappChatUrl } from '../src/support/whatsappLink.ts';

// src/data.ts imports images, so read the constant from its source instead of importing it.
const SUPPORT_WHATSAPP_NUMBER = /SUPPORT_WHATSAPP_NUMBER = '([^']*)'/.exec(readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8'))?.[1];

describe('FAQ content', () => {
  test('ids are unique, every item has a known category, and no category is empty', () => {
    const ids = FAQ_ITEMS.map((i) => i.id);
    assert.equal(new Set(ids).size, ids.length);
    const cats = new Set(FAQ_CATEGORIES.map((c) => c.id));
    for (const i of FAQ_ITEMS) {
      assert.ok(cats.has(i.category), i.id);
      assert.ok(i.question.trim().endsWith('?'), `${i.id} question`);
      assert.ok(i.answer.length > 0 && i.answer.every((p) => p.trim().length > 20), `${i.id} answer`);
    }
    const counts = categoryCounts(FAQ_ITEMS);
    for (const c of FAQ_CATEGORIES) assert.ok(counts[c.id] > 0, `${c.id} is empty`);
  });

  test('no invented contact details, no price claims for the PMP course', () => {
    const text = JSON.stringify(FAQ_ITEMS);
    assert.ok(!/\+?\d[\d\s-]{8,}\d/.test(text.replace(/\+91 98765 43210/g, '')), 'no phone numbers except the format example');
    assert.ok(!/@[a-z0-9-]+\.[a-z]{2,}/i.test(text), 'no email addresses');
    assert.ok(!/₹|\bINR\b|\$\d/.test(text), 'no prices');
    const course = FAQ_ITEMS.find((i) => i.id === 'course-price')!;
    assert.ok(!/course (itself )?is free/i.test(course.answer.join(' ')));
  });

  test('support WhatsApp is Rahul’s confirmed number, stored once in international format', () => {
    assert.equal(SUPPORT_WHATSAPP_NUMBER, '+919537784427');
    assert.ok(!/^\+?9191/.test(SUPPORT_WHATSAPP_NUMBER ?? ''), 'country code not duplicated');
  });

  test('links point only to on-site views', () => {
    for (const i of FAQ_ITEMS) for (const l of i.links ?? []) assert.match(l.href, /^#(coaching|pmp|support|contact)/, `${i.id}: ${l.href}`);
  });
});

describe('FAQ search and filtering', () => {
  test('empty query returns everything; category filter narrows', () => {
    assert.equal(filterFaq(FAQ_ITEMS, '').length, FAQ_ITEMS.length);
    const meetings = filterFaq(FAQ_ITEMS, '', 'meetings');
    assert.ok(meetings.length > 0 && meetings.every((i) => i.category === 'meetings'));
  });

  test('matches questions, answers and keywords, case- and accent-insensitive, all words required', () => {
    assert.ok(filterFaq(FAQ_ITEMS, 'MEETING LINK').some((i) => i.id === 'where-link'));
    assert.ok(filterFaq(FAQ_ITEMS, 'reschedule').some((i) => i.id === 'change-cancel'), 'keyword match');
    assert.ok(filterFaq(FAQ_ITEMS, 'pmp certificate').some((i) => i.id === 'course-contents'), '® ignored');
    assert.ok(filterFaq(FAQ_ITEMS, 'forgot password').some((i) => i.id === 'cannot-sign-in'));
    assert.ok(filterFaq(FAQ_ITEMS, 'whatsapp reminder').every((i) => normalise(JSON.stringify(i)).includes('remind')));
  });

  test('search within a category, and no-match returns an empty list', () => {
    assert.deepEqual(filterFaq(FAQ_ITEMS, 'password', 'pricing'), []);
    assert.deepEqual(filterFaq(FAQ_ITEMS, 'zzqx unicorn'), []);
    assert.ok(filterFaq(FAQ_ITEMS, 'free', 'pricing').length >= 2);
  });
});

describe('WhatsApp support link', () => {
  test('opens a chat with Rahul with a prefilled message (nothing is sent automatically)', () => {
    const url = whatsappChatUrl('+91 95377 84427', SUPPORT_MESSAGE.site)!;
    assert.equal(url, 'https://wa.me/919537784427?text=Hi%20Rahul%2C%20I%20need%20some%20help%20with%20your%20website.');
    assert.equal(new URL(url).searchParams.get('text'), 'Hi Rahul, I need some help with your website.');
    assert.equal(whatsappChatUrl(SUPPORT_WHATSAPP_NUMBER!, SUPPORT_MESSAGE.course), `https://wa.me/919537784427?text=${encodeURIComponent(SUPPORT_MESSAGE.course)}`);
  });

  test('refuses an empty or malformed number instead of building a broken link', () => {
    assert.equal(whatsappChatUrl('', 'x'), null);
    assert.equal(whatsappChatUrl('12345', 'x'), null);
    assert.equal(whatsappChatUrl('+0091 95377 84427', 'x'), null);
  });

  test('the support FAQ separates the support chat from automated booking notifications', () => {
    const contact = FAQ_ITEMS.find((i) => i.id === 'contact-rahul')!.answer.join(' ');
    assert.match(contact, /nothing is sent automatically/);
    assert.match(contact, /your own WhatsApp number/);
    const updates = FAQ_ITEMS.find((i) => i.id === 'whatsapp-updates')!.answer.join(' ');
    assert.match(updates, /may not be switched on yet/, 'must not claim automated messages are live');
  });

  test('the mock interview is described as free', () => {
    assert.ok(filterFaq(FAQ_ITEMS, 'mock interview free').some((i) => i.id === 'book-mock-interview'));
  });
});
