import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CheckIcon, CloseIcon } from '../components/Icons';
import {
  ContactError, devHint, MESSAGE_MAX, sendContactMessage, validateContact, type ContactErrors, type ContactMessage,
} from './contactApi';
import type { SupportContext } from '../support/assistant.ts';
import { SupportAssistant } from '../support/SupportAssistant';
import './chat.css';

const EMPTY: ContactMessage = { name: '', email: '', whatsapp: '', message: '', website: '' };

const OPEN_CHAT_EVENT = 'rm:open-chat';
/** Opens the "Chat with Rahul" panel from anywhere on the site. */
export const openChat = () => window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
type Status = 'idle' | 'sending' | 'sent' | 'error';

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3.5 21l1.4-4.6A8.5 8.5 0 1 1 21 12z" />
      <path d="M8.5 10.5h7M8.5 14h4.5" />
    </svg>
  );
}

const GREETING_KEY = 'rm-support-greeting-dismissed';
const readFlag = () => {
  try {
    return sessionStorage.getItem(GREETING_KEY) === '1';
  } catch {
    return false;
  }
};
const writeFlag = () => {
  try {
    sessionStorage.setItem(GREETING_KEY, '1');
  } catch {
    /* storage unavailable: the greeting just shows again next visit */
  }
};

/*
 * Floating "Need help?" button and support panel: an FAQ assistant first ("help" mode), with the
 * existing "Chat with Rahul" email form one tap away ("email" mode). The email draft survives
 * closing the panel. `context` tailors the suggested questions; null hides the widget (admin).
 */
export function ChatWidget({ context = 'home' }: { context?: SupportContext | null }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'help' | 'email'>('help');
  const [greeting, setGreeting] = useState(false);
  const [form, setForm] = useState<ContactMessage>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [setupHint, setSetupHint] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  /** When the visitor started on this message; the server rejects implausibly fast submissions. */
  const startedAt = useRef<number | null>(null);

  // Other parts of the site (e.g. the Support page) open the email form with openChat().
  useEffect(() => {
    const onOpen = () => {
      setMode('email');
      setOpen(true);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  // A small, dismissible greeting once per browser session — never the panel itself.
  useEffect(() => {
    if (!context || context === 'support' || readFlag()) return;
    const t = window.setTimeout(() => setGreeting(true), 6000);
    return () => window.clearTimeout(t);
  }, [context]);
  const dismissGreeting = () => {
    setGreeting(false);
    writeFlag();
  };
  useEffect(() => {
    if (open && greeting) dismissGreeting();
  }, [open, greeting]);

  // Moving focus into the panel when switching between help and email.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>('input, textarea')?.focus();
  }, [mode]);

  // Focus the first field on open; return focus to the button on close; Escape closes.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      startedAt.current ??= Date.now();
      panelRef.current?.querySelector<HTMLElement>('input, textarea, button.chat-primary')?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    if (wasOpen.current) toggleRef.current?.focus();
  }, [open]);

  const set = (field: keyof ContactMessage, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[field as keyof ContactErrors];
      return next;
    });
    if (status === 'error') setStatus('idle');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(form);
    setErrors(found);
    const first = (['name', 'email', 'whatsapp', 'message'] as const).find((k) => found[k]);
    if (first) {
      panelRef.current?.querySelector<HTMLElement>(`#chat-${first}`)?.focus();
      return;
    }
    setStatus('sending');
    setServerError('');
    setSetupHint(null);
    try {
      await sendContactMessage(form, Date.now() - (startedAt.current ?? Date.now()));
      setStatus('sent');
      setForm(EMPTY);
      startedAt.current = null;
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof ContactError ? err.message : 'Your message could not be sent. Please try again later.');
      setSetupHint(err instanceof ContactError ? devHint(err.code) : null);
    }
  };

  const field = (key: 'name' | 'email' | 'whatsapp', label: string, type: string, autoComplete: string, hint?: string) => (
    <div className="chat-field">
      <label htmlFor={`chat-${key}`}>{label}</label>
      <input
        id={`chat-${key}`} className="field" type={type} autoComplete={autoComplete}
        value={form[key]} onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
        aria-describedby={[hint ? `chat-${key}-hint` : '', errors[key] ? `chat-${key}-err` : ''].filter(Boolean).join(' ') || undefined}
      />
      {hint && <span id={`chat-${key}-hint`} className="chat-hint">{hint}</span>}
      {errors[key] && <span id={`chat-${key}-err`} className="field-error">{errors[key]}</span>}
    </div>
  );

  if (context === null) return null;

  return (
    <div className="chat-root">
      {open && (
        <div ref={panelRef} id="chat-panel" className={`chat-panel is-${mode}`} role="dialog" aria-modal="false" aria-labelledby="chat-title">
          <div className="chat-head">
            {mode === 'email' && (
              <button type="button" className="chat-back" onClick={() => setMode('help')} aria-label="Back to help">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <div className="chat-head-text">
              <h2 id="chat-title">{mode === 'help' ? 'How can we help?' : 'Chat with Rahul'}</h2>
              <p>
                {mode === 'help' ? (
                  <>
                    <span className="chat-online" aria-hidden="true" /> Instant answers from our help articles
                  </>
                ) : (
                  "Send a message and I'll reply by email."
                )}
              </p>
            </div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close support panel">
              <CloseIcon />
            </button>
          </div>

          {/* Stays mounted while the panel is open, so the conversation survives a trip to the email form. */}
          <div className="chat-help" hidden={mode !== 'help'}>
            <SupportAssistant context={context ?? 'home'} onEmail={() => setMode('email')} />
          </div>
          {mode === 'help' ? null : status === 'sent' ? (
            <div className="chat-body chat-sent" role="status">
              <div className="ok-circle" aria-hidden="true">
                <CheckIcon />
              </div>
              <h3>Message sent</h3>
              <p>Your message has been sent successfully. Rahul will get back to you.</p>
              <button type="button" className="btn btn-ghost btn-small" onClick={() => setStatus('idle')}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="chat-body" onSubmit={submit} noValidate aria-label="Message Rahul">
              {field('name', 'Name', 'text', 'name')}
              {field('email', 'Email', 'email', 'email')}
              {field('whatsapp', 'WhatsApp number (optional)', 'tel', 'tel', 'With country code, e.g. +91 98765 43210')}
              <div className="chat-field">
                <label htmlFor="chat-message">Message</label>
                <textarea
                  id="chat-message" className="field chat-textarea" rows={4} maxLength={MESSAGE_MAX}
                  value={form.message} onChange={(e) => set('message', e.target.value)}
                  aria-invalid={!!errors.message} aria-describedby={errors.message ? 'chat-message-err' : undefined}
                />
                {errors.message && <span id="chat-message-err" className="field-error">{errors.message}</span>}
              </div>
              {/* Honeypot for bots: hidden from people and assistive tech. */}
              <div className="chat-hp" aria-hidden="true">
                <label htmlFor="chat-website">Website</label>
                <input id="chat-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
              </div>
              {status === 'error' && (
                <p className="chat-error" role="alert">
                  {serverError}
                  {setupHint && <span className="chat-dev-hint">{setupHint}</span>}
                </p>
              )}
              <button type="submit" className="btn btn-blue chat-primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      )}

      {greeting && !open && (
        <div className="chat-greeting" role="status">
          <button type="button" className="chat-greeting-text" onClick={() => { setMode('help'); setOpen(true); }}>
            Questions? Get instant answers here.
          </button>
          <button type="button" className="chat-greeting-close" onClick={dismissGreeting} aria-label="Dismiss support message">
            <CloseIcon />
          </button>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        className={open ? 'chat-toggle is-open' : 'chat-toggle'}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? 'Close support panel' : 'Need help? Open support chat'}
        onClick={() => {
          if (!open) setMode('help');
          setOpen((o) => !o);
        }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {!open && <span className="chat-dot" aria-hidden="true" />}
        <span className="chat-toggle-label" aria-hidden="true">
          {open ? 'Close' : 'Need help?'}
        </span>
      </button>
    </div>
  );
}
