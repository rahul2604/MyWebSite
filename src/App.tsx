import { About } from './components/About';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PmpPath } from './components/PmpPath';
import { Services } from './components/Services';
import { useHashView } from './hooks/useHashView';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const view = useHashView();
  const onPmp = view === 'pmp';

  return (
    <div id="top" className="rm-root">
      <section className={onPmp ? 'hero-sky is-compact' : 'hero-sky'}>
        <div className="container">
          <Header onPmp={onPmp} theme={theme} onToggleTheme={toggleTheme} />
          {!onPmp && <Hero />}
        </div>
      </section>

      {!onPmp && (
        <>
          <About />
          <Services />
        </>
      )}

      <PmpPath hidden={!onPmp} />

      {!onPmp && (
        <>
          <Blog />
          <Contact />
        </>
      )}

      <Footer />
    </div>
  );
}
