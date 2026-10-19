import { About } from './components/About';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PmpPath } from './components/PmpPath';
import { Services } from './components/Services';
import { CoachingPage } from './coaching/CoachingPage';
import { ChatWidget } from './contact/ChatWidget';
import { useHashView } from './hooks/useHashView';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const view = useHashView();
  const onPmp = view === 'pmp';
  const onHome = view === 'home';

  return (
    <div id="top" className="rm-root">
      <section className={onHome ? 'hero-sky' : 'hero-sky is-compact'}>
        <div className="container">
          <Header onPmp={onPmp} theme={theme} onToggleTheme={toggleTheme} />
          {onHome && <Hero />}
        </div>
      </section>

      {onHome && (
        <>
          <About />
          <Services />
        </>
      )}

      <PmpPath hidden={!onPmp} />
      <CoachingPage hidden={view !== 'coaching'} />

      {onHome && (
        <>
          <Blog />
          <Contact />
        </>
      )}

      <Footer />
      <ChatWidget />
    </div>
  );
}
