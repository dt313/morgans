"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/imgs/logo.png";

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

function SparkleIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2l2.1 6.7L21 11l-6.9 2.3L12 20l-2.1-6.7L3 11l6.9-2.3L12 2z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
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

const stats = [
  { end: 15, suffix: "+", label: "Trusted Korean sources" },
  { end: 3, suffix: "", label: "Ways to read — feed, chat, listen" },
  { end: 2, suffix: "", label: "Languages: Korean → Vietnamese" },
  { end: 1, suffix: "", label: "Daily audio briefing" },
];

const headlines = [
  { tag: "MARKETS", text: "Bank of Korea holds policy rate steady at 2.75%" },
  { tag: "TECH", text: "Samsung unveils a slimmer foldable lineup for 2026" },
  {
    tag: "SEOUL",
    text: "Late-night subway service extended across the capital",
  },
  { tag: "K-POP", text: "K-pop acts sweep three global chart-topping spots" },
  { tag: "AI", text: "Naver and Kakao deepen their generative-AI bets" },
  { tag: "CULTURE", text: "Hallyu tourism hits a record high this summer" },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`landing-reveal${visible ? " is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(end * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} className="landing-countup">
      {value}
      {suffix}
    </span>
  );
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="landing-page">
      <header className={`landing-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="landing-container landing-nav">
          <Link href="/" className="brand">
            <Image
              src={logo}
              alt="Morgans"
              width={44}
              height={44}
              className="brand-logo"
              priority
            />
            Morgans<span>.</span>
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
        <div className="landing-grid-overlay" aria-hidden="true" />
        <span className="landing-orb landing-orb-1" aria-hidden="true" />
        <span className="landing-orb landing-orb-2" aria-hidden="true" />
        <span className="landing-orb landing-orb-3" aria-hidden="true" />

        <div className="landing-container">
          <Reveal>
            <p className="landing-badge">
              <span className="landing-badge-dot" aria-hidden="true" />
              <SparkleIcon />
              Live from Seoul · updated every morning
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1>
              Korean news,
              <br />
              delivered <span className="landing-title-accent">your way.</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="landing-lead">
              Morgans collects and summarizes Korea&apos;s top stories into
              Vietnamese, lets you ask the news AI anything about them, and
              reads you a short briefing every morning.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="landing-actions">
              <Link href="/feed" className="landing-btn landing-btn-primary">
                Start reading
                <ArrowIcon />
              </Link>
              <a href="#features" className="landing-btn landing-btn-ghost">
                See what&apos;s inside
              </a>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="landing-ticker" aria-hidden="true">
              <span className="landing-ticker-label">Trending now</span>
              <div className="landing-ticker-track">
                <div className="landing-ticker-list">
                  {[...headlines, ...headlines].map((headline, index) => (
                    <span key={index}>
                      <em>{headline.tag}</em>
                      {headline.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={420}>
            <div className="landing-stats">
              {stats.map((stat) => (
                <div className="landing-stat" key={stat.label}>
                  <b>
                    <CountUp end={stat.end} suffix={stat.suffix} />
                    <em>.</em>
                  </b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="features"
        className="landing-section landing-section-features"
      >
        <div className="landing-container">
          <Reveal>
            <div className="landing-section-heading">
              <p className="landing-kicker">What you get</p>
              <h2>Three ways to keep up with Korea.</h2>
              <p>
                One feed, three superpowers — read, ask, and listen your way
                through the stories that matter.
              </p>
            </div>
          </Reveal>

          <div className="landing-features">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 90}>
                <article
                  className="landing-feature"
                  onMouseMove={(event) => {
                    const el = event.currentTarget;
                    const rect = el.getBoundingClientRect();
                    el.style.setProperty(
                      "--mx",
                      `${event.clientX - rect.left}px`,
                    );
                    el.style.setProperty(
                      "--my",
                      `${event.clientY - rect.top}px`,
                    );
                  }}
                >
                  <div className="landing-feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="landing-section landing-section-alt"
      >
        <div className="landing-container">
          <Reveal>
            <div className="landing-section-heading">
              <p className="landing-kicker">How it works</p>
              <h2>From Seoul to your screen, every day.</h2>
              <p>
                A fully automated pipeline, running around the clock so your
                briefing is ready when you are.
              </p>
            </div>
          </Reveal>

          <div className="landing-steps">
            {steps.map((item, index) => (
              <Reveal key={item.step} delay={index * 110}>
                <article className="landing-step">
                  <span className="landing-step-num">
                    <span className="landing-step-chip">{item.step}</span>
                    Step {item.step}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <a href="/feed" className="landing-steps-link">
              See it in action
              <ArrowIcon />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-container">
          <Reveal>
            <div className="landing-cta-card">
              <p className="landing-cta-eyebrow">Start your morning briefing</p>
              <h2>Today&apos;s Korea, summarized &amp; translated.</h2>
              <p>Updated every morning — ready whenever you are.</p>
              <Link href="/feed" className="landing-btn landing-btn-light">
                Go to the news feed
                <ArrowIcon />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container">
          <span className="brand">
            <Image
              src={logo}
              alt="Morgans"
              width={36}
              height={36}
              className="brand-logo"
            />
            Morgans<span>.</span>
          </span>
          <span className="landing-copyright">
            Korean news, summarized for Vietnam.
          </span>
        </div>
      </footer>
    </main>
  );
}
