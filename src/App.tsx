import type {
  ChangeEvent,
  CSSProperties,
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  RefObject,
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
  MapPin,
  Menu,
  Phone,
  Send,
  X,
} from "lucide-react";
import {
  clinicalIntelligenceImages,
  languageOptions,
  siteContent,
  type Language,
  type SiteContent,
} from "./content";

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const heroFadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const revealUp = {
  hidden: { opacity: 1, y: 16 },
  show: { opacity: 1, y: 0 },
};

const pureWordmarkLogo = {
  headerSrc: assetPath("assets/logos/pure-wordmark-header.png"),
  footerSrc: assetPath("assets/logos/pure-wordmark-footer.png"),
};

const logoScale = 1.02;
const linkedInUrl =
  "https://www.linkedin.com/company/theraresearch-ltda?trk=extra_biz_viewers_viewed";
const patientFormAction =
  "https://docs.google.com/forms/d/e/1FAIpQLSeQtFC6Eptj0kx4aBSH5RakAoFBMOZG3EXMR3EJzH5v7l3Cvw/formResponse";
const languageStorageKey = "thera-language";

type PatientFormField =
  | "firstName"
  | "lastName"
  | "phone"
  | "city"
  | "diagnosed"
  | "diagnosis"
  | "consent";

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "es";
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey);
  if (isLanguage(storedLanguage)) {
    return storedLanguage;
  }

  return window.navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openService, setOpenService] = useState(0);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const content = siteContent[language];
  const activeImages = clinicalIntelligenceImages;
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.34], [1, 1.07]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0.62]);
  const heroImageStyle = shouldReduceMotion
    ? { scale: 1, opacity: 1 }
    : { scale: heroScale, opacity: heroOpacity };
  const patientsImageStyle = {
    "--patients-bg": `url("${activeImages.patients}")`,
  } as CSSProperties;

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell theme-intelligence">
        <a className="skip-link" href="#main-content">
          {content.meta.skipLink}
        </a>
        <Header
          menuOpen={menuOpen}
          menuButtonRef={menuButtonRef}
          setMenuOpen={setMenuOpen}
          language={language}
          setLanguage={setLanguage}
          content={content}
        />
        <main id="main-content" tabIndex={-1}>
          <section className="hero" id="home" aria-label={content.hero.aria}>
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
                show: {
                  transition: { staggerChildren: 0.11, delayChildren: 0.08 },
                },
              }}
            >
              <div className="hero__copy">
                <motion.h1 variants={heroFadeUp}>Thera Research</motion.h1>
                <motion.p className="hero__lead" variants={heroFadeUp}>
                  {content.hero.lead}
                </motion.p>
                <motion.div className="hero__actions" variants={heroFadeUp}>
                  <MagneticButton href="#contact" variant="button--primary">
                    {content.hero.primaryCta}{" "}
                    <ArrowRight size={18} aria-hidden="true" />
                  </MagneticButton>
                  <MagneticButton
                    href="#patient-registration"
                    variant="button--ghost"
                  >
                    {content.hero.secondaryCta}
                  </MagneticButton>
                </motion.div>
              </div>
              <StudyOpsPanel content={content} />
            </motion.div>
          </section>

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
                {content.intro.eyebrow}
              </motion.p>
              <motion.h2 variants={revealUp}>{content.intro.heading}</motion.h2>
              <motion.p variants={revealUp}>{content.intro.copy}</motion.p>
            </motion.div>
            <motion.div
              className="intro__visual"
              initial={{ opacity: 1, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.35 }}
            >
              <img src={activeImages.lab} alt={content.intro.imageAlt} />
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
                <p className="eyebrow eyebrow--dark">
                  {content.services.eyebrow}
                </p>
                <h2>{content.services.heading}</h2>
              </div>
              <p>{content.services.copy}</p>
            </div>
            <div className="capability-list">
              {content.capabilities.map((item, index) => {
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
                    <dl
                      className="capability-row__meta"
                      id={`${serviceId}-meta`}
                    >
                      <div>
                        <dt>{content.services.deliverableLabel}</dt>
                        <dd>{item.deliverable}</dd>
                      </div>
                      <div>
                        <dt>{content.services.riskLabel}</dt>
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

          <WorkflowSection content={content.workflow} />

          <section className="monitoring section" id="monitoring">
            <div className="monitoring__copy">
              <p className="eyebrow eyebrow--dark">
                {content.monitoring.eyebrow}
              </p>
              <h2>{content.monitoring.heading}</h2>
              <p>{content.monitoring.copy}</p>
              <ul className="check-list">
                {content.monitoring.signals.map((item) => (
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
                alt={content.monitoring.imageAlt}
              />
              <div className="panel-overlay">
                <span>{content.monitoring.overlayLabel}</span>
                <strong>{content.monitoring.overlayTitle}</strong>
                <small>{content.monitoring.overlayCopy}</small>
              </div>
            </motion.div>
          </section>

          <section className="proof section" id="positioning">
            <div className="section-heading section-heading--wide">
              <p className="eyebrow eyebrow--dark">{content.proof.eyebrow}</p>
              <h2>{content.proof.heading}</h2>
              <p className="section-heading__support">
                {content.proof.support}
              </p>
            </div>
            <div className="proof-grid">
              {content.proof.points.map((item, index) => {
                const Icon = item.icon;
                const itemNumber = String(index + 1).padStart(2, "0");

                return (
                  <motion.article
                    key={item.title}
                    className={
                      index === 0 ? "proof-item proof-item--lead" : "proof-item"
                    }
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
                        {index === 0
                          ? content.proof.primaryLabel
                          : content.proof.supportingLabel}
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>

          <section
            className="patients"
            id="patients"
            style={patientsImageStyle}
          >
            <div className="patients__content">
              <p className="eyebrow">{content.patients.eyebrow}</p>
              <h2>{content.patients.heading}</h2>
              <p>{content.patients.copy}</p>
            </div>
            <MagneticButton
              href="#patient-registration"
              variant="button--light"
            >
              {content.patients.cta} <ArrowRight size={18} aria-hidden="true" />
            </MagneticButton>
          </section>

          <PatientRecruitmentSection content={content.patientRegistration} />

          <ContactSection content={content} />
        </main>

        <Footer content={content} />
        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
              onClose={() => setMenuOpen(false)}
              returnFocusRef={menuButtonRef}
              language={language}
              setLanguage={setLanguage}
              content={content}
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

function StudyOpsPanel({ content }: { content: SiteContent }) {
  return (
    <motion.div
      className="hero-panel"
      variants={heroFadeUp}
      aria-label={content.studyPanel.aria}
    >
      <div className="hero-panel__top">
        <span className="live-dot" aria-hidden="true" />
        <p>{content.studyPanel.title}</p>
      </div>
      <div className="hero-panel__body">
        {content.operatingSignals.map((item) => (
          <div className="signal-row" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <div className="hero-panel__footer">
        <span>{content.studyPanel.footerLabel}</span>
        <strong>{content.studyPanel.footerValue}</strong>
      </div>
    </motion.div>
  );
}

function WorkflowSection({ content }: { content: SiteContent["workflow"] }) {
  return (
    <section className="workflow" id="workflow">
      <div className="workflow__inner">
        <div className="workflow__heading">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.heading}</h2>
          <p className="workflow__lead">{content.lead}</p>
        </div>
        <div className="workflow__steps" aria-label={content.aria}>
          {content.steps.map((item, index) => (
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

function PatientRecruitmentSection({
  content,
}: {
  content: SiteContent["patientRegistration"];
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    diagnosed: "",
    diagnosis: "",
    consent: false,
  });
  const [status, setStatus] = useState<FormStatus>("empty");
  const timerRef = useRef<number | null>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const diagnosedRef = useRef<HTMLInputElement>(null);
  const diagnosisRef = useRef<HTMLTextAreaElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const phone = form.phone.trim();
  const city = form.city.trim();
  const diagnosis = form.diagnosis.trim();
  const hasDiagnosedAnswer = Boolean(form.diagnosed);
  const showFirstNameError = status === "error" && !firstName;
  const showLastNameError = status === "error" && !lastName;
  const showPhoneError = status === "error" && !phone;
  const showCityError = status === "error" && !city;
  const showDiagnosedError = status === "error" && !hasDiagnosedAnswer;
  const showDiagnosisError = status === "error" && !diagnosis;
  const showConsentError = status === "error" && !form.consent;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handlePatientChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const field = event.currentTarget.dataset.field as PatientFormField;
    const value =
      event.currentTarget instanceof HTMLInputElement &&
      event.currentTarget.type === "checkbox"
        ? event.currentTarget.checked
        : event.currentTarget.value;

    setForm((current) => ({ ...current, [field]: value }));
    if (status === "error" || status === "success") {
      setStatus("empty");
    }
  }

  function handlePatientSubmit(event: FormEvent<HTMLFormElement>) {
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !city ||
      !hasDiagnosedAnswer ||
      !diagnosis ||
      !form.consent
    ) {
      event.preventDefault();
      setStatus("error");

      if (!firstName) {
        firstNameRef.current?.focus();
      } else if (!lastName) {
        lastNameRef.current?.focus();
      } else if (!phone) {
        phoneRef.current?.focus();
      } else if (!city) {
        cityRef.current?.focus();
      } else if (!hasDiagnosedAnswer) {
        diagnosedRef.current?.focus();
      } else if (!diagnosis) {
        diagnosisRef.current?.focus();
      } else {
        consentRef.current?.focus();
      }
      return;
    }

    setStatus("loading");
    timerRef.current = window.setTimeout(() => {
      setStatus("success");
    }, 900);
  }

  return (
    <section
      className="patient-registration section"
      id="patient-registration"
      aria-label={content.aria}
    >
      <div className="patient-registration__intro">
        <p className="eyebrow eyebrow--dark">{content.eyebrow}</p>
        <h2>{content.heading}</h2>
        <p>{content.copy}</p>
        <ul
          className="patient-registration__steps"
          aria-label={content.stepsAria}
        >
          {content.steps.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title}>
                <span aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.copy}</small>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <form
        className="patient-form"
        action={patientFormAction}
        method="post"
        target="patient-registration-target"
        onSubmit={handlePatientSubmit}
        aria-label={content.formAria}
        noValidate
      >
        <div className="patient-form__grid">
          <label>
            <span>{content.fields.firstName.label}</span>
            <input
              ref={firstNameRef}
              name="entry.2092238618"
              data-field="firstName"
              value={form.firstName}
              onChange={handlePatientChange}
              autoComplete="given-name"
              required
              aria-required="true"
              aria-invalid={showFirstNameError}
              aria-describedby={
                showFirstNameError ? "patient-first-name-error" : undefined
              }
            />
            {showFirstNameError && (
              <small className="field-error" id="patient-first-name-error">
                {content.fields.firstName.error}
              </small>
            )}
          </label>

          <label>
            <span>{content.fields.lastName.label}</span>
            <input
              ref={lastNameRef}
              name="entry.1669915100"
              data-field="lastName"
              value={form.lastName}
              onChange={handlePatientChange}
              autoComplete="family-name"
              required
              aria-required="true"
              aria-invalid={showLastNameError}
              aria-describedby={
                showLastNameError ? "patient-last-name-error" : undefined
              }
            />
            {showLastNameError && (
              <small className="field-error" id="patient-last-name-error">
                {content.fields.lastName.error}
              </small>
            )}
          </label>

          <label>
            <span>{content.fields.phone.label}</span>
            <span className="patient-form__input-wrap">
              <Phone size={17} aria-hidden="true" />
              <input
                ref={phoneRef}
                name="entry.479301265"
                data-field="phone"
                type="tel"
                value={form.phone}
                onChange={handlePatientChange}
                autoComplete="tel"
                inputMode="tel"
                required
                aria-required="true"
                aria-invalid={showPhoneError}
                aria-describedby={
                  showPhoneError ? "patient-phone-error" : undefined
                }
              />
            </span>
            {showPhoneError && (
              <small className="field-error" id="patient-phone-error">
                {content.fields.phone.error}
              </small>
            )}
          </label>

          <label>
            <span>{content.fields.city.label}</span>
            <span className="patient-form__input-wrap">
              <MapPin size={17} aria-hidden="true" />
              <input
                ref={cityRef}
                name="entry.1240379606"
                data-field="city"
                value={form.city}
                onChange={handlePatientChange}
                autoComplete="address-level2"
                required
                aria-required="true"
                aria-invalid={showCityError}
                aria-describedby={
                  showCityError ? "patient-city-error" : undefined
                }
              />
            </span>
            {showCityError && (
              <small className="field-error" id="patient-city-error">
                {content.fields.city.error}
              </small>
            )}
          </label>
        </div>

        <fieldset
          aria-invalid={showDiagnosedError}
          aria-describedby={
            showDiagnosedError ? "patient-diagnosed-error" : undefined
          }
        >
          <legend>{content.fields.diagnosed.label}</legend>
          <div className="patient-form__choice-row">
            <label className="patient-form__choice">
              <input
                ref={diagnosedRef}
                name="entry.1753222212"
                data-field="diagnosed"
                type="radio"
                value="Si"
                checked={form.diagnosed === "Si"}
                onChange={handlePatientChange}
                required
              />
              <span>{content.fields.diagnosed.yes}</span>
            </label>
            <label className="patient-form__choice">
              <input
                name="entry.1753222212"
                data-field="diagnosed"
                type="radio"
                value="No"
                checked={form.diagnosed === "No"}
                onChange={handlePatientChange}
                required
              />
              <span>{content.fields.diagnosed.no}</span>
            </label>
          </div>
          {showDiagnosedError && (
            <small className="field-error" id="patient-diagnosed-error">
              {content.fields.diagnosed.error}
            </small>
          )}
        </fieldset>

        <label>
          <span>{content.fields.diagnosis.label}</span>
          <textarea
            ref={diagnosisRef}
            name="entry.690214210"
            data-field="diagnosis"
            value={form.diagnosis}
            onChange={handlePatientChange}
            rows={3}
            required
            aria-required="true"
            aria-invalid={showDiagnosisError}
            aria-describedby={
              showDiagnosisError ? "patient-diagnosis-error" : undefined
            }
          />
          {showDiagnosisError && (
            <small className="field-error" id="patient-diagnosis-error">
              {content.fields.diagnosis.error}
            </small>
          )}
        </label>

        <label className="patient-form__consent">
          <input
            ref={consentRef}
            name="entry.1642328336"
            data-field="consent"
            type="checkbox"
            value="Si"
            checked={form.consent}
            onChange={handlePatientChange}
            required
            aria-required="true"
            aria-invalid={showConsentError}
            aria-describedby={
              showConsentError ? "patient-consent-error" : undefined
            }
          />
          <span>{content.fields.consent.label}</span>
        </label>
        <input type="hidden" name="entry.1642328336_sentinel" value="" />
        {showConsentError && (
          <small className="field-error" id="patient-consent-error">
            {content.fields.consent.error}
          </small>
        )}

        <div className="form-status" aria-live="polite" aria-atomic="true">
          {status === "loading" ? (
            <div
              className="form-skeleton"
              aria-label={content.status.loadingLabel}
            >
              <span />
              <span />
              <span />
            </div>
          ) : (
            <p
              className={`form-status__message form-status__message--${status}`}
              role={status === "error" ? "alert" : "status"}
            >
              {status === "empty" && content.status.empty}
              {status === "error" && (
                <>
                  <AlertCircle size={16} aria-hidden="true" />
                  {content.status.error}
                </>
              )}
              {status === "success" && (
                <>
                  <Check size={16} aria-hidden="true" />
                  {content.status.success}
                </>
              )}
            </p>
          )}
        </div>

        <button className="button button--submit" type="submit">
          {content.submit} <Send size={17} aria-hidden="true" />
        </button>
        <iframe
          className="patient-form__target"
          title={content.iframeTitle}
          name="patient-registration-target"
        />
      </form>
    </section>
  );
}

function ContactSection({ content }: { content: SiteContent }) {
  return (
    <section className="contact-section section" id="contact">
      <div className="contact-section__copy">
        <p className="eyebrow eyebrow--dark">{content.contact.eyebrow}</p>
        <h2>{content.contact.heading}</h2>
        <p>{content.contact.copy}</p>
        <div className="contact-links">
          <a className="contact-link" href="mailto:x.verdina@theraresearch.com">
            <Mail size={18} aria-hidden="true" />
            x.verdina@theraresearch.com
          </a>
          <a
            className="contact-link"
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
          >
            <LinkedInIcon size={18} />
            {content.meta.linkedIn}
          </a>
        </div>
      </div>
      <ContactForm content={content.contactForm} />
    </section>
  );
}

type FormStatus = "empty" | "error" | "loading" | "success";

function ContactForm({ content }: { content: SiteContent["contactForm"] }) {
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
      aria-label={content.aria}
      noValidate
    >
      <div className="form-grid">
        <label>
          <span>{content.fields.name.label}</span>
          <input
            ref={nameRef}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={content.fields.name.placeholder}
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={showNameError}
            aria-describedby={`contact-name-hint${
              showNameError ? " contact-name-error" : ""
            }`}
          />
          <small id="contact-name-hint">{content.fields.name.hint}</small>
          {showNameError && (
            <small className="field-error" id="contact-name-error">
              {content.fields.name.error}
            </small>
          )}
        </label>
        <label>
          <span>{content.fields.email.label}</span>
          <input
            ref={emailRef}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder={content.fields.email.placeholder}
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={showEmailError}
            aria-describedby={`contact-email-hint${
              showEmailError ? " contact-email-error" : ""
            }`}
          />
          <small id="contact-email-hint">{content.fields.email.hint}</small>
          {showEmailError && (
            <small className="field-error" id="contact-email-error">
              {content.fields.email.error}
            </small>
          )}
        </label>
      </div>
      <label>
        <span>{content.fields.message.label}</span>
        <textarea
          ref={messageRef}
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder={content.fields.message.placeholder}
          rows={5}
          required
          aria-required="true"
          aria-invalid={showMessageError}
          aria-describedby={`contact-message-hint${
            showMessageError ? " contact-message-error" : ""
          }`}
        />
        <small id="contact-message-hint">{content.fields.message.hint}</small>
        {showMessageError && (
          <small className="field-error" id="contact-message-error">
            {content.fields.message.error}
          </small>
        )}
      </label>

      <div className="form-status" aria-live="polite" aria-atomic="true">
        {status === "loading" ? (
          <div
            className="form-skeleton"
            aria-label={content.status.loadingLabel}
          >
            <span />
            <span />
            <span />
          </div>
        ) : (
          <p
            className={`form-status__message form-status__message--${status}`}
            role={status === "error" ? "alert" : "status"}
          >
            {status === "empty" && content.status.empty}
            {status === "error" && (
              <>
                <AlertCircle size={16} aria-hidden="true" />
                {content.status.error}
              </>
            )}
            {status === "success" && (
              <>
                <Check size={16} aria-hidden="true" />
                {content.status.success}
              </>
            )}
          </p>
        )}
      </div>

      <button className="button button--submit" type="submit">
        {content.submit} <Send size={17} aria-hidden="true" />
      </button>
    </form>
  );
}

function Header({
  menuOpen,
  menuButtonRef,
  setMenuOpen,
  language,
  setLanguage,
  content,
}: {
  menuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  setMenuOpen: (value: boolean) => void;
  language: Language;
  setLanguage: (value: Language) => void;
  content: SiteContent;
}) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label={content.meta.homeAria}>
        <BrandLogo tone="header" />
      </a>
      <nav className="desktop-nav" aria-label={content.meta.navAria}>
        {content.navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <LanguageToggle
        language={language}
        setLanguage={setLanguage}
        ariaLabel={content.meta.languageAria}
      />
      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-label={menuOpen ? content.meta.closeMenu : content.meta.openMenu}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

function LanguageToggle({
  language,
  setLanguage,
  ariaLabel,
}: {
  language: Language;
  setLanguage: (value: Language) => void;
  ariaLabel: string;
}) {
  return (
    <div className="language-toggle" aria-label={ariaLabel} role="group">
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          className={language === option.code ? "is-active" : ""}
          aria-pressed={language === option.code}
          aria-label={option.name}
          onClick={() => setLanguage(option.code)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MobileMenu({
  onClose,
  returnFocusRef,
  language,
  setLanguage,
  content,
}: {
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  language: Language;
  setLanguage: (value: Language) => void;
  content: SiteContent;
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
      aria-label={content.meta.mobileNavAria}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.nav
        id="mobile-navigation"
        aria-label={content.meta.mobileNavAria}
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
          {content.meta.closeMenu}
        </button>
        <LanguageToggle
          language={language}
          setLanguage={setLanguage}
          ariaLabel={content.meta.languageAria}
        />
        {content.navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={onClose}>
            {item.label}
          </a>
        ))}
        <a href="mailto:x.verdina@theraresearch.com" onClick={onClose}>
          {content.meta.emailMenu}
        </a>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
        >
          <LinkedInIcon size={18} />
          {content.meta.linkedIn}
        </a>
      </motion.nav>
    </motion.div>
  );
}

function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="footer">
      <div>
        <a
          className="brand brand--footer"
          href="#home"
          aria-label={content.meta.homeAria}
        >
          <BrandLogo tone="footer" />
        </a>
        <p>{content.footer.copy}</p>
      </div>
      <div className="footer__contact">
        <span>{content.footer.label}</span>
        <div className="footer__contact-links">
          <a href="mailto:x.verdina@theraresearch.com">
            <Mail size={18} aria-hidden="true" />
            x.verdina@theraresearch.com
          </a>
          <a href={linkedInUrl} target="_blank" rel="noreferrer">
            <LinkedInIcon size={18} />
            {content.meta.linkedIn}
          </a>
        </div>
      </div>
    </footer>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="linkedin-icon"
    >
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.32 8.02h4.36V23H.32V8.02Zm7.18 0h4.17v2.05h.06c.58-1.1 2-2.26 4.12-2.26 4.41 0 5.23 2.9 5.23 6.68V23h-4.35v-7.55c0-1.8-.03-4.12-2.51-4.12-2.52 0-2.9 1.97-2.9 3.99V23H7.5V8.02Z"
        transform="translate(1.4)"
      />
    </svg>
  );
}

function BrandLogo({
  tone,
  className = "",
}: {
  tone: "header" | "footer";
  className?: string;
}) {
  const src =
    tone === "header" ? pureWordmarkLogo.headerSrc : pureWordmarkLogo.footerSrc;
  const logoScaleStyle = {
    "--logo-scale": String(logoScale),
  } as CSSProperties;

  return (
    <span
      className={`brand__logo-frame ${className}`.trim()}
      style={logoScaleStyle}
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
