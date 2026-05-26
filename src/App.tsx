import type {
  ChangeEvent,
  CSSProperties,
  Dispatch,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Mail,
  Menu,
  Send,
  X,
} from "lucide-react";
import {
  capabilities,
  clinicalIntelligenceImages,
  heroMetrics,
  monitoringSignals,
  navItems,
  operatingSignals,
  proofPoints,
  workflowSteps,
} from "./content";

const heroFadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const revealUp = {
  hidden: { opacity: 1, y: 16 },
  show: { opacity: 1, y: 0 },
};

const logoOptions = [
  {
    id: "nexus-sans",
    name: "Nexus Sans",
    description: "Clean network mark with a confident modern wordmark.",
    headerSrc: "/assets/logos/nexus-sans-header.png",
    footerSrc: "/assets/logos/nexus-sans-footer.png",
  },
  {
    id: "aperture-serif",
    name: "Aperture Serif",
    description: "Boutique serif direction with an editorial research feel.",
    headerSrc: "/assets/logos/aperture-serif-header.png",
    footerSrc: "/assets/logos/aperture-serif-footer.png",
  },
  {
    id: "axis-caps",
    name: "Axis Caps",
    description: "A strong uppercase system mark, sharp and institutional.",
    headerSrc: "/assets/logos/axis-caps-header.png",
    footerSrc: "/assets/logos/axis-caps-footer.png",
  },
  {
    id: "monogram-cut",
    name: "Monogram Cut",
    description: "Compact TR mark with a surgical diagonal cut.",
    headerSrc: "/assets/logos/monogram-cut-header.png",
    footerSrc: "/assets/logos/monogram-cut-footer.png",
  },
  {
    id: "halo-wordmark",
    name: "Halo Wordmark",
    description: "Minimal orbital symbol with a refined sans wordmark.",
    headerSrc: "/assets/logos/halo-wordmark-header.png",
    footerSrc: "/assets/logos/halo-wordmark-footer.png",
  },
  {
    id: "helix-line",
    name: "Helix Line",
    description: "Biotech-inspired without becoming literal or clinical.",
    headerSrc: "/assets/logos/helix-line-header.png",
    footerSrc: "/assets/logos/helix-line-footer.png",
  },
  {
    id: "substrate-grid",
    name: "Substrate Grid",
    description: "Modern matrix mark for study operations and data quality.",
    headerSrc: "/assets/logos/substrate-grid-header.png",
    footerSrc: "/assets/logos/substrate-grid-footer.png",
  },
  {
    id: "signature-serif",
    name: "Signature Serif",
    description: "Premium mixed-type wordmark with a quiet underline.",
    headerSrc: "/assets/logos/signature-serif-header.png",
    footerSrc: "/assets/logos/signature-serif-footer.png",
  },
  {
    id: "trace-mark",
    name: "Trace Mark",
    description: "Minimal signal line, more restrained than medical cliché.",
    headerSrc: "/assets/logos/trace-mark-header.png",
    footerSrc: "/assets/logos/trace-mark-footer.png",
  },
  {
    id: "capsule-lab",
    name: "Capsule Lab",
    description: "A clean capsule symbol with a premium clinical edge.",
    headerSrc: "/assets/logos/capsule-lab-header.png",
    footerSrc: "/assets/logos/capsule-lab-footer.png",
  },
  {
    id: "meridian-cross",
    name: "Meridian Cross",
    description: "Precision mark based on alignment, not decoration.",
    headerSrc: "/assets/logos/meridian-cross-header.png",
    footerSrc: "/assets/logos/meridian-cross-footer.png",
  },
  {
    id: "prism-delta",
    name: "Prism Delta",
    description: "Sharp triangular direction for a more tech-forward CRO.",
    headerSrc: "/assets/logos/prism-delta-header.png",
    footerSrc: "/assets/logos/prism-delta-footer.png",
  },
  {
    id: "registry-brackets",
    name: "Registry Brackets",
    description: "A premium compliance mark with editorial framing.",
    headerSrc: "/assets/logos/registry-brackets-header.png",
    footerSrc: "/assets/logos/registry-brackets-footer.png",
  },
  {
    id: "orbit-tr",
    name: "Orbit TR",
    description: "Balanced monogram with a controlled orbital gesture.",
    headerSrc: "/assets/logos/orbit-tr-header.png",
    footerSrc: "/assets/logos/orbit-tr-footer.png",
  },
  {
    id: "pure-wordmark",
    name: "Pure Wordmark",
    description: "No symbol, just a cleaner premium type direction.",
    headerSrc: "/assets/logos/pure-wordmark-header.png",
    footerSrc: "/assets/logos/pure-wordmark-footer.png",
  },
] as const;

type LogoOptionId = (typeof logoOptions)[number]["id"];

type LogoDraft = {
  option: LogoOptionId;
  scale: number;
};

const logoStorageKey = "thera-logo-png-draft-v2";

const defaultLogoDraft: LogoDraft = {
  option: "nexus-sans",
  scale: 100,
};

function isLogoOptionId(value: unknown): value is LogoOptionId {
  return logoOptions.some((option) => option.id === value);
}

function normalizeNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numberValue));
}

function normalizeLogoDraft(value: Partial<LogoDraft>): LogoDraft {
  return {
    option: isLogoOptionId(value.option)
      ? value.option
      : defaultLogoDraft.option,
    scale: normalizeNumber(value.scale, defaultLogoDraft.scale, 86, 118),
  };
}

function getLogoOption(id: LogoOptionId) {
  return logoOptions.find((option) => option.id === id) ?? logoOptions[0];
}

function getInitialLogoDraft() {
  if (typeof window === "undefined") {
    return defaultLogoDraft;
  }

  try {
    const storedDraft = window.localStorage.getItem(logoStorageKey);
    if (!storedDraft) {
      return defaultLogoDraft;
    }

    return normalizeLogoDraft(JSON.parse(storedDraft) as Partial<LogoDraft>);
  } catch {
    return defaultLogoDraft;
  }
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openService, setOpenService] = useState(0);
  const [logoDraft, setLogoDraft] = useState<LogoDraft>(getInitialLogoDraft);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const activeImages = clinicalIntelligenceImages;
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.34], [1, 1.07]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0.62]);
  const heroImageStyle = shouldReduceMotion
    ? { scale: 1, opacity: 1 }
    : { scale: heroScale, opacity: heroOpacity };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    window.localStorage.setItem(logoStorageKey, JSON.stringify(logoDraft));
  }, [logoDraft]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell theme-intelligence">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header
          menuOpen={menuOpen}
          menuButtonRef={menuButtonRef}
          setMenuOpen={setMenuOpen}
          logoDraft={logoDraft}
        />
        <main id="main-content" tabIndex={-1}>
        <section className="hero" id="home" aria-label="Thera Research">
          <motion.img
            className="hero__image"
            src={activeImages.hero}
            alt=""
            aria-hidden="true"
            style={heroImageStyle}
          />
          <div className="hero__shade" />
          <div className="hero__grid" aria-hidden="true" />
          <motion.div
            className="hero__content"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
            }}
          >
            <div className="hero__copy">
              <motion.p className="eyebrow" variants={heroFadeUp}>
                Clinical Research Organization / Chile
              </motion.p>
              <motion.h1 variants={heroFadeUp}>Thera Research</motion.h1>
              <motion.p className="hero__lead" variants={heroFadeUp}>
                A Clinical Research Organization based in Chile, specialized in
                clinical trials management and full Phase I-IV study support for
                pharmaceutical, biotechnology, generic drug, OTC/consumer
                healthcare, and medical device companies.
              </motion.p>
              <motion.div className="hero__actions" variants={heroFadeUp}>
                <MagneticButton href="#contact" variant="button--primary">
                  Start a study <ArrowRight size={18} aria-hidden="true" />
                </MagneticButton>
                <MagneticButton href="#patients" variant="button--ghost">
                  Patient recruitment
                </MagneticButton>
                <MagneticButton href="#logo-lab" variant="button--ghost">
                  Logo options
                </MagneticButton>
              </motion.div>
            </div>
            <StudyOpsPanel />
          </motion.div>
          <motion.dl
            className="hero__metrics"
            variants={heroFadeUp}
            aria-label="Thera Research operating metrics"
          >
            {heroMetrics.map((metric) => (
              <div className="metric" key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </motion.dl>
        </section>

        <LogoLab logoDraft={logoDraft} setLogoDraft={setLogoDraft} />

        <section className="intro section" id="company">
          <motion.div
            className="intro__content"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.p className="eyebrow eyebrow--dark" variants={revealUp}>
              Our company
            </motion.p>
            <motion.h2 variants={revealUp}>
              Clinical trial services for medical research studies in all diseases.
            </motion.h2>
            <motion.p variants={revealUp}>
              Thera Research provides flexibility in response to client
              outsourcing demands and assists throughout the clinical trial
              process, from site identification and strategic feasibility to
              activation, patient recruitment follow-up, site closure, and
              reporting.
            </motion.p>
          </motion.div>
          <motion.div
            className="intro__visual"
            initial={{ opacity: 1, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <img
              src={activeImages.lab}
              alt="Regulatory dossier and clinical startup materials on a research desk"
            />
            <div className="signal-strip" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </motion.div>
        </section>

        <section className="section services" id="services">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow eyebrow--dark">Services</p>
              <h2>Support across the clinical trial process.</h2>
            </div>
            <p>
              The service model covers site identification, feasibility, site
              selection, strategic partnerships, investigator qualification,
              activation, recruitment follow-up, and site closure.
            </p>
          </div>
          <div className="capability-list">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
              const serviceId = `service-${item.eyebrow}`;
              const isOpen = openService === index;

              return (
                <motion.article
                  className={`capability-row ${isOpen ? "is-open" : ""}`}
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.48,
                    delay: index * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <div className="capability-row__index">{item.eyebrow}</div>
                  <div className="capability-row__icon">
                    <Icon size={23} aria-hidden="true" />
                  </div>
                  <div className="capability-row__main">
                    <h3 className="capability-row__desktop-title">
                      {item.title}
                    </h3>
                    <button
                      className="capability-row__mobile-trigger"
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${serviceId}-details ${serviceId}-meta`}
                      onClick={() =>
                        setOpenService((current) =>
                          current === index ? -1 : index,
                        )
                      }
                    >
                      <span className="capability-row__trigger-copy">
                        <span>{item.title}</span>
                        <span className="capability-row__risk-pill">
                          {item.risk}
                        </span>
                      </span>
                      <ChevronRight
                        className="capability-row__mobile-chevron"
                        size={18}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className="capability-row__details"
                      id={`${serviceId}-details`}
                    >
                      <p>{item.copy}</p>
                    </div>
                  </div>
                  <dl className="capability-row__meta" id={`${serviceId}-meta`}>
                    <div>
                      <dt>Deliverable</dt>
                      <dd>{item.deliverable}</dd>
                    </div>
                    <div>
                      <dt>Risk controlled</dt>
                      <dd>{item.risk}</dd>
                    </div>
                  </dl>
                  <ChevronRight
                    className="capability-row__desktop-chevron"
                    size={22}
                    aria-hidden="true"
                  />
                </motion.article>
              );
            })}
          </div>
        </section>

        <WorkflowSection />

        <section className="monitoring section" id="monitoring">
          <div className="monitoring__copy">
            <p className="eyebrow eyebrow--dark">Clinical trial monitoring</p>
            <h2>CRA oversight for data quality and site interaction.</h2>
            <p>
              Skilled and highly trained CRAs conduct on-site monitoring visits
              throughout the study, overseeing data collection, reviewing source
              documentation and case report forms, ensuring regulatory
              compliance, and resolving data queries requested by clients.
            </p>
            <ul className="check-list">
              {monitoringSignals.map((item) => (
                <li key={item}>
                  <Check size={18} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <motion.div
            className="monitoring__panel"
            initial={{ opacity: 1, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.35 }}
          >
            <img
              src={activeImages.monitoring}
              alt="Clinical research associate reviewing source documents and study files"
            />
            <div className="panel-overlay">
              <span>On-site monitoring</span>
              <strong>CRA</strong>
              <small>Data collection, source documentation, CRFs, compliance, and query resolution.</small>
            </div>
          </motion.div>
        </section>

        <section className="proof section" id="positioning">
          <div className="section-heading section-heading--wide">
            <p className="eyebrow eyebrow--dark">Positioning</p>
            <h2>The CRO that takes responsibility.</h2>
            <p className="section-heading__support">
              The current Thera Research message centers on responsibility,
              investigator knowledge, site dynamics, quality, audits, and
              long-term sponsor and site relationships.
            </p>
          </div>
          <div className="proof-grid">
            {proofPoints.map((item, index) => {
              const Icon = item.icon;
              const itemNumber = String(index + 1).padStart(2, "0");

              return (
                <motion.article
                  key={item.title}
                  className={index === 0 ? "proof-item proof-item--lead" : "proof-item"}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.46,
                    delay: index * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <span className="proof-item__marker">{itemNumber}</span>
                  <div className="proof-item__icon">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <div className="proof-item__body">
                    <span className="proof-item__label">
                      {index === 0 ? "Primary signal" : "Supporting signal"}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="patients" id="patients">
          <div className="patients__content">
            <p className="eyebrow">Patient recruitment</p>
            <h2>Enrollment support shaped around study demographics.</h2>
            <p>
              Thera Research understands participant demographics in each
              therapeutic area, how to enroll efficiently, how to identify
              high-enrolling sites, and how best to work with them.
            </p>
          </div>
          <MagneticButton href="#contact" variant="button--light">
            Register interest <ArrowRight size={18} aria-hidden="true" />
          </MagneticButton>
        </section>

        <ContactSection />
      </main>

      <Footer logoDraft={logoDraft} />
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            onClose={() => setMenuOpen(false)}
            returnFocusRef={menuButtonRef}
          />
        )}
      </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function MagneticButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: string;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (shouldReduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  }

  function resetMotion() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      className={`button ${variant}`}
      href={href}
      style={shouldReduceMotion ? undefined : { x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMotion}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 130, damping: 18 }}
    >
      {children}
    </motion.a>
  );
}

function StudyOpsPanel() {
  return (
    <motion.div
      className="hero-panel"
      variants={heroFadeUp}
      aria-label="Clinical trial management summary"
    >
      <div className="hero-panel__top">
        <span className="live-dot" aria-hidden="true" />
        <p>Clinical trial management</p>
      </div>
      <div className="hero-panel__body">
        {operatingSignals.map((item) => (
          <div className="signal-row" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <div className="hero-panel__footer">
        <span>Regulatory experience</span>
        <strong>MoH / ISP inspections</strong>
      </div>
    </motion.div>
  );
}

function WorkflowSection() {
  return (
    <section className="workflow" id="workflow">
      <div className="workflow__inner">
        <div className="workflow__heading">
          <p className="eyebrow">Workflow</p>
          <h2>One process from site identification to closure.</h2>
          <p className="workflow__lead">
            The operating line follows the current Thera Research service path:
            identification, feasibility, selection, activation, monitoring,
            recruitment follow-up, and site closure.
          </p>
        </div>
        <div className="workflow__steps" aria-label="Study workflow checkpoints">
          {workflowSteps.map((item, index) => (
            <motion.article
              className="workflow-step"
              key={item.step}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.42,
                delay: index * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="workflow-step__node">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="workflow-step__body">
                <h3>{item.step}</h3>
                <p>{item.outcome}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-section section" id="contact">
      <div className="contact-section__copy">
        <p className="eyebrow eyebrow--dark">Contact</p>
        <h2>Start your next clinical study with Thera Research.</h2>
        <p>
          Contact the CRO that takes responsibility for driving and supporting
          sponsor and site staff, with the goal of reduced study timelines and
          enhanced study success.
        </p>
        <a className="email-link" href="mailto:x.verdina@theraresearch.com">
          <Mail size={18} aria-hidden="true" />
          x.verdina@theraresearch.com
        </a>
      </div>
      <ContactForm />
    </section>
  );
}

type FormStatus = "empty" | "error" | "loading" | "success";

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("empty");
  const timerRef = useRef<number | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const trimmedName = form.name.trim();
  const trimmedEmail = form.email.trim();
  const trimmedMessage = form.message.trim();
  const hasEmailShape = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const showNameError = status === "error" && !trimmedName;
  const showEmailError =
    status === "error" && (!trimmedEmail || !hasEmailShape);
  const showMessageError = status === "error" && !trimmedMessage;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status === "error" || status === "success") {
      setStatus("empty");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedName || !trimmedEmail || !hasEmailShape || !trimmedMessage) {
      setStatus("error");
      if (!trimmedName) {
        nameRef.current?.focus();
      } else if (!trimmedEmail || !hasEmailShape) {
        emailRef.current?.focus();
      } else {
        messageRef.current?.focus();
      }
      return;
    }

    setStatus("loading");
    timerRef.current = window.setTimeout(() => {
      setStatus("success");
    }, 820);
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      aria-label="Clinical study contact request"
      noValidate
    >
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input
            ref={nameRef}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Sponsor or study lead"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={showNameError}
            aria-describedby={`contact-name-hint${
              showNameError ? " contact-name-error" : ""
            }`}
          />
          <small id="contact-name-hint">
            Used only to identify the contact request.
          </small>
          {showNameError && (
            <small className="field-error" id="contact-name-error">
              Enter your name.
            </small>
          )}
        </label>
        <label>
          <span>Email</span>
          <input
            ref={emailRef}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@company.com"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={showEmailError}
            aria-describedby={`contact-email-hint${
              showEmailError ? " contact-email-error" : ""
            }`}
          />
          <small id="contact-email-hint">Corporate contact recommended.</small>
          {showEmailError && (
            <small className="field-error" id="contact-email-error">
              Enter a valid email address.
            </small>
          )}
        </label>
      </div>
      <label>
        <span>Study context</span>
        <textarea
          ref={messageRef}
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Therapeutic area, phase, sites, timeline, or recruitment needs"
          rows={5}
          required
          aria-required="true"
          aria-invalid={showMessageError}
          aria-describedby={`contact-message-hint${
            showMessageError ? " contact-message-error" : ""
          }`}
        />
        <small id="contact-message-hint">
          Include the minimum useful scope for feasibility review.
        </small>
        {showMessageError && (
          <small className="field-error" id="contact-message-error">
            Add the study context.
          </small>
        )}
      </label>

      <div className="form-status" aria-live="polite" aria-atomic="true">
        {status === "loading" ? (
          <div className="form-skeleton" aria-label="Preparing contact request">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <p
            className={`form-status__message form-status__message--${status}`}
            role={status === "error" ? "alert" : "status"}
          >
            {status === "empty" &&
              "Complete the fields to prepare a clinical study contact request."}
            {status === "error" && (
              <>
                <AlertCircle size={16} aria-hidden="true" />
                All fields are required for this demo flow.
              </>
            )}
            {status === "success" && (
              <>
                <Check size={16} aria-hidden="true" />
                Contact request prepared. Connect this form to CRM or email next.
              </>
            )}
          </p>
        )}
      </div>

      <button className="button button--submit" type="submit">
        Prepare request <Send size={17} aria-hidden="true" />
      </button>
    </form>
  );
}

function Header({
  menuOpen,
  menuButtonRef,
  setMenuOpen,
  logoDraft,
}: {
  menuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  setMenuOpen: (value: boolean) => void;
  logoDraft: LogoDraft;
}) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Thera Research home">
        <BrandLogo tone="header" logoDraft={logoDraft} />
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="header-contact" href="#contact">
        Contact
      </a>
      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

function LogoLab({
  logoDraft,
  setLogoDraft,
}: {
  logoDraft: LogoDraft;
  setLogoDraft: Dispatch<SetStateAction<LogoDraft>>;
}) {
  const selectedOption = getLogoOption(logoDraft.option);

  function updateLogoDraft(update: Partial<LogoDraft>) {
    setLogoDraft((current) => normalizeLogoDraft({ ...current, ...update }));
  }

  return (
    <section className="logo-lab section" id="logo-lab">
      <div className="logo-lab__heading">
        <div>
          <p className="eyebrow eyebrow--dark">Logo Lab</p>
          <h2>15 premium PNG directions for the Thera Research mark.</h2>
        </div>
        <p>
          Each option includes a white header PNG and a dark footer PNG, with
          transparent backgrounds and high-resolution source files.
        </p>
      </div>

      <div className="logo-lab__workspace">
        <div
          className="logo-lab__options"
          role="radiogroup"
          aria-label="Logo directions"
        >
          {logoOptions.map((option) => {
            const isSelected = logoDraft.option === option.id;

            return (
              <button
                className={`logo-option ${isSelected ? "is-selected" : ""}`}
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateLogoDraft({ option: option.id })}
              >
                <span className="logo-option__topline">
                  <span>{option.name}</span>
                  <span>{isSelected ? "Selected" : "Preview"}</span>
                </span>
                <span className="logo-option__copy">{option.description}</span>
                <span className="logo-option__preview logo-option__preview--dark">
                  <img
                    className="logo-option__img"
                    src={option.headerSrc}
                    alt=""
                    decoding="async"
                  />
                </span>
                <span className="logo-option__preview logo-option__preview--light">
                  <img
                    className="logo-option__img"
                    src={option.footerSrc}
                    alt=""
                    decoding="async"
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className="logo-editor" aria-label="Logo editor">
          <div className="logo-editor__topline">
            <div>
              <span>Selected PNG</span>
              <strong>{selectedOption.name}</strong>
            </div>
            <span>{logoDraft.scale}%</span>
          </div>
          <div className="logo-editor__live">
            <div
              className="logo-editor__preview logo-editor__preview--dark"
              aria-label="Header logo preview"
            >
              <BrandLogo
                tone="header"
                logoDraft={logoDraft}
                className="logo-editor__brand"
              />
            </div>
            <div
              className="logo-editor__preview logo-editor__preview--light"
              aria-label="Footer logo preview"
            >
              <BrandLogo
                tone="footer"
                logoDraft={logoDraft}
                className="logo-editor__brand"
              />
            </div>
          </div>

          <div className="logo-editor__controls">
            <label className="logo-field logo-field--range">
              <span>Size {logoDraft.scale}%</span>
              <input
                type="range"
                min="86"
                max="118"
                step="1"
                value={logoDraft.scale}
                onChange={(event) =>
                  updateLogoDraft({ scale: Number(event.target.value) })
                }
              />
            </label>

            <button
              className="logo-editor__reset"
              type="button"
              onClick={() => setLogoDraft(defaultLogoDraft)}
            >
              Reset logo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileMenu({
  onClose,
  returnFocusRef,
}: {
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();
  }, []);

  function closeAndReturnFocus() {
    onClose();
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAndReturnFocus();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <motion.div
      ref={dialogRef}
      className="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        initial={{ y: -16 }}
        animate={{ y: 0 }}
        exit={{ y: -16 }}
      >
        <button
          className="mobile-menu__close"
          type="button"
          onClick={closeAndReturnFocus}
        >
          <X size={18} aria-hidden="true" />
          Close menu
        </button>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={onClose}>
            {item.label}
          </a>
        ))}
        <a href="mailto:x.verdina@theraresearch.com" onClick={onClose}>
          Contact by email
        </a>
      </motion.nav>
    </motion.div>
  );
}

function Footer({ logoDraft }: { logoDraft: LogoDraft }) {
  return (
    <footer className="footer">
      <div>
        <a
          className="brand brand--footer"
          href="#home"
          aria-label="Thera Research home"
        >
          <BrandLogo tone="footer" logoDraft={logoDraft} />
        </a>
        <p>
          Clinical Research Organization based in Chile, supporting planning,
          execution, reporting, monitoring, regulatory coordination, and patient
          recruitment.
        </p>
      </div>
      <div className="footer__contact">
        <span>Clinical research organization</span>
        <a href="mailto:x.verdina@theraresearch.com">
          <Mail size={18} aria-hidden="true" />
          x.verdina@theraresearch.com
        </a>
      </div>
    </footer>
  );
}

function BrandLogo({
  tone,
  logoDraft,
  className = "",
}: {
  tone: "header" | "footer";
  logoDraft: LogoDraft;
  className?: string;
}) {
  const selectedOption = getLogoOption(logoDraft.option);
  const src =
    tone === "header" ? selectedOption.headerSrc : selectedOption.footerSrc;
  const logoScale = {
    "--logo-scale": String(logoDraft.scale / 100),
  } as CSSProperties;

  return (
    <span
      className={`brand__logo-frame ${className}`.trim()}
      style={logoScale}
      aria-hidden="true"
    >
      <img
        className="brand__logo-img"
        src={src}
        alt=""
        decoding="async"
        draggable={false}
      />
    </span>
  );
}

export default App;
