import { BOOK_POSTS, HASHTAG_URL, INSTAGRAM_REELS_URL, LINKEDIN_POSTS, READS_THREADS_URL, REELS } from '../data';
import { BookIcon, InstagramIcon, LinkedInIcon, PlayIcon, ReelIcon } from './Icons';

export function Blog() {
  return (
    <section id="blog" className="section-pad blog">
      <div className="container">
        <div className="eyebrow">BLOG</div>
        <h2 className="h2">Latest posts</h2>
        <p className="lede">Recent thoughts on aviation, revenue and data — from LinkedIn and Instagram.</p>
        <a
          className="hashtag-pill"
          href={HASHTAG_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow #rahulm2604 on LinkedIn (opens in a new tab)"
        >
          #rahulm2604 <span>Follow my posts ↗</span>
        </a>

        <div className="row-head first">
          <LinkedInIcon size={20} />
          <h3>On LinkedIn</h3>
        </div>
        <div className="carousel" role="region" aria-label="LinkedIn post previews" tabIndex={0}>
          {LINKEDIN_POSTS.map((p) => (
            <a key={p.url} className="post lift" href={p.url} target="_blank" rel="noopener noreferrer">
              <span className="post-tag">{p.tag}</span>
              <span className="post-title">{p.title}</span>
              <span className="post-excerpt">{p.excerpt}</span>
              <span className="post-cta">Open on LinkedIn ↗</span>
            </a>
          ))}
        </div>

        <div className="row-head spaced">
          <BookIcon />
          <h3>Book recommendations</h3>
          <a
            href={READS_THREADS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Search #rahulreads on Threads (opens in a new tab)"
            title="Search #rahulreads on Threads"
          >
            #rahulreads ↗
          </a>
        </div>
        <div className="carousel" role="region" aria-label="Book recommendation posts" tabIndex={0}>
          {BOOK_POSTS.map((b) => (
            <a key={b.url} className="post lift" href={b.url} target="_blank" rel="noopener noreferrer">
              <span className="post-tag">{b.tag}</span>
              <span className="book-head">
                <span className="book-title">{b.title}</span>
                <span className="book-author">by {b.author}</span>
              </span>
              <span className="post-excerpt">{b.excerpt}</span>
              <span className="post-cta">Read on LinkedIn ↗</span>
            </a>
          ))}
        </div>

        <div className="row-head spaced">
          <InstagramIcon size={20} />
          <h3>On Instagram</h3>
        </div>
        <div className="reels">
          {REELS.map((r, i) => (
            <a
              key={r.code}
              className="reel lift"
              href={`https://www.instagram.com/reel/${r.code}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch reel ${i + 1} on Instagram (opens in a new tab)`}
            >
              <img src={r.cover} alt={`Cover of Instagram reel ${i + 1} by @rm.music2604`} loading="lazy" />
              <span className="reel-badge" aria-hidden="true">
                <ReelIcon />
              </span>
              <span className="reel-overlay" aria-hidden="true">
                <span className="reel-play">
                  <PlayIcon />
                </span>
              </span>
            </a>
          ))}
        </div>
        <a className="inline-link reels-all" href={INSTAGRAM_REELS_URL} target="_blank" rel="noopener noreferrer">
          See all reels on Instagram ↗
        </a>
      </div>
    </section>
  );
}
