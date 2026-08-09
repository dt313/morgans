import Link from "next/link";

function NewspaperIcon() {
  return (
    <svg
      aria-hidden="true"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9h4" />
      <path d="M10 6h8" />
      <path d="M10 10h8" />
      <path d="M10 14h5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      aria-hidden="true"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg
      aria-hidden="true"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

const features = [
  {
    icon: <NewspaperIcon />,
    title: "Korean news, in Vietnamese",
    description:
      "Every day we collect top stories from Korean outlets, summarize them, and translate them into Vietnamese — so you never miss what matters.",
  },
  {
    icon: <ChatIcon />,
    title: "Chat with the news AI",
    description:
      "Ask anything about the stories in the app. Answers are grounded only in our news — no random internet noise, no out-of-date trivia.",
  },
  {
    icon: <AudioIcon />,
    title: "Daily audio briefing",
    description:
      "A short audio summary each morning, built from the day's top stories. Perfect for the commute or your first coffee.",
  },
];

const steps = [
  {
    step: "01",
    title: "Collect",
    description:
      "We monitor trusted Korean news sources around the clock and pull the day's most important stories.",
  },
  {
    step: "02",
    title: "Summarize & translate",
    description:
      "Each story is condensed by our news AI and translated into natural Vietnamese, with key topics highlighted.",
  },
  {
    step: "03",
    title: "Read, chat, or listen",
    description:
      "Browse the feed, ask the news AI questions about what you read, or play your daily audio briefing.",
  },
];

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <div className="landing-container landing-nav">
          <Link href="/" className="brand">
            briefly<span>.</span>
          </Link>
          <nav className="landing-nav-links" aria-label="Site navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <Link href="/feed" className="landing-cta-link">
              Read the news
            </Link>
          </nav>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-container">
          <p className="landing-kicker">Korea · summarized · daily</p>
          <h1>
            Korean news,
            <br />
            delivered your way.
          </h1>
          <p className="landing-lead">
            Briefly collects and summarizes Korea&apos;s top stories into
            Vietnamese, lets you ask the news AI anything about them, and reads
            you a short briefing every morning.
          </p>
          <div className="landing-actions">
            <Link href="/feed" className="landing-btn landing-btn-primary">
              Start reading
            </Link>
            <a href="#features" className="landing-btn landing-btn-ghost">
              See what&apos;s inside
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="landing-section">
        <div className="landing-container">
          <p className="landing-kicker">What you get</p>
          <h2>Three ways to keep up with Korea.</h2>
          <div className="landing-features">
            {features.map((feature) => (
              <article className="landing-feature" key={feature.title}>
                <div className="landing-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-section landing-section-alt"
      >
        <div className="landing-container">
          <p className="landing-kicker">How it works</p>
          <h2>From Seoul to your screen, every day.</h2>
          <div className="landing-steps">
            {steps.map((item) => (
              <article className="landing-step" key={item.step}>
                <span className="landing-step-num">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-container">
          <h2>Start your morning briefing.</h2>
          <p>
            Today&apos;s Korea, summarized and translated — ready whenever you
            are.
          </p>
          <Link href="/feed" className="landing-btn landing-btn-primary">
            Go to the news feed
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container">
          <span className="brand">
            briefly<span>.</span>
          </span>
          <span className="landing-copyright">
            Korean news, summarized for Vietnam.
          </span>
        </div>
      </footer>
    </main>
  );
}
