/*
 * A one-page landscape A4 certificate as a PDF, written by hand (no dependencies) so it
 * runs in Cloudflare Workers. Uses the standard Helvetica fonts with WinAnsi encoding;
 * characters outside Latin-1 are transliterated where possible (the verification page
 * always shows the name exactly as registered).
 */

export interface CertificateData {
  name: string;
  courseTitle: string;
  issuedOn: string; // e.g. "20 October 2026"
  code: string;
  verifyUrl: string;
  scoreText: string; // e.g. "Final assessment score: 86.4%"
}

// Helvetica advance widths (1/1000 em) for ASCII 32-126, from the standard AFM metrics.
const W = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584,
  584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667,
  611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500,
  722, 500, 500, 500, 334, 260, 334, 584,
];

function textWidth(s: string, size: number, bold: boolean): number {
  let w = 0;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    w += c >= 32 && c <= 126 ? W[c - 32] : 556;
  }
  return (w * size * (bold ? 1.07 : 1)) / 1000;
}

/** Latin-1 safe text: strip diacritics where that helps, replace anything else. */
export function pdfSafe(s: string): string {
  const ascii = s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
  let out = '';
  for (const ch of ascii) {
    const c = ch.codePointAt(0)!;
    out += c >= 32 && c <= 126 ? ch : c >= 160 && c <= 255 ? ch : '?';
  }
  return out;
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

export function certificatePdf(d: CertificateData): Uint8Array {
  const PW = 842;
  const PH = 595;
  const ops: string[] = [];
  const colour = (r: number, g: number, b: number) => `${r} ${g} ${b}`;
  const text = (s: string, size: number, y: number, bold = false, rgb = colour(0.1, 0.12, 0.16)) => {
    const safe = pdfSafe(s);
    const x = (PW - textWidth(safe, size, bold)) / 2;
    ops.push(`BT ${rgb} rg /${bold ? 'F2' : 'F1'} ${size} Tf ${x.toFixed(2)} ${y} Td (${esc(safe)}) Tj ET`);
  };

  // Frame
  ops.push(`${colour(0.98, 0.97, 0.94)} rg 0 0 ${PW} ${PH} re f`);
  ops.push(`${colour(0.11, 0.3, 0.42)} RG 3 w 28 28 ${PW - 56} ${PH - 56} re S`);
  ops.push(`${colour(0.72, 0.6, 0.35)} RG 1 w 40 40 ${PW - 80} ${PH - 80} re S`);

  text('CERTIFICATE OF COMPLETION', 30, 470, true, colour(0.11, 0.3, 0.42));
  text('This certifies that', 14, 425);
  text(d.name, 32, 380, true);
  ops.push(`${colour(0.72, 0.6, 0.35)} RG 0.8 w 221 368 m 621 368 l S`);
  text('has completed the course', 14, 338);
  text(d.courseTitle, 17, 310, true, colour(0.11, 0.3, 0.42));
  text(d.scoreText, 12, 282);
  text(`Issued ${d.issuedOn}`, 12, 262);
  text(`Certificate ID: ${d.code}`, 11, 214, true);
  text(`Verify at ${d.verifyUrl}`, 10, 198);
  text('Issued by Rahul Mehra (independent course). This is not a PMI credential and is not', 9, 120, false, colour(0.35, 0.35, 0.38));
  text('affiliated with, endorsed by or authorised by the Project Management Institute (PMI).', 9, 107, false, colour(0.35, 0.35, 0.38));
  text('PMI, PMP and PMBOK are marks of the Project Management Institute, Inc.', 9, 94, false, colour(0.35, 0.35, 0.38));

  const content = ops.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    `<< /Length ${latin1Length(content)} >>\nstream\n${content}\nendstream`,
    `<< /Title (${esc(pdfSafe(`Certificate ${d.code}`))}) /Producer (rahulmehra.co.in) >>`,
  ];
  let pdf = '%PDF-1.4\n%âãÏÓ\n';
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(latin1Length(pdf));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = latin1Length(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return latin1Bytes(pdf);
}

const latin1Length = (s: string) => s.length; // every char is <= U+00FF after pdfSafe
function latin1Bytes(s: string): Uint8Array {
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff;
  return out;
}
