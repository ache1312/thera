import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

const rootDir = process.cwd();
const distDir = join(rootDir, "dist");
const indexPath = join(distDir, "index.html");
const seoConfigPath = join(rootDir, "src", "seo-config.json");

if (!existsSync(indexPath)) {
  throw new Error("dist/index.html is missing. Run the Vite build first.");
}

const seoConfig = JSON.parse(readFileSync(seoConfigPath, "utf8"));
const sourceHtml = readFileSync(indexPath, "utf8");
const languages = ["es", "en"];
const pages = ["home", "services", "patients", "insights", "contact"];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function absoluteUrl(path) {
  return `${seoConfig.siteUrl}${path}`;
}

function absoluteAssetUrl(path) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${seoConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getLocale(language) {
  return language === "es" ? "es_CL" : "en_US";
}

function getXDefaultPath(page) {
  return page === "home"
    ? seoConfig.legacyRoutes.home
    : seoConfig.routes[seoConfig.defaultLanguage][page];
}

function buildStructuredData(language, page, canonicalPath) {
  const pageSeo = seoConfig.pages[language][page];
  const canonicalUrl = absoluteUrl(canonicalPath);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${seoConfig.siteUrl}/#organization`,
        name: seoConfig.siteName,
        legalName: "Thera Research Ltda.",
        url: seoConfig.siteUrl,
        logo: absoluteAssetUrl(seoConfig.logo),
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

function renderAlternateLinks(page) {
  const alternateLinks = languages.map(
    (language) =>
      `<link rel="alternate" href="${absoluteUrl(
        seoConfig.routes[language][page],
      )}" hreflang="${language}" data-seo-alternate="true" />`,
  );

  alternateLinks.push(
    `<link rel="alternate" href="${absoluteUrl(
      getXDefaultPath(page),
    )}" hreflang="x-default" data-seo-alternate="true" />`,
  );

  return alternateLinks.join("\n    ");
}

function renderSeoBlock({ language, page, canonicalPath, robots = "index, follow" }) {
  const pageSeo = seoConfig.pages[language][page];
  const alternateLanguage = language === "es" ? "en" : "es";
  const socialImageUrl = absoluteAssetUrl(seoConfig.socialImage);
  const canonicalUrl = absoluteUrl(canonicalPath);
  const structuredData = buildStructuredData(language, page, canonicalPath);

  return `<!-- SEO_START -->
    <title>${escapeHtml(pageSeo.title)}</title>
    <meta name="description" content="${escapeHtml(pageSeo.description)}" />
    <meta name="robots" content="${escapeHtml(robots)}" />
    <meta name="theme-color" content="#071d24" />
    <link rel="canonical" href="${canonicalUrl}" />
    ${renderAlternateLinks(page)}
    <meta property="og:site_name" content="${escapeHtml(seoConfig.siteName)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="${getLocale(language)}" />
    <meta property="og:locale:alternate" content="${getLocale(alternateLanguage)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageSeo.ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageSeo.ogDescription)}" />
    <meta property="og:image" content="${socialImageUrl}" />
    <meta property="og:image:alt" content="${escapeHtml(
      `${seoConfig.siteName} clinical research operations`,
    )}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageSeo.ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageSeo.ogDescription)}" />
    <meta name="twitter:image" content="${socialImageUrl}" />
    <script id="thera-structured-data" type="application/ld+json">
      ${escapeJsonForHtml(structuredData)}
    </script>
    <!-- SEO_END -->`;
}

function renderHtml({ language, page, canonicalPath, robots }) {
  const seoBlock = renderSeoBlock({ language, page, canonicalPath, robots });
  const html = sourceHtml
    .replace(/<html lang="[^"]*">/, `<html lang="${language}">`)
    .replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, seoBlock);

  return html;
}

function getRouteFilePath(route) {
  if (route === "/") {
    return indexPath;
  }

  const routePath = route.replace(/^\/+|\/+$/g, "");
  return join(distDir, routePath, "index.html");
}

function writeRouteHtml(route, html) {
  const filePath = getRouteFilePath(route);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html);
}

function renderSitemap() {
  const urlEntries = [];

  for (const page of pages) {
    for (const language of languages) {
      const route = seoConfig.routes[language][page];
      const alternates = languages
        .map(
          (alternateLanguage) =>
            `    <xhtml:link rel="alternate" hreflang="${alternateLanguage}" href="${absoluteUrl(
              seoConfig.routes[alternateLanguage][page],
            )}" />`,
        )
        .join("\n");
      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(
        getXDefaultPath(page),
      )}" />`;

      urlEntries.push(`  <url>
    <loc>${absoluteUrl(route)}</loc>
    <lastmod>${seoConfig.lastmod}</lastmod>
${alternates}
${xDefault}
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>
`;
}

function renderRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;
}

for (const language of languages) {
  for (const page of pages) {
    const route = seoConfig.routes[language][page];
    writeRouteHtml(
      route,
      renderHtml({
        language,
        page,
        canonicalPath: route,
      }),
    );
  }
}

writeRouteHtml(
  seoConfig.legacyRoutes.home,
  renderHtml({
    language: seoConfig.defaultLanguage,
    page: "home",
    canonicalPath: seoConfig.routes[seoConfig.defaultLanguage].home,
  }),
);

for (const page of pages.filter((item) => item !== "home")) {
  writeRouteHtml(
    seoConfig.legacyRoutes[page],
    renderHtml({
      language: "en",
      page,
      canonicalPath: seoConfig.routes.en[page],
    }),
  );
}

writeFileSync(join(distDir, "sitemap.xml"), renderSitemap());
writeFileSync(join(distDir, "robots.txt"), renderRobots());

writeFileSync(
  join(distDir, "404.html"),
  renderHtml({
    language: seoConfig.defaultLanguage,
    page: "home",
    canonicalPath: seoConfig.routes[seoConfig.defaultLanguage].home,
    robots: "noindex, follow",
  }),
);

console.log("Applied SEO metadata, sitemap, robots.txt, and GitHub Pages fallback.");
