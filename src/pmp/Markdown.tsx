import { Fragment, type ReactNode } from 'react';

/*
 * Renders the small Markdown subset used by lesson bodies (see server/pmp/types.ts) as React
 * elements. No HTML is ever injected: text is always rendered as text.
 */

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={`${key}-b${i++}`}>{m[1]}</strong>);
    else out.push(<em key={`${key}-i${i++}`}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const next = () => `b${k++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push(<h4 key={next()}>{inline(line.slice(4), `h${k}`)}</h4>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(<h3 key={next()}>{inline(line.slice(3), `h${k}`)}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('|')) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const head = cells(rows[0]);
      const body = rows.slice(rows[1] && /^\|?\s*:?-{2,}/.test(rows[1]) ? 2 : 1).map(cells);
      const key = next();
      blocks.push(
        <div className="pmp-table-wrap" key={key} tabIndex={0} role="region" aria-label="Table">
          <table>
            <thead>
              <tr>{head.map((c, j) => <th key={j}>{inline(c, `${key}h${j}`)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c, `${key}${ri}-${j}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (line.startsWith('> ')) {
      const parts: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) parts.push(lines[i++].slice(2));
      const text = parts.join(' ');
      const label = /^\*\*([^*]+?):?\*\*:?\s*/.exec(text);
      const key = next();
      const kind = label && /tip/i.test(label[1]) ? 'tip' : label && /source/i.test(label[1]) ? 'source' : 'note';
      blocks.push(
        <aside className={`pmp-callout pmp-callout-${kind}`} key={key}>
          {label && <span className="pmp-callout-label">{label[1].replace(/:$/, '')}</span>}
          <p>{inline(label ? text.slice(label[0].length) : text, key)}</p>
        </aside>,
      );
      continue;
    }
    if (/^\s*- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*- /.test(lines[i])) items.push(lines[i++].replace(/^\s*- /, ''));
      const key = next();
      blocks.push(
        <ul key={key}>
          {items.map((t, j) => (
            <li key={j}>{inline(t, `${key}-${j}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, ''));
      const key = next();
      blocks.push(
        <ol key={key}>
          {items.map((t, j) => (
            <li key={j}>{inline(t, `${key}-${j}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |\||> |\s*- |\d+\. )/.test(lines[i])) para.push(lines[i++]);
    const key = next();
    blocks.push(<p key={key}>{inline(para.join(' '), key)}</p>);
  }
  return <Fragment>{blocks}</Fragment>;
}
