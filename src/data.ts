import reel1 from './assets/reel-1.jpg';
import reel2 from './assets/reel-2.jpg';
import reel3 from './assets/reel-3.jpg';
import reel4 from './assets/reel-4.jpg';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/rahulamehra/';
export const INSTAGRAM_URL = 'https://www.instagram.com/rm.music2604?dlrf=MWZ4MHR1eTJzNzMzcA%3D%3D';
export const INSTAGRAM_REELS_URL = 'https://www.instagram.com/rm.music2604/reels/';
/* "Schedule Appointment" opens the site's own booking page (src/coaching). */
export const BOOKING_URL = '#coaching';
export const HASHTAG_URL = 'https://www.linkedin.com/feed/hashtag/rahulm2604/';
/* LinkedIn content search results for the #rahulreads hashtag. */
export const READS_SEARCH_URL = 'https://www.linkedin.com/search/results/content/?keywords=%23rahulreads';
export const EMAIL = 'rahul.a.mehra@gmail.com';
export const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;

/* WhatsApp — number with country code. The icon only shows when this holds 10+ digits. */
export const WHATSAPP_NUMBER = '+919537784427';

/*
 * Support WhatsApp number (international format, country code once) for the "Chat on WhatsApp"
 * button on the Support/FAQ pages. Confirmed by Rahul as the support contact, October 2026.
 * Empty = no WhatsApp support button. This is ONLY a click-to-chat contact: automated booking
 * confirmations and reminders go to each customer's own number (server/notifications.ts).
 */
export const SUPPORT_WHATSAPP_NUMBER = '+919537784427';

/* Instagram reels — newest first. `code` is the part after /reel/ in the reel's link. */
export const REELS = [
  { code: 'DcOkQvsBUvN', cover: reel1 },
  { code: 'Daiihs6hRKh', cover: reel2 },
  { code: 'DZ5fN_KBVi2', cover: reel3 },
  { code: 'DZSoXB8h48y', cover: reel4 },
];

export interface LinkedInPost {
  tag: string;
  title: string;
  excerpt: string;
  url: string;
}

/* LinkedIn posts — newest first. */
export const LINKEDIN_POSTS: LinkedInPost[] = [
  {
    tag: 'AVIATION',
    title: 'Aircraft livery isn’t always just about airline branding.',
    excerpt:
      'Airlines often use their aircraft to showcase the culture and identity of their country — like All Nippon Airways’ Pokémon-themed Eevee livery in Japan.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7512531592171438080/',
  },
  {
    tag: 'DATA & ANALYTICS',
    title: 'Data collection is just the first step.',
    excerpt:
      'Manual data entry makes it hard to analyse trends. Even a simple Excel pivot table can slice and dice data within minutes — the real value is in how easily we can use it to decide better.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7509858721674629120/',
  },
  {
    tag: 'AIR INDIA',
    title: 'What does it feel like to fly on a brand-new aircraft on its first day?',
    excerpt:
      'Flying Air India’s latest Boeing line-fit aircraft, VT-AWD, on AI 2408 from Mumbai to Delhi — top-notch comfort, interiors and a cockpit-style flight display.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7502427354565357568/',
  },
  {
    tag: 'AVIATION',
    title: 'If you flew on 23rd July 2026, you were part of aviation history.',
    excerpt:
      '150,000+ commercial flights in a single day — the highest ever tracked by Flightradar24, driven by the overlap of US summer holidays and Europe’s peak season.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7487229817524772864/',
  },
];

export interface BookPost extends LinkedInPost {
  author: string;
}

/* Book recommendations — newest first. */
export const BOOK_POSTS: BookPost[] = [
  {
    tag: '#24 · BOOK',
    title: 'Make Time',
    author: 'Jake Knapp & John Zeratsky',
    excerpt:
      'Not your usual productivity book — a simple Highlight, Laser, Energize framework to focus on one important thing each day, avoid distractions and stay energised.',
    url: 'https://www.linkedin.com/feed/update/urn:li:activity:7502220013987336192/',
  },
  {
    tag: '#23 · BOOK',
    title: 'Steal Like an Artist',
    author: 'Austin Kleon',
    excerpt:
      'You don’t need to be original — you need to be curious. Observe, steal, improvise, execute: creativity as smart adaptation rather than invention.',
    url: 'https://www.linkedin.com/posts/rahulamehra_bookrecommendation-rahulm2604-rahulreads-share-7479538557376753664-62RH/',
  },
  {
    tag: '#22 · BOOK',
    title: 'The Dip',
    author: 'Seth Godin',
    excerpt:
      '“Never quit” isn’t always right. Every journey has a dip — if it’s a dead end, quit; if there’s light ahead, push through.',
    url: 'https://www.linkedin.com/posts/rahulamehra_bookrecommendation-rahulm2604-rahulreads-share-7475212728350171136-gNKO/',
  },
  {
    tag: '#21 · BOOK',
    title: 'A CEO’s Brew',
    author: 'Sanjiv Mehta',
    excerpt:
      'A leadership journey across North Africa, the Middle East, Bangladesh, the Philippines and India — blending business strategy with people-first leadership.',
    url: 'https://www.linkedin.com/posts/rahulamehra_bookrecommendation-rahulm2604-rahulreads-share-7473544322764681216-_x59/',
  },
];
