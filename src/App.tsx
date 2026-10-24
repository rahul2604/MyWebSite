import { AdminApp } from './admin/AdminApp';
import { About } from './components/About';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { CoachingPage } from './coaching/CoachingPage';
import { ChatWidget } from './contact/ChatWidget';
import { useHashView } from './hooks/useHashView';
import { PmpApp } from './pmp/PmpApp';
import { SupportPage } from './support/SupportPage';
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
          <Header onPmp={onPmp} onSupport={view === 'support'} theme={theme} onToggleTheme={toggleTheme} />
          {onHome && <Hero />}
        </div>
      </section>

      {onHome && (
        <>
          <About />
          <Services />
        </>
      )}

      <PmpApp hidden={!onPmp} />
      <AdminApp hidden={view !== 'admin'} />
      <CoachingPage hidden={view !== 'coaching'} />
      <SupportPage hidden={view !== 'support'} />

      {onHome && (
        <>
          <Blog />
          <Contact />
        </>
      )}

      <Footer />
      <ChatWidget context={view === 'admin' ? null : view === 'coaching' ? 'services' : view === 'pmp' ? 'course' : view === 'support' ? 'support' : 'home'} />
    </div>
  );
}
