import { isPlaceholder } from '../data/services';

/** Shows a value, marking "[...]" placeholders as not yet confirmed. */
export function Value({ text }: { text: string }) {
  if (!isPlaceholder(text)) return <>{text}</>;
  return (
    <span className="bk-tbc" title="Placeholder — to be confirmed">
      {text.slice(1, -1)}
      <span className="bk-tbc-tag">TBC</span>
    </span>
  );
}
