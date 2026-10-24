import { SupportFaq } from './SupportFaq';

/** The main site's Support page (#support). */
export function SupportPage({ hidden }: { hidden: boolean }) {
  if (hidden) return null;
  return (
    <section id="support" className="section-pad support-page" aria-label="Support and frequently asked questions">
      <div className="container">
        <SupportFaq context="site" />
      </div>
    </section>
  );
}
