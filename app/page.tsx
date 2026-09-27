import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CALAFDOON — Find Your Person",
  description:
    "A modern matchmaking platform for meaningful relationships, built with Somali communities worldwide.",
};

export default function HomePage() {
  return (
    <div className="landing">
      <header className="site-header">
        <nav>
          <div className="logo">
            <svg viewBox="0 0 48 48" fill="none">
              <path
                d="M24 38C24 38 8 28.5 8 17.5C8 11.7 12.5 8 17 8C20.2 8 22.6 9.8 24 12.5C25.4 9.8 27.8 8 31 8C35.5 8 40 11.7 40 17.5C40 28.5 24 38 24 38Z"
                stroke="#FF486E"
                strokeWidth="3.2"
                strokeLinejoin="round"
              />
            </svg>
            CALAFDOON
          </div>
          <div className="nav-links">
            <a href="#discover">Discover</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#safety">Safety</a>
            <a href="#about">About</a>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="btn btn-ghost">Login</Link>
            <Link href="/signup" className="btn btn-primary">Create Account</Link>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Find Your Person.</h1>
            <p className="lede">
              A matchmaking platform built for people who want something real —
              starting with Somali communities worldwide, and built to welcome
              anyone looking for a lasting connection.
            </p>
            <div className="actions">
              <Link href="/signup" className="btn btn-primary">Create Free Account</Link>
              <a href="#how-it-works" className="btn btn-ghost">Discover How It Works</a>
            </div>
          </div>
          <div className="hero-mark">
            <svg viewBox="0 0 200 200" fill="none">
              <path
                className="mark-path"
                d="M100 165C100 165 30 120 30 73C30 49 49 32 70 32C84 32 96 40 100 52C104 40 116 32 130 32C151 32 170 49 170 73C170 120 100 165 100 165Z"
              />
            </svg>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="wrap">
          <h2>Everything about it is built around compatibility, not volume.</h2>
          <p className="section-sub">
            Six principles guide every part of the product, from the first
            profile prompt to your first conversation.
          </p>
          <div className="features-grid">
            <div className="feature">
              <svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" strokeLinecap="round" /></svg>
              <h3>Smart Matching</h3>
              <p>A transparent compatibility score based on goals, values, and lifestyle — not just proximity.</p>
            </div>
            <div className="feature">
              <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="9" /></svg>
              <h3>Verified Profiles</h3>
              <p>An identity verification badge so you know who you're really talking to.</p>
            </div>
            <div className="feature">
              <svg viewBox="0 0 24 24"><path d="M4 5h16v11H7l-3 3V5z" strokeLinejoin="round" /></svg>
              <h3>Private Messaging</h3>
              <p>Conversations open only after a mutual match, with full control over blocking and deletion.</p>
            </div>
            <div className="feature">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" /></svg>
              <h3>Global Community</h3>
              <p>Built for Somali communities across the world, and open to any country from day one.</p>
            </div>
            <div className="feature">
              <svg viewBox="0 0 24 24"><path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" /><circle cx="12" cy="8" r="4" /></svg>
              <h3>Meaningful Connections</h3>
              <p>Designed around relationship intent, not endless swiping or short-term attention.</p>
            </div>
            <div className="feature">
              <svg viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" /></svg>
              <h3>Safety First</h3>
              <p>Reporting, blocking, and moderation are built into the core experience, not bolted on.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="navy-section">
        <div className="wrap">
          <h2>More than just a dating platform.</h2>
          <p className="section-sub">
            CALAFDOON exists for people who are looking for something that
            lasts — a spouse, a partner, a real future together. Every part of
            the product, from the profile questions to the matching logic, is
            built around that intention rather than short-term interactions.
          </p>
        </div>
      </section>

      <section id="discover">
        <div className="wrap split">
          <div>
            <svg className="network" viewBox="0 0 400 300">
              <line x1="60" y1="60" x2="200" y2="150" />
              <line x1="200" y1="150" x2="340" y2="80" />
              <line x1="200" y1="150" x2="120" y2="240" />
              <line x1="200" y1="150" x2="300" y2="230" />
              <line x1="60" y1="60" x2="120" y2="240" />
              <circle cx="60" cy="60" r="7" />
              <circle cx="340" cy="80" r="7" />
              <circle cx="120" cy="240" r="7" />
              <circle cx="300" cy="230" r="7" />
              <circle className="hub" cx="200" cy="150" r="11" />
            </svg>
          </div>
          <div>
            <h2>Love knows no borders.</h2>
            <p className="section-sub">
              CALAFDOON connects Somali people across Somalia, Somaliland,
              Kenya, Ethiopia, Djibouti, the Gulf, and Somali communities in
              the UK, US, Canada, Europe, and Australia — with the same
              platform, wherever you are.
            </p>
          </div>
        </div>
      </section>

      <section id="safety">
        <div className="wrap">
          <h2>Meet with confidence.</h2>
          <p className="section-sub">Safety isn't a feature you have to look for — it's part of how the platform works.</p>
          <div className="safety-list">
            <div className="safety-item">
              <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" strokeLinecap="round" /><circle cx="12" cy="12" r="9" /></svg>
              <div><h3>Identity verification</h3><p>An optional verification badge confirms identity — it doesn't guarantee character, and we're upfront about that.</p></div>
            </div>
            <div className="safety-item">
              <svg viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /></svg>
              <div><h3>Private by default</h3><p>You control what's visible on your profile, and contact details are never exposed publicly.</p></div>
            </div>
            <div className="safety-item">
              <svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01" strokeLinecap="round" /><circle cx="12" cy="12" r="9" /></svg>
              <div><h3>Reporting & blocking</h3><p>Report or block anyone in a couple of taps, right from their profile or a conversation.</p></div>
            </div>
            <div className="safety-item">
              <svg viewBox="0 0 24 24"><path d="M4 5h16v11H7l-3 3V5z" /></svg>
              <div><h3>Photo & profile moderation</h3><p>Photos and profiles are reviewed to keep the community genuine.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works">
        <div className="wrap">
          <h2>How CALAFDOON works.</h2>
          <div className="steps">
            <div className="step"><div className="num">01</div><div><h3>Create your profile</h3><p>Add your photos, story, and what you're looking for.</p></div></div>
            <div className="step"><div className="num">02</div><div><h3>Tell us what you're looking for</h3><p>Set your preferences on age, location, values, and lifestyle.</p></div></div>
            <div className="step"><div className="num">03</div><div><h3>Discover compatible people</h3><p>See a transparent compatibility score and why you match.</p></div></div>
            <div className="step"><div className="num">04</div><div><h3>Connect when it's mutual</h3><p>A like only turns into a match when both people say yes.</p></div></div>
            <div className="step"><div className="num">05</div><div><h3>Start a conversation</h3><p>Message privately once you're matched — no pressure before that.</p></div></div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Real people. Real connections. Lasting love.</h2>
          <Link href="/signup" className="btn btn-primary">Create Free Account</Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 14 }}>
              <svg viewBox="0 0 48 48" fill="none">
                <path
                  d="M24 38C24 38 8 28.5 8 17.5C8 11.7 12.5 8 17 8C20.2 8 22.6 9.8 24 12.5C25.4 9.8 27.8 8 31 8C35.5 8 40 11.7 40 17.5C40 28.5 24 38 24 38Z"
                  stroke="#FF486E"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
              </svg>
              CALAFDOON
            </div>
            <p style={{ maxWidth: "32ch", fontSize: 14, lineHeight: 1.6 }}>
              A modern matchmaking platform for meaningful relationships, built with Somali communities worldwide.
            </p>
          </div>
          <div>
            <h4>Platform</h4>
            <ul>
              <li><a href="#discover">Discover</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#safety">Safety</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 CALAFDOON. All rights reserved.</span>
          <span>Adults only, 18+.</span>
        </div>
      </footer>
    </div>
  );
}
