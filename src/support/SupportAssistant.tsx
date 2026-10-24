import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SUPPORT_WHATSAPP_NUMBER } from '../data';
import { faqResponder, suggestionsFor, type AssistantReply, type SupportContext } from './assistant.ts';
import type { FaqItem } from './faqData.ts';
import { SUPPORT_MESSAGE, whatsappChatUrl } from './whatsappLink.ts';
import './assistant.css';

type Message = { id: number; from: 'user'; text: string } | { id: number; from: 'bot'; reply: AssistantReply };

const MAX_QUESTION = 300;
const WELCOME: Record<SupportContext, string> = {
  home: 'Hi! I can answer common questions about Rahul’s free sessions, bookings and the PMP® course.',
  services: 'Hi! Questions about booking a free session? Pick one below or type your own.',
  course: 'Hi! Need help with the PMP® course? Pick a question below or type your own.',
  support: 'Hi! Ask a question, or pick one below. You can also browse every answer on this page.',
};

function waLink(context: SupportContext, question?: string) {
  const base = context === 'course' ? SUPPORT_MESSAGE.course : SUPPORT_MESSAGE.site;
  const q = question?.trim().slice(0, 200);
  return whatsappChatUrl(SUPPORT_WHATSAPP_NUMBER, q ? `${base.replace(/\.$/, '')}: ${q}` : base);
}

interface Props {
  context: SupportContext;
  /** Switch the panel to the email form. */
  onEmail: () => void;
}

/** FAQ-based support chat. Conversation lives in memory only: nothing is stored or sent anywhere. */
export function SupportAssistant({ context, onEmail }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);

  // Keep the newest reply in view (but start at the top, with the welcome and suggestions).
  useEffect(() => {
    const el = logRef.current;
    if (!el || messages.length === 0) return;
    const last = el.querySelector<HTMLElement>('.sa-msg.sa-bot:last-child');
    if (last && last.offsetHeight > el.clientHeight * 0.8) el.scrollTop = last.offsetTop - el.offsetTop - 8;
    else el.scrollTop = el.scrollHeight;
  }, [messages]);

  const ask = async (text: string, item?: FaqItem) => {
    const question = text.trim().slice(0, MAX_QUESTION);
    if (!question || busy) return;
    setBusy(true);
    setMessages((m) => [...m, { id: nextId.current++, from: 'user', text: question }]);
    // A clicked suggestion is answered directly; typed questions go through the matcher.
    let reply: AssistantReply;
    if (item) {
      const matched = await faqResponder(item.question, context);
      reply = { kind: 'answer', item, related: matched.kind === 'answer' ? matched.related.filter((i) => i.id !== item.id) : [] };
    } else {
      reply = await faqResponder(question, context);
    }
    setMessages((m) => [...m, { id: nextId.current++, from: 'bot', reply }]);
    setBusy(false);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
    setInput('');
  };

  const chips = (items: FaqItem[], label: string) =>
    items.length > 0 && (
      <div className="sa-chips" role="group" aria-label={label}>
        {items.map((i) => (
          <button key={i.id} type="button" className="sa-chip" onClick={() => void ask(i.question, i)} disabled={busy}>
            {i.question}
          </button>
        ))}
      </div>
    );

  const humanHelp = (question?: string) => {
    const url = waLink(context, question);
    return (
      <div className="sa-human">
        {url && (
          <a className="btn btn-whatsapp btn-small sa-wa" href={url} target="_blank" rel="noopener noreferrer" aria-label="Contact support on WhatsApp (opens WhatsApp in a new tab)">
            Contact Support on WhatsApp
          </a>
        )}
        <button type="button" className="sa-link" onClick={onEmail}>
          Or send a message by email
        </button>
      </div>
    );
  };

  return (
    <div className="sa">
      <div className="sa-log" ref={logRef} role="log" aria-live="polite" aria-label="Support conversation">
        <div className="sa-msg sa-bot">
          <p>{WELCOME[context]}</p>
          {chips(suggestionsFor(context), 'Suggested questions')}
        </div>

        {messages.map((m) => {
          if (m.from === 'user') {
            return (
              <div key={m.id} className="sa-msg sa-user">
                <p>{m.text}</p>
              </div>
            );
          }
          const r = m.reply;
          const asked = [...messages].reverse().find((x) => x.from === 'user' && x.id < m.id) as { text: string } | undefined;
          return (
            <div key={m.id} className="sa-msg sa-bot">
              {r.kind === 'answer' && (
                <>
                  <p className="sa-q">{r.item.question}</p>
                  {r.item.answer.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {r.item.links && (
                    <p className="sa-links">
                      {r.item.links.map((l) => (
                        <a key={l.href + l.label} href={l.href}>
                          {l.label} →
                        </a>
                      ))}
                    </p>
                  )}
                  {r.related.length > 0 && <p className="sa-sub">Related questions</p>}
                  {chips(r.related, 'Related questions')}
                  <details className="sa-more">
                    <summary>Didn’t solve it?</summary>
                    {humanHelp(asked?.text)}
                  </details>
                </>
              )}
              {r.kind === 'unknown' && (
                <>
                  <p>
                    Sorry, I don’t have an answer for that. I only answer from this site’s help articles, so I won’t guess. Rahul can help you directly.
                  </p>
                  {humanHelp(asked?.text)}
                  {r.suggestions.length > 0 && <p className="sa-sub">These might help</p>}
                  {chips(r.suggestions, 'Possibly related questions')}
                </>
              )}
              {r.kind === 'smalltalk' && (
                <>
                  <p>{r.text}</p>
                  {chips(r.suggestions, 'Suggested questions')}
                </>
              )}
            </div>
          );
        })}
      </div>

      <form className="sa-input" onSubmit={submit} role="search" aria-label="Ask a question">
        <label htmlFor="sa-question" className="sr-only">
          Type your question
        </label>
        <input
          id="sa-question" className="field" type="text" placeholder="Type your question…" autoComplete="off"
          maxLength={MAX_QUESTION} value={input} onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-blue sa-send" disabled={!input.trim() || busy} aria-label="Send question">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
      <p className="sa-foot">
        <a href="#support">Browse all FAQs</a>
        <span aria-hidden="true"> · </span>
        Answers come from the site’s help articles. Your questions aren’t saved.
      </p>
    </div>
  );
}

