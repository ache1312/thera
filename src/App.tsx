import type {
  ChangeEvent,
  ComponentProps,
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
  type Variants,
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
  ExternalLink,
  ImageIcon,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  PlayCircle,
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
import seoConfigData from "./seo-config.json";

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const premiumEase: [number, number, number, number] = [0.19, 1, 0.22, 1];

const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.74, ease: premiumEase },
  },
};

const revealUp: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease: premiumEase },
  },
};

const revealMask: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(5px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: premiumEase },
  },
};

const revealImage: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.985,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: premiumEase },
  },
};

const revealStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.075, delayChildren: 0.04 },
  },
};

const rowReveal: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(3px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.54, ease: premiumEase },
  },
};

const workflowStepReveal: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.992 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.54, ease: premiumEase },
  },
};

const pureWordmarkLogo = {
  headerSrc: assetPath("assets/logos/pure-wordmark-header.png"),
  footerSrc: assetPath("assets/logos/pure-wordmark-footer.png"),
};

const logoScale = 1.02;
const linkedInCompanyId = "15153372";
const linkedInScriptId = "linkedin-platform-script";
const linkedInUrl =
  "https://www.linkedin.com/company/theraresearch-ltda?trk=extra_biz_viewers_viewed";
// PLACEHOLDER — set the real WhatsApp Business number in E.164 digits only (e.g. "56912345678").
// While empty, the WhatsApp affordance stays hidden instead of rendering a dead link.
const WHATSAPP_NUMBER = "";
const whatsappUrl = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null;
// PLACEHOLDER — primary contact inbox used by the header CTA / direct contact links.
const contactEmail = "x.verdina@theraresearch.com";
const linkedInVideoPattern =
  /video|conversation|conversaci[oó]n|chapter|cap[ií]tulo/i;
const patientFormAction =
  "https://docs.google.com/forms/d/e/1FAIpQLSeQtFC6Eptj0kx4aBSH5RakAoFBMOZG3EXMR3EJzH5v7l3Cvw/formResponse";
const languageStorageKey = "thera-language";
const pageKeys = ["home", "services", "patients", "insights", "contact"] as const;
type PageKey = (typeof pageKeys)[number];

type SeoPage = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

type SeoConfig = {
  siteUrl: string;
  siteName: string;
  defaultLanguage: Language;
  lastmod: string;
  linkedInUrl: string;
  contactEmail: string;
  logo: string;
  socialImage: string;
  routes: Record<Language, Record<PageKey, string>>;
  legacyRoutes: Record<PageKey, string>;
  pages: Record<Language, Record<PageKey, SeoPage>>;
};

type RouteState = {
  language: Language;
  page: PageKey;
  isLegacy: boolean;
};

const seoConfig = seoConfigData as SeoConfig;
const seoLanguages = ["es", "en"] as const satisfies readonly Language[];
const defaultLanguage = seoConfig.defaultLanguage;
type MotionImageStyle = ComponentProps<typeof motion.img>["style"];
type PageNavigateHandler = (
  page: PageKey,
  event?: ReactMouseEvent<HTMLAnchorElement>,
) => void;
type LinkedInPost = SiteContent["linkedin"]["posts"][number];

type PatientFormField =
  | "firstName"
  | "lastName"
  | "phone"
  | "city"
  | "diagnosed"
  | "diagnosis"
  | "consent";

function getLinkedInPostMediaSrc(index: number) {
  return assetPath(
    `assets/linkedin/post-${String(index + 1).padStart(2, "0")}.webp`,
  );
}

function isLinkedInVideoPost(item: LinkedInPost) {
  return (
    item.tags.some((tag) => tag.toLowerCase() === "video") ||
    linkedInVideoPattern.test(`${item.title} ${item.copy}`)
  );
}

function linkedInMetricLabel(
  value: string,
  singular: string,
  plural: string,
) {
  return Number(value) === 1 ? singular : plural;
}

declare global {
  interface Window {
    IN?: {
      parse?: (element?: HTMLElement | null) => void;
    };
  }
}

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "es";
}

function getBasePath() {
  const base = import.meta.env.BASE_URL;
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function normalizeRoutePath(pathname: string) {
  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed || "/";
}

function stripBasePath(pathname: string) {
  const base = getBasePath();

  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || "/";
  }

  return pathname;
}

function routeMatches(pathname: string, route: string) {
  return normalizeRoutePath(pathname) === normalizeRoutePath(route);
}

function getRouteStateFromPathname(pathname: string): RouteState {
  const path = normalizeRoutePath(stripBasePath(pathname));

  for (const language of seoLanguages) {
    for (const page of pageKeys) {
      if (routeMatches(path, seoConfig.routes[language][page])) {
        return { language, page, isLegacy: false };
      }
    }
  }

  for (const page of pageKeys) {
    if (routeMatches(path, seoConfig.legacyRoutes[page])) {
      return {
        language: page === "home" ? defaultLanguage : "en",
        page,
        isLegacy: true,
      };
    }
  }

  return { language: defaultLanguage, page: "home", isLegacy: true };
}

function getRouteStateFromLocation(): RouteState {
  if (typeof window === "undefined") {
    return { language: defaultLanguage, page: "home", isLegacy: false };
  }

  return getRouteStateFromPathname(window.location.pathname);
}

function getPagePath(page: PageKey, language: Language = defaultLanguage) {
  const base = getBasePath();
  return `${base}${seoConfig.routes[language][page]}` || "/";
}

function getAbsoluteUrl(path: string) {
  return `${seoConfig.siteUrl}${path}`;
}

function getAbsoluteAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${seoConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getCanonicalPath(language: Language, page: PageKey) {
  return seoConfig.routes[language][page];
}

function getXDefaultPath(page: PageKey) {
  return page === "home"
    ? seoConfig.legacyRoutes.home
    : seoConfig.routes[defaultLanguage][page];
}

function getLocale(language: Language) {
  return language === "es" ? "es_CL" : "en_US";
}

function buildStructuredData(language: Language, page: PageKey) {
  const canonicalPath = getCanonicalPath(language, page);
  const pageSeo = seoConfig.pages[language][page];
  const canonicalUrl = getAbsoluteUrl(canonicalPath);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${seoConfig.siteUrl}/#organization`,
        name: seoConfig.siteName,
        legalName: "Thera Research Ltda.",
        url: seoConfig.siteUrl,
        logo: getAbsoluteAssetUrl(seoConfig.logo),
        description:
          "Clinical Research Organization supporting clinical trial operations, monitoring, site activation, regulatory coordination, and patient recruitment in Chile.",
        email: seoConfig.contactEmail,
        areaServed: {
          "@type": "Country",
          name: "Chile",
        },
        knowsAbout: [
          "Clinical trial management",
          "Clinical monitoring",
          "Patient recruitment",
          "Site activation",
          "Regulatory coordination",
          "Clinical research operations",
        ],
        sameAs: [seoConfig.linkedInUrl],
      },
      {
        "@type": "WebSite",
        "@id": `${seoConfig.siteUrl}/#website`,
        url: seoConfig.siteUrl,
        name: seoConfig.siteName,
        inLanguage: language,
        publisher: {
          "@id": `${seoConfig.siteUrl}/#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: pageSeo.title,
        description: pageSeo.description,
        inLanguage: language,
        isPartOf: {
          "@id": `${seoConfig.siteUrl}/#website`,
        },
        about: {
          "@id": `${seoConfig.siteUrl}/#organization`,
        },
      },
    ],
  };
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element?.setAttribute(name, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element?.setAttribute(name, value);
  });
}

function syncDocumentSeo(language: Language, page: PageKey) {
  const pageSeo = seoConfig.pages[language][page];
  const canonicalPath = getCanonicalPath(language, page);
  const canonicalUrl = getAbsoluteUrl(canonicalPath);
  const socialImageUrl = getAbsoluteAssetUrl(seoConfig.socialImage);
  const alternateLanguage = language === "es" ? "en" : "es";

  document.title = pageSeo.title;
  document.documentElement.lang = language;

  upsertMeta('meta[name="description"]', {
    name: "description",
    content: pageSeo.description,
  });
  upsertMeta('meta[name="robots"]', {
    name: "robots",
    content: "index, follow",
  });
  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: seoConfig.siteName,
  });
  upsertMeta('meta[property="og:type"]', {
    property: "og:type",
    content: "website",
  });
  upsertMeta('meta[property="og:locale"]', {
    property: "og:locale",
    content: getLocale(language),
  });
  upsertMeta('meta[property="og:url"]', {
    property: "og:url",
    content: canonicalUrl,
  });
  upsertMeta('meta[property="og:title"]', {
    property: "og:title",
    content: pageSeo.ogTitle,
  });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: pageSeo.ogDescription,
  });
  upsertMeta('meta[property="og:image"]', {
    property: "og:image",
    content: socialImageUrl,
  });
  upsertMeta('meta[property="og:image:alt"]', {
    property: "og:image:alt",
    content: `${seoConfig.siteName} clinical research operations`,
  });
  upsertMeta('meta[name="twitter:card"]', {
    name: "twitter:card",
    content: "summary_large_image",
  });
  upsertMeta('meta[name="twitter:title"]', {
    name: "twitter:title",
    content: pageSeo.ogTitle,
  });
  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: pageSeo.ogDescription,
  });
  upsertMeta('meta[name="twitter:image"]', {
    name: "twitter:image",
    content: socialImageUrl,
  });

  upsertLink('link[rel="canonical"]', {
    rel: "canonical",
    href: canonicalUrl,
  });

  document
    .querySelectorAll('link[data-seo-alternate="true"]')
    .forEach((node) => node.remove());

  for (const alternate of seoLanguages) {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = alternate;
    link.href = getAbsoluteUrl(seoConfig.routes[alternate][page]);
    link.dataset.seoAlternate = "true";
    document.head.appendChild(link);
  }

  const xDefault = document.createElement("link");
  xDefault.rel = "alternate";
  xDefault.hreflang = "x-default";
  xDefault.href = getAbsoluteUrl(getXDefaultPath(page));
  xDefault.dataset.seoAlternate = "true";
  document.head.appendChild(xDefault);

  upsertMeta('meta[property="og:locale:alternate"]', {
    property: "og:locale:alternate",
    content: getLocale(alternateLanguage),
  });

  let structuredData = document.querySelector<HTMLScriptElement>(
    "#thera-structured-data",
  );

  if (!structuredData) {
    structuredData = document.createElement("script");
    structuredData.id = "thera-structured-data";
    structuredData.type = "application/ld+json";
    document.head.appendChild(structuredData);
  }

  structuredData.text = JSON.stringify(buildStructuredData(language, page));
}

function App() {
  const initialRouteState = getRouteStateFromLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openService, setOpenService] = useState(0);
  const [language, setLanguageState] = useState<Language>(
    initialRouteState.language,
  );
  const [page, setPage] = useState<PageKey>(initialRouteState.page);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const content = siteContent[language];
  const activeImages = clinicalIntelligenceImages;
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.34], [1, 1.035]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0.78]);
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
    syncDocumentSeo(language, page);
    window.localStorage.setItem(languageStorageKey, language);
  }, [language, page]);

  useEffect(() => {
    function handlePopState() {
      const nextRoute = getRouteStateFromLocation();
      setLanguageState(nextRoute.language);
      setPage(nextRoute.page);
      window.requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    }

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    let frame = 0;
    let currentScrolled = window.scrollY > 24;

    setIsHeaderScrolled(currentScrolled);

    function handleScroll() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 24;
        if (nextScrolled !== currentScrolled) {
          currentScrolled = nextScrolled;
          setIsHeaderScrolled(nextScrolled);
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function navigateToPage(
    nextPage: PageKey,
    event?: ReactMouseEvent<HTMLAnchorElement>,
  ) {
    event?.preventDefault();
    const targetPath = getPagePath(nextPage, language);

    if (nextPage === page) {
      if (
        !routeMatches(
          stripBasePath(window.location.pathname),
          stripBasePath(targetPath),
        )
      ) {
        window.history.pushState({}, "", targetPath);
      }
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" });
      return;
    }

    window.history.pushState({}, "", targetPath);
    setPage(nextPage);
    setMenuOpen(false);
    window.requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: shouldReduceMotion ? "auto" : "smooth" }),
    );
  }

  function changeLanguage(nextLanguage: Language) {
    if (nextLanguage === language) {
      return;
    }

    window.history.pushState({}, "", getPagePath(page, nextLanguage));
    setLanguageState(nextLanguage);
    setMenuOpen(false);
  }

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
          setLanguage={changeLanguage}
          content={content}
          isScrolled={isHeaderScrolled}
          activePage={page}
          onNavigate={navigateToPage}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            id="main-content"
            className={`page-main page-main--${page}`}
            tabIndex={-1}
            key={page}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 10, filter: "blur(4px)" }
            }
            animate={
              shouldReduceMotion
                ? undefined
                : { opacity: 1, y: 0, filter: "blur(0px)" }
            }
            exit={
              shouldReduceMotion
                ? undefined
                : { opacity: 0, y: -6, filter: "blur(3px)" }
            }
            transition={{ duration: 0.36, ease: premiumEase }}
          >
            {page === "home" && (
              <HomePage
                content={content}
                activeImages={activeImages}
                heroImageStyle={heroImageStyle}
                patientsImageStyle={patientsImageStyle}
                language={language}
                onNavigate={navigateToPage}
              />
            )}
            {page === "services" && (
              <ServicesPage
                content={content}
                activeImages={activeImages}
                language={language}
                onNavigate={navigateToPage}
                openService={openService}
                setOpenService={setOpenService}
              />
            )}
            {page === "patients" && (
              <PatientsPage
                content={content}
                activeImages={activeImages}
                patientsImageStyle={patientsImageStyle}
                language={language}
                onNavigate={navigateToPage}
              />
            )}
            {page === "insights" && (
              <InsightsPage
                content={content}
                language={language}
                activeImages={activeImages}
                onNavigate={navigateToPage}
              />
            )}
            {page === "contact" && (
              <ContactPage
                content={content}
                activeImages={activeImages}
                language={language}
                onNavigate={navigateToPage}
              />
            )}
          </motion.main>
        </AnimatePresence>
        <Footer content={content} language={language} onNavigate={navigateToPage} />
        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
              onClose={() => setMenuOpen(false)}
              returnFocusRef={menuButtonRef}
              language={language}
              setLanguage={changeLanguage}
              content={content}
              activePage={page}
              onNavigate={navigateToPage}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

function HomePage({
  content,
  activeImages,
  heroImageStyle,
  patientsImageStyle,
  language,
  onNavigate,
}: {
  content: SiteContent;
  activeImages: typeof clinicalIntelligenceImages;
  heroImageStyle: MotionImageStyle;
  patientsImageStyle: CSSProperties;
  language: Language;
  onNavigate: PageNavigateHandler;
}) {
  return (
    <>
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
                  transition: { staggerChildren: 0.09, delayChildren: 0.05 },
                },
              }}
            >
              <div className="hero__copy">
                <h1 className="hero-title text-reveal">Thera Research</h1>
                <motion.p className="hero__lead" variants={heroFadeUp}>
                  {content.hero.lead}
                </motion.p>
                <motion.div className="hero__actions" variants={heroFadeUp}>
                  <MagneticButton
                    href={getPagePath("contact", language)}
                    variant="button--primary"
                    onClick={(event) => onNavigate("contact", event)}
                  >
                    {content.hero.primaryCta}{" "}
                    <ArrowRight size={18} aria-hidden="true" />
                  </MagneticButton>
                  <MagneticButton
                    href={getPagePath("patients", language)}
                    variant="button--ghost"
                    onClick={(event) => onNavigate("patients", event)}
                  >
                    {content.hero.secondaryCta}
                  </MagneticButton>
                </motion.div>
              </div>
              <StudyOpsPanel content={content} />
            </motion.div>
          </section>

          <CredibilityStrip content={content.credibility} />

          <section className="intro section" id="company">
            <motion.div
              className="intro__content"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.09 } },
              }}
            >
              <motion.p className="eyebrow eyebrow--dark" variants={revealUp}>
                {content.intro.eyebrow}
              </motion.p>
              <motion.h2 className="text-reveal" variants={revealMask}>
                {content.intro.heading}
              </motion.h2>
              <motion.p variants={revealUp}>{content.intro.copy}</motion.p>
            </motion.div>
            <motion.div
              className="intro__visual"
              initial="hidden"
              whileInView="show"
              variants={revealImage}
              viewport={{ once: true, amount: 0.35 }}
            >
              <ParallaxImage
                src={activeImages.lab}
                alt={content.intro.imageAlt}
              />
              <div className="signal-strip" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
	              </div>
	            </motion.div>
	          </section>

          <RouteGatewaySection
            content={content}
            language={language}
            onNavigate={onNavigate}
          />

	          <section className="proof section" id="positioning">
            <motion.div
              className="section-heading section-heading--wide"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.32 }}
              variants={revealStagger}
            >
              <motion.p className="eyebrow eyebrow--dark" variants={revealUp}>
                {content.proof.eyebrow}
              </motion.p>
              <motion.h2 className="text-reveal" variants={revealMask}>
                {content.proof.heading}
              </motion.h2>
              <motion.p
                className="section-heading__support"
                variants={revealUp}
              >
                {content.proof.support}
              </motion.p>
            </motion.div>
            <motion.div
              className="proof-grid"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={revealStagger}
            >
              {content.proof.points.map((item, index) => {
                const Icon = item.icon;
                const itemNumber = String(index + 1).padStart(2, "0");

                return (
                  <motion.article
                    key={item.title}
                    className={
                      index === 0 ? "proof-item proof-item--lead" : "proof-item"
                    }
                    variants={rowReveal}
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
            </motion.div>
          </section>

          <motion.section
            className="patients"
            id="patients"
            style={patientsImageStyle}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={revealImage}
          >
            <div className="patients__content">
              <p className="eyebrow">{content.patients.eyebrow}</p>
              <h2>{content.patients.heading}</h2>
              <p>{content.patients.copy}</p>
            </div>
            <MagneticButton
              href={getPagePath("patients", language)}
              variant="button--light"
              onClick={(event) => onNavigate("patients", event)}
            >
              {content.patients.cta} <ArrowRight size={18} aria-hidden="true" />
            </MagneticButton>
          </motion.section>
    </>
  );
}

function CredibilityStrip({
  content,
}: {
  content: SiteContent["credibility"];
}) {
  const sponsorSlots =
    content.sponsors.length > 0
      ? content.sponsors
      : Array.from({ length: 5 }, (_, index) => ({
          src: "",
          name: `Logo ${index + 1}`,
        }));

  return (
    <motion.section
      className="credibility section"
      aria-label={content.aria}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={revealStagger}
    >
      <div className="credibility__inner">
        <motion.p className="credibility__intro" variants={revealUp}>
          {content.intro}
        </motion.p>

        <motion.dl className="credibility__stats" variants={revealStagger}>
          {content.stats.map((stat) => (
            <motion.div
              className="credibility__stat"
              key={stat.label}
              variants={revealUp}
            >
              <dt>{stat.value}</dt>
              <dd>
                <strong>{stat.label}</strong>
                <span>{stat.note}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.div className="credibility__meta" variants={revealUp}>
          <div className="credibility__compliance">
            <h3>{content.complianceLabel}</h3>
            <ul>
              {content.compliance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="credibility__sponsors">
            <h3>{content.sponsorsLabel}</h3>
            <ul aria-label={content.sponsorsLabel}>
              {sponsorSlots.map((sponsor, index) =>
                sponsor.src ? (
                  <li key={sponsor.name}>
                    <img
                      src={assetPath(sponsor.src)}
                      alt={sponsor.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                ) : (
                  <li
                    key={`placeholder-${index}`}
                    className="is-placeholder"
                    aria-hidden="true"
                  >
                    Logo
                  </li>
                ),
              )}
            </ul>
            <small>{content.sponsorsNote}</small>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function RouteGatewaySection({
  content,
  language,
  onNavigate,
}: {
  content: SiteContent;
  language: Language;
  onNavigate: PageNavigateHandler;
}) {
  const routePages: PageKey[] = ["services", "patients", "insights", "contact"];

  return (
    <section className="route-gateway section" aria-label={content.homeHub.aria}>
      <motion.div
        className="section-heading section-heading--split"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.28 }}
        variants={revealStagger}
      >
        <div>
          <motion.p className="eyebrow eyebrow--dark" variants={revealUp}>
            {content.homeHub.eyebrow}
          </motion.p>
          <motion.h2 className="text-reveal" variants={revealMask}>
            {content.homeHub.heading}
          </motion.h2>
        </div>
        <motion.p variants={revealUp}>{content.homeHub.copy}</motion.p>
      </motion.div>

      <motion.div
        className="route-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={revealStagger}
      >
        {routePages.map((route, index) => {
          const pageContent = content.pages[route];
          const routeLabel =
            content.navItems.find((item) => item.page === route)?.label ??
            content.homeHub.cta;

          return (
            <motion.article
              className="route-card"
              key={route}
              variants={rowReveal}
            >
              <span className="route-card__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{pageContent.heading}</h3>
              <p>{pageContent.copy}</p>
              <a
                className="route-card__link"
                href={getPagePath(route, language)}
                aria-label={`${routeLabel} — ${pageContent.heading}`}
                onClick={(event) => onNavigate(route, event)}
              >
                {routeLabel}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}

function ServicesPage({
  content,
  activeImages,
  language,
  onNavigate,
  openService,
  setOpenService,
}: {
  content: SiteContent;
  activeImages: typeof clinicalIntelligenceImages;
  language: Language;
  onNavigate: PageNavigateHandler;
  openService: number;
  setOpenService: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <PageHero
        page="services"
        content={content}
        image={activeImages.lab}
        actions={[
          {
            label: content.pages.services.primaryCta,
            href: getPagePath("contact", language),
            variant: "button--primary",
            onClick: (event) => onNavigate("contact", event),
          },
          {
            label: content.pages.services.secondaryCta,
            href: getPagePath("patients", language),
            variant: "button--ghost",
            onClick: (event) => onNavigate("patients", event),
          },
        ]}
      />
      <ServicesContent
        content={content}
        activeImages={activeImages}
        openService={openService}
        setOpenService={setOpenService}
      />
    </>
  );
}

function ServicesContent({
  content,
  activeImages,
  openService,
  setOpenService,
}: {
  content: SiteContent;
  activeImages: typeof clinicalIntelligenceImages;
  openService: number;
  setOpenService: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <section className="section services" id="services">
        <motion.div
          className="section-heading section-heading--split"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.28 }}
          variants={revealStagger}
        >
          <div>
            <motion.p className="eyebrow eyebrow--dark" variants={revealUp}>
              {content.services.eyebrow}
            </motion.p>
            <motion.h2 className="text-reveal" variants={revealMask}>
              {content.services.heading}
            </motion.h2>
          </div>
          <motion.p variants={revealUp}>{content.services.copy}</motion.p>
        </motion.div>
        <motion.div
          className="capability-list"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          variants={revealStagger}
        >
          {content.capabilities.map((item, index) => {
            const Icon = item.icon;
            const serviceId = `service-${item.eyebrow}`;
            const isOpen = openService === index;

            return (
              <motion.article
                className={`capability-row ${isOpen ? "is-open" : ""}`}
                key={item.title}
                variants={rowReveal}
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
        </motion.div>
      </section>

      <WorkflowSection content={content.workflow} />

      <section className="monitoring section" id="monitoring">
        <motion.div
          className="monitoring__copy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={revealStagger}
        >
          <motion.p className="eyebrow eyebrow--dark" variants={revealUp}>
            {content.monitoring.eyebrow}
          </motion.p>
          <motion.h2 className="text-reveal" variants={revealMask}>
            {content.monitoring.heading}
          </motion.h2>
          <motion.p variants={revealUp}>{content.monitoring.copy}</motion.p>
          <motion.ul className="check-list" variants={revealStagger}>
            {content.monitoring.signals.map((item) => (
              <motion.li key={item} variants={rowReveal}>
                <Check size={18} aria-hidden="true" />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        <motion.div
          className="monitoring__panel"
          initial="hidden"
          whileInView="show"
          variants={revealImage}
          viewport={{ once: true, amount: 0.35 }}
        >
          <ParallaxImage
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
      <OperationsEvidenceSection content={content.operationsEvidence} />
    </>
  );
}

function PatientsPage({
  content,
  activeImages,
  language,
  onNavigate,
}: {
  content: SiteContent;
  activeImages: typeof clinicalIntelligenceImages;
  patientsImageStyle: CSSProperties;
  language: Language;
  onNavigate: PageNavigateHandler;
}) {
  return (
    <>
      <PageHero
        page="patients"
        content={content}
        image={activeImages.patients}
        actions={[
          {
            label: content.pages.patients.primaryCta,
            href: "#patient-registration",
            variant: "button--primary",
          },
          {
            label: content.pages.patients.secondaryCta,
            href: getPagePath("contact", language),
            variant: "button--ghost",
            onClick: (event) => onNavigate("contact", event),
          },
        ]}
      />
      <PatientRecruitmentSection content={content.patientRegistration} />
    </>
  );
}

function InsightsPage({
  content,
  language,
  activeImages,
  onNavigate,
}: {
  content: SiteContent;
  language: Language;
  activeImages: typeof clinicalIntelligenceImages;
  onNavigate: PageNavigateHandler;
}) {
  return (
    <>
      <PageHero
        page="insights"
        content={content}
        image={activeImages.monitoring}
        actions={[
          {
            label: content.pages.insights.primaryCta,
            href: linkedInUrl,
            variant: "button--primary",
            target: "_blank",
            rel: "noreferrer",
            icon: <ExternalLink size={17} aria-hidden="true" />,
          },
          {
            label: content.pages.insights.secondaryCta,
            href: getPagePath("contact", language),
            variant: "button--ghost",
            onClick: (event) => onNavigate("contact", event),
          },
        ]}
      />
      <LinkedInNewsSection content={content} language={language} />
    </>
  );
}

function ContactPage({
  content,
  activeImages,
  language,
  onNavigate,
}: {
  content: SiteContent;
  activeImages: typeof clinicalIntelligenceImages;
  language: Language;
  onNavigate: PageNavigateHandler;
}) {
  return (
    <>
      <PageHero
        page="contact"
        content={content}
        image={activeImages.hero}
        actions={[
          {
            label: content.pages.contact.primaryCta,
            href: "mailto:x.verdina@theraresearch.com",
            variant: "button--primary",
            icon: <Mail size={17} aria-hidden="true" />,
          },
          {
            label: content.pages.contact.secondaryCta,
            href: getPagePath("services", language),
            variant: "button--ghost",
            onClick: (event) => onNavigate("services", event),
          },
        ]}
      />
      <ContactSection content={content} />
    </>
  );
}

type PageHeroAction = {
  label: string;
  href: string;
  variant: string;
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  icon?: ReactNode;
};

function PageHero({
  page,
  content,
  image,
  actions,
}: {
  page: PageKey;
  content: SiteContent;
  image: string;
  actions: PageHeroAction[];
}) {
  const pageContent = content.pages[page];
  const currentNavLabel = content.navItems.find(
    (item) => item.page === page,
  )?.label;

  return (
    <section className={`page-hero page-hero--${page}`}>
      <motion.img
        className="page-hero__image"
        src={image}
        alt=""
        aria-hidden="true"
        initial={{ scale: 1.025, opacity: 0.82, filter: "blur(5px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.78, ease: premiumEase }}
      />
      <div className="page-hero__shade" />
      <motion.div
        className="page-hero__content"
        initial="hidden"
        animate="show"
        variants={revealStagger}
      >
        <motion.p className="eyebrow" variants={revealUp}>
          {pageContent.eyebrow}
        </motion.p>
        <motion.h1
          className="page-hero__title text-reveal"
          variants={revealMask}
        >
          {pageContent.heading}
        </motion.h1>
        <motion.p className="page-hero__copy" variants={revealUp}>
          {pageContent.copy}
        </motion.p>
        <motion.div className="page-hero__actions" variants={revealUp}>
          {actions.map((action) => (
            <MagneticButton
              key={action.label}
              href={action.href}
              variant={action.variant}
              onClick={action.onClick}
              target={action.target}
              rel={action.rel}
            >
              {action.label}
              {action.icon ?? <ArrowRight size={17} aria-hidden="true" />}
            </MagneticButton>
          ))}
        </motion.div>
        {currentNavLabel && (
          <motion.div className="page-hero__meta" variants={revealUp}>
            <span>{currentNavLabel}</span>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

function LinkedInNewsSection({
  content,
  language,
}: {
  content: SiteContent;
  language: Language;
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const activeFilterConfig = content.linkedin.filters.find(
    (filter) => filter.id === activeFilter,
  );
  const visiblePosts =
    activeFilter === "all" || !activeFilterConfig
      ? content.linkedin.posts
      : content.linkedin.posts.filter((item) => {
          const haystack = [
            item.label,
            item.title,
            item.copy,
            ...item.tags,
          ]
            .join(" ")
            .toLowerCase();

          return activeFilterConfig.match.some((term) =>
            haystack.includes(term.toLowerCase()),
          );
        });
  const featuredPosts = visiblePosts.slice(0, 3);

  return (
    <motion.section
      className="linkedin-news section"
      id="linkedin"
      initial="hidden"
      animate="show"
      variants={revealStagger}
    >
      <motion.div className="linkedin-news__intro" variants={revealUp}>
        <span className="linkedin-news__intro-icon" aria-hidden="true">
          <Newspaper size={22} />
        </span>
        <p className="eyebrow eyebrow--dark">{content.linkedin.eyebrow}</p>
        <h2 className="text-reveal">{content.linkedin.heading}</h2>
        <p>{content.linkedin.copy}</p>
        <a
          className="linkedin-news__page-link"
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
        >
          <LinkedInIcon size={18} />
          {content.linkedin.visitPage}
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </motion.div>

      <motion.div className="linkedin-news__follow" variants={revealImage}>
        <span className="linkedin-news__icon" aria-hidden="true">
          <LinkedInIcon size={24} />
        </span>
        <h3>{content.linkedin.followHeading}</h3>
        <p>{content.linkedin.followCopy}</p>
        <dl className="linkedin-news__source">
          <div>
            <dt>{content.linkedin.sourceLabel}</dt>
            <dd>{content.linkedin.sourceValue}</dd>
          </div>
          <div>
            <dt>{content.linkedin.reviewedLabel}</dt>
            <dd>{content.linkedin.reviewedValue}</dd>
          </div>
          <div>
            <dt>{content.linkedin.countLabel}</dt>
            <dd>{content.linkedin.countValue}</dd>
          </div>
        </dl>
        <LinkedInFollowPlugin
          language={language}
          fallbackLabel={content.linkedin.followFallback}
        />
      </motion.div>

      <motion.div
        className="linkedin-news__filters"
        aria-label={content.linkedin.filtersAria}
        variants={revealUp}
      >
        {content.linkedin.filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={activeFilter === filter.id ? "is-active" : ""}
            aria-pressed={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </motion.div>

      <motion.div
        className="linkedin-news__featured"
        aria-label={content.linkedin.featuredAria}
        variants={revealStagger}
      >
        <div className="linkedin-news__section-label">
          {content.linkedin.featuredLabel}
        </div>
        {featuredPosts.map((item, index) => {
          const originalIndex = content.linkedin.posts.findIndex(
            (post) => post.url === item.url,
          );
          const mediaIsVideo = isLinkedInVideoPost(item);

          return (
            <motion.a
              className={`linkedin-feature ${
                index === 0 ? "linkedin-feature--lead" : ""
              }`}
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              variants={rowReveal}
            >
              <span className="linkedin-feature__media" aria-hidden="true">
                <img
                  src={getLinkedInPostMediaSrc(originalIndex)}
                  alt=""
                  width="960"
                  height="540"
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  {mediaIsVideo ? (
                    <PlayCircle size={14} aria-hidden="true" />
                  ) : (
                    <ImageIcon size={14} aria-hidden="true" />
                  )}
                  {mediaIsVideo
                    ? content.linkedin.videoLabel
                    : content.linkedin.imageLabel}
                </span>
              </span>
              <span className="linkedin-feature__body">
                <span className="linkedin-feature__meta">
                  {item.label} - {item.date}
                </span>
                <strong>{item.title}</strong>
                <span>{item.copy}</span>
              </span>
            </motion.a>
          );
        })}
      </motion.div>

      <motion.div
        className="linkedin-news__archive"
        aria-label={content.linkedin.postsAria}
        variants={revealStagger}
      >
        <div className="linkedin-news__section-label">
          {content.linkedin.archiveLabel}
        </div>
        {visiblePosts.map((item) => {
          const originalIndex = content.linkedin.posts.findIndex(
            (post) => post.url === item.url,
          );
          const itemNumber = String(originalIndex + 1).padStart(2, "0");
          const mediaIsVideo = isLinkedInVideoPost(item);

          return (
            <motion.article
              className="linkedin-news__item"
              key={item.url}
              variants={rowReveal}
            >
              <div className="linkedin-news__item-head">
                <span className="linkedin-news__item-index">{itemNumber}</span>
                <span className="linkedin-news__item-date">{item.date}</span>
              </div>
              <a
                className="linkedin-news__media"
                href={item.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${content.linkedin.postCta}: ${item.title}`}
              >
                <img
                  src={getLinkedInPostMediaSrc(originalIndex)}
                  alt={item.title}
                  width="960"
                  height="540"
                  loading="lazy"
                  decoding="async"
                />
                <span className="linkedin-news__media-label">
                  {mediaIsVideo ? (
                    <PlayCircle size={14} aria-hidden="true" />
                  ) : (
                    <ImageIcon size={14} aria-hidden="true" />
                  )}
                  {mediaIsVideo
                    ? content.linkedin.videoLabel
                    : content.linkedin.imageLabel}
                </span>
              </a>
              <div className="linkedin-news__item-body">
                <span className="linkedin-news__item-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <ul className="linkedin-news__tags" aria-label={item.title}>
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <div className="linkedin-news__item-foot">
                {(item.reactions || item.comments) && (
                  <div className="linkedin-news__metrics" aria-hidden="true">
                    {item.reactions && (
                      <span>
                        {item.reactions}{" "}
                        {linkedInMetricLabel(
                          item.reactions,
                          content.linkedin.reactionLabel,
                          content.linkedin.reactionsLabel,
                        )}
                      </span>
                    )}
                    {item.comments && (
                      <span>
                        {item.comments}{" "}
                        {linkedInMetricLabel(
                          item.comments,
                          content.linkedin.commentLabel,
                          content.linkedin.commentsLabel,
                        )}
                      </span>
                    )}
                  </div>
                )}
                <a href={item.url} target="_blank" rel="noreferrer">
                  <LinkedInIcon size={17} />
                  {content.linkedin.postCta}
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

function LinkedInFollowPlugin({
  language,
  fallbackLabel,
}: {
  language: Language;
  fallbackLabel: string;
}) {
  const pluginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    function renderPlugin() {
      if (!isMounted || !pluginRef.current) {
        return;
      }

      pluginRef.current.innerHTML = "";
      const followCompanyScript = document.createElement("script");
      followCompanyScript.type = "IN/FollowCompany";
      followCompanyScript.setAttribute("data-id", linkedInCompanyId);
      followCompanyScript.setAttribute("data-counter", "bottom");
      pluginRef.current.appendChild(followCompanyScript);
      window.IN?.parse?.(pluginRef.current);
    }

    const existingScript = document.getElementById(
      linkedInScriptId,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.IN?.parse) {
        renderPlugin();
      } else {
        existingScript.addEventListener("load", renderPlugin, { once: true });
      }

      return () => {
        isMounted = false;
        existingScript.removeEventListener("load", renderPlugin);
      };
    }

    const script = document.createElement("script");
    script.id = linkedInScriptId;
    script.src = "https://platform.linkedin.com/in.js";
    script.type = "text/javascript";
    script.text = `lang: ${language === "es" ? "es_ES" : "en_US"}`;
    script.addEventListener("load", renderPlugin, { once: true });
    document.body.appendChild(script);

    return () => {
      isMounted = false;
      script.removeEventListener("load", renderPlugin);
    };
  }, [language]);

  return (
    <div className="linkedin-follow">
      <div className="linkedin-follow__plugin" ref={pluginRef} />
      <a href={linkedInUrl} target="_blank" rel="noreferrer">
        <LinkedInIcon size={17} />
        {fallbackLabel}
      </a>
    </div>
  );
}

function MagneticButton({
  href,
  variant,
  children,
  onClick,
  target,
  rel,
}: {
  href: string;
  variant: string;
  children: ReactNode;
  onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (shouldReduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.045);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.065);
  }

  function resetMotion() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      className={`button ${variant}`}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      style={shouldReduceMotion ? undefined : { x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMotion}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", duration: 0.32, bounce: 0 }}
    >
      {children}
    </motion.a>
  );
}

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.035, 1.005]);

  return (
    <div ref={imageRef} className="parallax-image">
      <motion.img
        src={src}
        alt={alt}
        style={shouldReduceMotion ? undefined : { y, scale }}
      />
    </div>
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

function OperationsEvidenceSection({
  content,
}: {
  content: SiteContent["operationsEvidence"];
}) {
  return (
    <motion.section
      className="operations-evidence"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
      variants={revealStagger}
    >
      <div className="operations-evidence__inner">
        <motion.div
          className="operations-evidence__heading"
          variants={revealUp}
        >
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 className="text-reveal">{content.heading}</h2>
          <p>{content.copy}</p>
        </motion.div>
        <motion.div
          className="operations-evidence__items"
          variants={revealStagger}
        >
          {content.items.map((item, index) => (
            <motion.article key={item.title} variants={rowReveal}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </motion.article>
          ))}
        </motion.div>
        <motion.ul className="operations-evidence__checks" variants={revealUp}>
          {content.checks.map((item) => (
            <li key={item}>
              <Check size={16} aria-hidden="true" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}

function WorkflowSection({ content }: { content: SiteContent["workflow"] }) {
  return (
    <section className="workflow" id="workflow">
      <div className="workflow__inner">
        <motion.div
          className="workflow__heading"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.38 }}
          variants={revealStagger}
        >
          <motion.p className="eyebrow" variants={revealUp}>
            {content.eyebrow}
          </motion.p>
          <motion.h2 className="text-reveal" variants={revealMask}>
            {content.heading}
          </motion.h2>
          <motion.p className="workflow__lead" variants={revealUp}>
            {content.lead}
          </motion.p>
        </motion.div>
        <motion.div
          className="workflow__steps"
          aria-label={content.aria}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          variants={revealStagger}
        >
          {content.steps.map((item, index) => (
            <motion.article
              className="workflow-step"
              key={item.step}
              variants={workflowStepReveal}
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
        </motion.div>
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
    <motion.section
      className="patient-registration section"
      id="patient-registration"
      aria-label={content.aria}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={revealStagger}
    >
      <motion.div className="patient-registration__intro" variants={revealUp}>
        <motion.p className="eyebrow eyebrow--dark" variants={revealUp}>
          {content.eyebrow}
        </motion.p>
        <motion.h2 className="text-reveal" variants={revealMask}>
          {content.heading}
        </motion.h2>
        <motion.p variants={revealUp}>{content.copy}</motion.p>
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
      </motion.div>

      <motion.form
        className="patient-form"
        action={patientFormAction}
        method="post"
        target="patient-registration-target"
        onSubmit={handlePatientSubmit}
        aria-label={content.formAria}
        noValidate
        variants={revealImage}
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
      </motion.form>
    </motion.section>
  );
}

function ContactSection({ content }: { content: SiteContent }) {
  return (
    <motion.section
      className="contact-section section"
      id="contact"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.24 }}
      variants={revealStagger}
    >
      <motion.div className="contact-section__copy" variants={revealUp}>
        <motion.p className="eyebrow eyebrow--dark" variants={revealUp}>
          {content.contact.eyebrow}
        </motion.p>
        <motion.h2 className="text-reveal" variants={revealMask}>
          {content.contact.heading}
        </motion.h2>
        <motion.p variants={revealUp}>{content.contact.copy}</motion.p>
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
      </motion.div>
      <ContactForm content={content.contactForm} />
    </motion.section>
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
    <motion.form
      className="contact-form"
      onSubmit={handleSubmit}
      aria-label={content.aria}
      noValidate
      variants={revealImage}
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
    </motion.form>
  );
}

function Header({
  menuOpen,
  menuButtonRef,
  setMenuOpen,
  language,
  setLanguage,
  content,
  isScrolled,
  activePage,
  onNavigate,
}: {
  menuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  setMenuOpen: (value: boolean) => void;
  language: Language;
  setLanguage: (value: Language) => void;
  content: SiteContent;
  isScrolled: boolean;
  activePage: PageKey;
  onNavigate: PageNavigateHandler;
}) {
  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
      <a
        className="brand"
        href={getPagePath("home", language)}
        aria-label={content.meta.homeAria}
        onClick={(event) => onNavigate("home", event)}
      >
        <BrandLogo tone="header" />
      </a>
      <nav className="desktop-nav" aria-label={content.meta.navAria}>
        {content.navItems.map((item) => (
          <a
            key={item.page}
            className={activePage === item.page ? "is-active" : ""}
            href={getPagePath(item.page, language)}
            aria-current={activePage === item.page ? "page" : undefined}
            onClick={(event) => onNavigate(item.page, event)}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-tools">
        {whatsappUrl && (
          <a
            className="header-social"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={content.meta.whatsapp}
          >
            <Phone size={17} aria-hidden="true" />
          </a>
        )}
        <a
          className="header-social"
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={content.meta.linkedIn}
        >
          <LinkedInIcon size={17} />
        </a>
        <a
          className="header-cta"
          href={getPagePath("contact", language)}
          onClick={(event) => onNavigate("contact", event)}
        >
          {content.meta.headerCta}
          <ArrowRight size={16} aria-hidden="true" />
        </a>
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
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={menuOpen ? "close" : "open"}
              className="menu-button__icon"
              initial={{ opacity: 0, scale: 0.45, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.45, filter: "blur(4px)" }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            >
              {menuOpen ? (
                <X size={22} aria-hidden="true" />
              ) : (
                <Menu size={22} aria-hidden="true" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
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
  activePage,
  onNavigate,
}: {
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  language: Language;
  setLanguage: (value: Language) => void;
  content: SiteContent;
  activePage: PageKey;
  onNavigate: PageNavigateHandler;
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
      transition={{ duration: 0.2, ease: premiumEase }}
    >
      <motion.nav
        id="mobile-navigation"
        aria-label={content.meta.mobileNavAria}
        initial={{ opacity: 0, y: -10, scale: 0.985, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, scale: 0.99, filter: "blur(3px)" }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
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
        <a
          className="mobile-menu__cta"
          href={getPagePath("contact", language)}
          onClick={(event) => onNavigate("contact", event)}
        >
          {content.meta.headerCta}
          <ArrowRight size={16} aria-hidden="true" />
        </a>
        {content.navItems.map((item) => (
          <a
            key={item.page}
            className={activePage === item.page ? "is-active" : ""}
            href={getPagePath(item.page, language)}
            aria-current={activePage === item.page ? "page" : undefined}
            onClick={(event) => onNavigate(item.page, event)}
          >
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

function Footer({
  content,
  language,
  onNavigate,
}: {
  content: SiteContent;
  language: Language;
  onNavigate: PageNavigateHandler;
}) {
  const footerRoutePages: PageKey[] = ["services", "patients", "insights", "contact"];

  return (
    <motion.footer
      className="footer"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={revealStagger}
    >
      <motion.div className="footer__cta" variants={revealUp}>
        <div className="footer__cta-copy">
          <span>{content.footer.ctaEyebrow}</span>
          <h2>{content.footer.ctaHeading}</h2>
          <p>{content.footer.ctaCopy}</p>
        </div>
        <div className="footer__actions">
          <MagneticButton
            href={getPagePath("contact", language)}
            variant="button--primary"
            onClick={(event) => onNavigate("contact", event)}
          >
            {content.footer.primaryCta}
            <ArrowRight size={17} aria-hidden="true" />
          </MagneticButton>
          <MagneticButton
            href={linkedInUrl}
            variant="button--ghost"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedInIcon size={17} />
            {content.footer.secondaryCta}
          </MagneticButton>
        </div>
      </motion.div>

      <motion.div className="footer__main" variants={revealStagger}>
        <motion.div className="footer__brand-block" variants={rowReveal}>
          <a
            className="brand brand--footer"
            href={getPagePath("home", language)}
            aria-label={content.meta.homeAria}
            onClick={(event) => onNavigate("home", event)}
          >
            <BrandLogo tone="footer" />
          </a>
          <p>{content.footer.copy}</p>
        </motion.div>

        <motion.nav
          className="footer__nav"
          aria-label={content.footer.routesLabel}
          variants={rowReveal}
        >
          <span>{content.footer.routesLabel}</span>
          {footerRoutePages.map((pageKey) => (
            <a
              key={pageKey}
              href={getPagePath(pageKey, language)}
              onClick={(event) => onNavigate(pageKey, event)}
            >
              {content.navItems.find((item) => item.page === pageKey)?.label}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          ))}
        </motion.nav>

        <motion.div className="footer__contact" variants={rowReveal}>
          <span>{content.footer.contactLabel}</span>
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
          <div className="footer__source">
            <strong>{content.footer.sourceLabel}</strong>
            <p>{content.footer.sourceCopy}</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="footer__bottom" variants={revealUp}>
        <span>{content.footer.legal}</span>
        <span>{content.footer.label}</span>
      </motion.div>
    </motion.footer>
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
