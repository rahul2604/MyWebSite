/* Booking notification (owner) and confirmation (booker) emails. */

export interface BookingEmailData {
  reference: string;
  serviceTitle: string;
  /** e.g. "Tuesday, 20 October 2026" */
  dateLabel: string;
  /** e.g. "7:00 – 7:15 PM" */
  timeLabel: string;
  durationMinutes: number;
  name: string;
  email: string;
  whatsapp: string;
  purpose: string;
  heardFrom: string;
  ownerEmail: string;
  /** Live mode: the verified Google Meet joining URL. Absent in mock mode. */
  meetUrl?: string | null;
  /** Live mode: link to the event in the owner's Google Calendar (owner email only). */
  eventLink?: string | null;
}

const SITE = 'rahulmehra.co.in';
const DEMO_NOTE = 'This is a demo booking from the new booking system on rahulmehra.co.in. The meeting link will be shared separately.';
const JOIN_STEPS = [
  'At your start time (IST), open the Google Meet link — on a computer it opens in your browser; on a phone you can use the Google Meet app.',
  'Allow camera and microphone access when asked.',
  'If you are asked to wait, Rahul will let you in.',
];

const button = (href: string, label: string, bg = '#2557d6') =>
  `<a href="${e(href)}" style="display:inline-block;padding:13px 22px;margin:0 8px 8px 0;background:${bg};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:10px;font-family:Arial,Helvetica,sans-serif">${label}</a>`;

const meetCard = (url: string, withSteps: boolean) => `
  <tr><td style="padding:16px 28px 4px">
    <div style="padding:18px 20px;background:#eaf0fd;border:1px solid #c9d7f6;border-radius:12px">
      <div style="font-size:12px;letter-spacing:.14em;font-weight:700;color:#2557d6">GOOGLE MEET</div>
      <div style="margin:10px 0 6px">${button(url, 'Join Google Meet')}</div>
      <div style="font-size:13px;color:#475569;word-break:break-all">${e(url)}</div>
      ${withSteps ? `<ol style="margin:12px 0 0;padding-left:18px;font-size:13px;line-height:1.6;color:#334155">${JOIN_STEPS.map((s) => `<li>${e(s)}</li>`).join('')}</ol>` : ''}
    </div>
  </td></tr>`;

const e = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const row = (label: string, value: string) =>
  `<tr><td style="padding:10px 0;border-top:1px solid #e6eaf0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;width:130px;vertical-align:top">${label}</td>` +
  `<td style="padding:10px 0;border-top:1px solid #e6eaf0;font-size:14px;color:#0b1b33;vertical-align:top">${value}</td></tr>`;

function layout(opts: { preheader: string; pill: string; heading: string; sub: string; body: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#eef2f8;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${e(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f8"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dfe5ee;font-family:Arial,Helvetica,sans-serif">
  <tr><td style="background:#0b1b33;background-image:linear-gradient(135deg,#0b1b33 0%,#15274a 60%,#2557d6 140%);padding:26px 28px 24px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-weight:700;font-size:22px;letter-spacing:-.5px;color:#ffffff">RM<span style="color:#5b85f0">.</span></td>
      <td align="right"><span style="display:inline-block;padding:5px 12px;border-radius:99px;background:rgba(91,133,240,.22);border:1px solid rgba(169,194,242,.45);color:#cfe0ff;font-size:11px;font-weight:700;letter-spacing:.14em">${e(opts.pill)}</span></td>
    </tr></table>
    <div style="margin-top:18px;font-size:24px;line-height:1.25;font-weight:700;color:#ffffff">${e(opts.heading)}</div>
    <div style="margin-top:6px;font-size:14px;color:#a9c2f2">${e(opts.sub)}</div>
  </td></tr>
  ${opts.body}
</table>
<div style="max-width:600px;margin:14px auto 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a97ab;text-align:center">Sent automatically by the booking page on ${SITE}</div>
</td></tr></table></body></html>`;
}

const sessionCard = (d: BookingEmailData) => `
  <tr><td style="padding:22px 28px 6px">
    <div style="padding:18px 20px;background:#f5f8fd;border:1px solid #e3e9f4;border-radius:12px">
      <div style="font-size:12px;letter-spacing:.14em;font-weight:700;color:#2557d6">SESSION</div>
      <div style="margin-top:6px;font-size:18px;font-weight:700;color:#0b1b33">${e(d.serviceTitle)}</div>
      <div style="margin-top:6px;font-size:15px;color:#14233d">${e(d.dateLabel)}</div>
      <div style="font-size:15px;color:#14233d"><strong>${e(d.timeLabel)} IST</strong> · ${d.durationMinutes} minutes</div>
    </div>
  </td></tr>`;

const noteCard = (text: string) => `
  <tr><td style="padding:14px 28px 26px">
    <div style="padding:14px 16px;background:#fff4dc;border:1px solid #f2d9a3;border-radius:10px;font-size:13px;line-height:1.5;color:#6b4a00">${e(text)}</div>
  </td></tr>`;

/** Notification to Rahul. Reply-To is the booker. */
export function ownerEmail(d: BookingEmailData) {
  const live = !!d.meetUrl;
  const subject = `New booking: ${d.serviceTitle} — ${d.dateLabel}, ${d.timeLabel} IST (${d.reference})`.slice(0, 180);
  const wa = d.whatsapp.replace(/\D/g, '');
  const text = [
    `NEW BOOKING (${d.reference})`,
    '',
    `Service:   ${d.serviceTitle}`,
    `Date:      ${d.dateLabel}`,
    `Time:      ${d.timeLabel} IST (${d.durationMinutes} minutes)`,
    ...(live ? [`Meet:      ${d.meetUrl}`, ...(d.eventLink ? [`Calendar:  ${d.eventLink}`] : [])] : []),
    '',
    `Name:      ${d.name}`,
    `Email:     ${d.email}`,
    `WhatsApp:  ${d.whatsapp}`,
    `Heard via: ${d.heardFrom}`,
    '',
    'Purpose of the call:',
    d.purpose,
    '',
    live ? 'The event is in your Google Calendar with this Meet link. The booker received the same link.' : DEMO_NOTE,
    `Reply to this email to contact ${d.name}.`,
  ].join('\n');
  const body = `${sessionCard(d)}
  ${live ? meetCard(d.meetUrl!, false) : ''}
  ${live && d.eventLink ? `<tr><td style="padding:4px 28px 0">${button(d.eventLink, 'Open in Google Calendar', '#0b1b33')}</td></tr>` : ''}
  <tr><td style="padding:16px 28px 4px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Reference', `<strong>${e(d.reference)}</strong>`)}
      ${row('Name', e(d.name))}
      ${row('Email', `<a href="mailto:${e(d.email)}" style="color:#2557d6;text-decoration:none">${e(d.email)}</a>`)}
      ${row('WhatsApp', `<a href="https://wa.me/${wa}" style="color:#2557d6;text-decoration:none">${e(d.whatsapp)}</a>`)}
      ${row('Heard via', e(d.heardFrom))}
    </table>
  </td></tr>
  <tr><td style="padding:14px 28px 4px">
    <div style="font-size:12px;letter-spacing:.14em;font-weight:700;color:#2557d6">PURPOSE OF THE CALL</div>
    <div style="margin-top:10px;padding:16px 18px;background:#f5f8fd;border:1px solid #e3e9f4;border-radius:12px;font-size:15px;line-height:1.6;color:#14233d;white-space:pre-wrap;word-break:break-word">${e(d.purpose)}</div>
  </td></tr>
  ${noteCard(live ? `Reply to this email to reach ${d.name} directly.` : `${DEMO_NOTE} Reply to this email to reach ${d.name} directly.`)}`;
  const html = layout({
    preheader: `${d.name} booked ${d.serviceTitle} on ${d.dateLabel}, ${d.timeLabel} IST`,
    pill: 'NEW BOOKING',
    heading: `${d.name} booked a session`,
    sub: `Reference ${d.reference}`,
    body,
  });
  return { subject, text, html };
}

/** Confirmation to the booker. Reply-To is Rahul. */
export function bookerEmail(d: BookingEmailData) {
  const live = !!d.meetUrl;
  const first = d.name.split(/\s+/)[0] || d.name;
  const subject = live
    ? `Confirmed: ${d.serviceTitle} with Rahul Mehra — ${d.dateLabel}, ${d.timeLabel} IST`.slice(0, 180)
    : `Your booking with Rahul Mehra — ${d.dateLabel}, ${d.timeLabel} IST (${d.reference})`.slice(0, 180);
  const text = [
    `Hi ${first},`,
    '',
    live ? 'Your session with Rahul Mehra is confirmed. Here are your details:' : 'Thanks for booking a session with Rahul Mehra. Here are your details:',
    '',
    `Service:   ${d.serviceTitle}`,
    `Date:      ${d.dateLabel}`,
    `Time:      ${d.timeLabel} IST (${d.durationMinutes} minutes)`,
    `Reference: ${d.reference}`,
    ...(live ? ['', `Join Google Meet: ${d.meetUrl}`, '', 'How to join:', ...JOIN_STEPS.map((s, i) => `${i + 1}. ${s}`)] : ['', DEMO_NOTE]),
    '',
    'If you need to change or cancel, just reply to this email.',
  ].join('\n');
  const body = `
  <tr><td style="padding:24px 28px 0;font-size:15px;line-height:1.6;color:#14233d">Hi ${e(first)}, ${live ? 'your session with Rahul Mehra is confirmed' : 'thanks for booking a session with Rahul Mehra'}. Here are your details.</td></tr>
  ${sessionCard(d)}
  ${live ? meetCard(d.meetUrl!, true) : ''}
  <tr><td style="padding:16px 28px 4px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Reference', `<strong>${e(d.reference)}</strong>`)}
      ${row('Name', e(d.name))}
      ${row('Your email', e(d.email))}
      ${row('WhatsApp', e(d.whatsapp))}
    </table>
  </td></tr>
  ${noteCard(live ? 'Need to change or cancel? Just reply to this email.' : `${DEMO_NOTE} Need to change or cancel? Just reply to this email.`)}`;
  const html = layout({
    preheader: `${d.serviceTitle} · ${d.dateLabel}, ${d.timeLabel} IST · Ref ${d.reference}`,
    pill: live ? 'CONFIRMED' : 'BOOKING RECEIVED',
    heading: live ? 'Your session is confirmed' : 'Your session is booked',
    sub: `Reference ${d.reference}`,
    body,
  });
  return { subject, text, html };
}
