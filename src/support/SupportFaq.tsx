import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { openChat } from '../contact/ChatWidget';
import { SUPPORT_WHATSAPP_NUMBER } from '../data';
import { SUPPORT_MESSAGE, whatsappChatUrl } from './whatsappLink';
import { categoryCounts, FAQ_CATEGORIES, FAQ_ITEMS, filterFaq, type FaqCategoryId } from './faqData';
import './support.css';

interface Props {
  /** "site": the main Support page. "course": inside the PMP® learning platform. */
  context: 'site' | 'course';
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function WhatsappGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
    </svg>
  );
}

/** Searchable, filterable FAQ with an accessible accordion. Content: ./faqData.ts. */
export function SupportFaq({ context }: Props) {
  const uid = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FaqCategoryId | 'all'>('all');
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => categoryCounts(FAQ_ITEMS), []);
  const categories = FAQ_CATEGORIES.filter((c) => counts[c.id] > 0);
  const results = useMemo(() => filterFaq(FAQ_ITEMS, query, category), [query, category]);
  const filtered = query.trim() !== '' || category !== 'all';

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const reset = () => {
    setQuery('');
    setCategory('all');
    searchRef.current?.focus();
  };

  /* Arrow keys, Home and End move between question buttons (WAI-ARIA accordion pattern). */
  const onHeaderKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('.faq-q') ?? []);
    const i = buttons.indexOf(e.currentTarget);
    if (i < 0 || !buttons.length) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  };

  const course = context === 'course';
  const waUrl = whatsappChatUrl(SUPPORT_WHATSAPP_NUMBER, SUPPORT_MESSAGE[context]);
  const label = (id: FaqCategoryId) => FAQ_CATEGORIES.find((c) => c.id === id)?.label ?? id;

  return (
    <div className={`faq${course ? ' faq-in-course' : ''}`}>
      <header className="faq-hero">
        <span className="eyebrow">{course ? 'HELP & FAQS' : 'SUPPORT'}</span>
        <h2 className={course ? 'display faq-title-sm' : 'h2'} id={`${uid}-title`}>
          How can we help you?
        </h2>
        <p className="faq-lede">
          {course
            ? 'Answers about the PMP® course, your account and progress, and booking a session with Rahul.'
            : 'Find answers about the PMP® course, booking a free session, meeting links and WhatsApp updates.'}
        </p>
        <div className="faq-search" role="search">
          <label htmlFor={`${uid}-search`} className="sr-only">
            Search the FAQs
          </label>
          <span className="faq-search-icon">
            <SearchIcon />
          </span>
          <input
            ref={searchRef}
            id={`${uid}-search`}
            className="field faq-search-input"
            type="search"
            placeholder="Search, e.g. meeting link"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-controls={`${uid}-list`}
          />
        </div>
      </header>

      <div className="faq-cats" role="group" aria-label="Filter by topic">
        <button type="button" className="faq-cat" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
          All topics <span className="faq-count">{FAQ_ITEMS.length}</span>
        </button>
        {categories.map((c) => (
          <button key={c.id} type="button" className="faq-cat" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
            {c.label} <span className="faq-count">{counts[c.id]}</span>
          </button>
        ))}
      </div>

      <p className="faq-status" role="status" aria-live="polite">
        {filtered ? `${results.length} ${results.length === 1 ? 'question' : 'questions'} found` : ''}
        {filtered && results.length > 0 && (
          <button type="button" className="faq-reset" onClick={reset}>
            Clear search and filters
          </button>
        )}
      </p>

      <div className="faq-list" id={`${uid}-list`} ref={listRef}>
        {results.length === 0 ? (
          <div className="card faq-empty">
            <h3>No matching questions</h3>
            <p>
              Nothing matched “{query.trim()}”{category !== 'all' ? ` in ${label(category)}` : ''}. Try fewer or different words, or browse all topics.
            </p>
            <button type="button" className="btn btn-ghost btn-small" onClick={reset}>
              Clear search and filters
            </button>
          </div>
        ) : (
          results.map((item) => {
            const isOpen = open.has(item.id);
            const qId = `${uid}-q-${item.id}`;
            const aId = `${uid}-a-${item.id}`;
            return (
              <div key={item.id} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                <h3 className="faq-q-wrap">
                  <button id={qId} type="button" className="faq-q" aria-expanded={isOpen} aria-controls={aId} onClick={() => toggle(item.id)} onKeyDown={onHeaderKey}>
                    <span className="faq-q-text">
                      {category === 'all' && <span className="faq-q-cat">{label(item.category)}</span>}
                      {item.question}
                    </span>
                    <Chevron />
                  </button>
                </h3>
                <div id={aId} role="region" aria-labelledby={qId} className="faq-a" hidden={!isOpen}>
                  {item.answer.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {item.links && (
                    <p className="faq-links">
                      {item.links.map((l) => (
                        <a key={l.href + l.label} className="inline-link faq-link" href={l.href}>
                          {l.label} →
                        </a>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <section className="card faq-contact" aria-labelledby={`${uid}-contact`}>
        <div>
          <h3 id={`${uid}-contact`}>Still need help?</h3>
          <p>
            Can’t find the answer you’re looking for? Contact Rahul on WhatsApp and he’ll help you. WhatsApp opens with a message ready for you to
            review and send. If your question is about a booking or your account, add your booking reference or learner email address.
          </p>
        </div>
        <div className="faq-contact-actions">
          {waUrl && (
            <a className="btn btn-whatsapp btn-small" href={waUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat with Rahul on WhatsApp (opens WhatsApp in a new tab)">
              <WhatsappGlyph /> Chat on WhatsApp
            </a>
          )}
          <button type="button" className="btn btn-ghost btn-small" onClick={openChat}>
            Message by email
          </button>
          {course ? (
            <a className="btn btn-ghost btn-small" href="#pmp">
              Back to the course
            </a>
          ) : (
            <a className="btn btn-ghost btn-small" href="#coaching">
              Book a free session
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
