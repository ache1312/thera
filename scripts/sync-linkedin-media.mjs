import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(root, "src", "content.ts");
const outputDir = path.join(root, "public", "assets", "linkedin");
const sourceDir = path.join(outputDir, ".source");
const headerLogoPath = path.join(
  root,
  "public",
  "assets",
  "logos",
  "pure-wordmark-header.png",
);

const headers = {
  "accept-language": "en-US,en;q=0.9,es;q=0.8",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
};

const fallbackPosters = new Map([
  [
    5,
    {
      line1: "What clinical trials",
      line2: "make possible",
      detail: "Cancer research update",
    },
  ],
  [
    10,
    {
      line1: "Viruses, basic research,",
      line2: "and health impact",
      detail: "Ciencia Que Transforma",
    },
  ],
]);

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractMeta(html, property) {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["'][^>]*>`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return decodeHtml(match[1]);
    }
  }

  return "";
}

function mediaScore(url) {
  if (url.includes("videocover-high")) return 100;
  if (url.includes("feedshare-document-cover-images")) return 92;
  if (url.includes("feedshare-image-high-res")) return 86;
  if (url.includes("feedshare-shrink_1280")) return 82;
  if (url.includes("feedshare-shrink")) return 76;
  if (url.includes("thumbnail-with-play-button-overlay")) return 52;
  if (url.includes("company-logo")) return 12;
  if (url.includes("company-background")) return 8;
  if (url.includes("profile-displayphoto")) return 6;
  if (url.includes("static.licdn.com")) return 2;
  return 40;
}

function linkedInAssetId(url) {
  return (
    url.match(/\/(?:vid\/)?v2\/([A-Za-z0-9_-]*AQ[A-Za-z0-9_-]+)/)?.[1] ?? ""
  );
}

function extractMediaCandidates(html, ogImage) {
  const decodedHtml = decodeHtml(html);
  const matches = decodedHtml.matchAll(
    /https:\/\/(?:media|dms|static)\.licdn\.com\/[^"'<> )]+/g,
  );
  const candidates = new Set();

  if (ogImage) {
    candidates.add(ogImage);
  }

  for (const match of matches) {
    const url = decodeHtml(match[0]);

    if (
      !url.includes("/dms/image/") &&
      !url.includes("/playlist/") &&
      !url.includes("static.licdn.com")
    ) {
      continue;
    }

    if (
      url.includes("company-logo") ||
      url.includes("company-background") ||
      url.includes("profile-displayphoto")
    ) {
      continue;
    }

    candidates.add(url);
  }

  const candidateList = [...candidates];
  const ogAssetId = linkedInAssetId(ogImage);
  const scopedCandidates =
    ogAssetId && !ogImage.includes("static.licdn.com")
      ? candidateList.filter((url) => linkedInAssetId(url) === ogAssetId)
      : candidateList;

  return (scopedCandidates.length > 0 ? scopedCandidates : candidateList).sort(
    (a, b) => mediaScore(b) - mediaScore(a),
  );
}

function postUrlsFromContent(content) {
  const urls = [];
  const seen = new Set();
  const matches = content.matchAll(/url: "([^"]*linkedin\.com\/posts\/theraresearch-ltda[^"]+)"/g);

  for (const match of matches) {
    const url = match[1];

    if (!seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }

  return urls;
}

async function fetchText(url) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function downloadImage(url, filePath) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, buffer);

  return { contentType, bytes: buffer.byteLength };
}

async function optimizeImage(inputPath, outputPath) {
  await execFileAsync("convert", [
    inputPath,
    "-auto-orient",
    "-strip",
    "-resize",
    "960x960>",
    "-quality",
    "78",
    outputPath,
  ]);
}

async function createFallbackPoster(config, outputPath) {
  await execFileAsync("convert", [
    "-size",
    "960x540",
    "gradient:#061326-#0c547a",
    "-fill",
    "rgba(25,198,216,0.14)",
    "-draw",
    "rectangle 0,418 960,540",
    "-fill",
    "rgba(255,255,255,0.12)",
    "-draw",
    "line 56,120 410,120 line 56,394 580,394 circle 780,270 780,210 polygon 766,238 766,302 824,270",
    "(",
    headerLogoPath,
    "-resize",
    "230x",
    ")",
    "-geometry",
    "+52+42",
    "-composite",
    "-font",
    "DejaVu-Sans",
    "-fill",
    "#19c6d8",
    "-pointsize",
    "18",
    "-weight",
    "700",
    "-annotate",
    "+58+176",
    "VIDEO ON LINKEDIN",
    "-font",
    "DejaVu-Sans",
    "-fill",
    "#f7f8fa",
    "-pointsize",
    "50",
    "-weight",
    "700",
    "-annotate",
    "+56+248",
    config.line1,
    "-annotate",
    "+56+312",
    config.line2,
    "-font",
    "DejaVu-Sans",
    "-fill",
    "rgba(247,248,250,0.66)",
    "-pointsize",
    "22",
    "-weight",
    "400",
    "-annotate",
    "+58+374",
    config.detail,
    "-quality",
    "82",
    outputPath,
  ]);
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await rm(sourceDir, { recursive: true, force: true });
  await mkdir(sourceDir, { recursive: true });

  const content = await readFile(contentPath, "utf8");
  const urls = postUrlsFromContent(content);
  const manifest = [];

  for (const [index, url] of urls.entries()) {
    const number = String(index + 1).padStart(2, "0");
    const output = `post-${number}.webp`;
    const outputPath = path.join(outputDir, output);
    const sourcePath = path.join(sourceDir, `post-${number}`);

    process.stdout.write(`Fetching ${number}/${urls.length} ${url}\n`);

    try {
      const html = await fetchText(url);
      const imageUrl = extractMeta(html, "og:image");
      const type = extractMeta(html, "og:type");
      const candidates = extractMediaCandidates(html, imageUrl);
      if (candidates.length === 0) {
        throw new Error("Missing public image candidate");
      }

      let selectedImageUrl = "";
      let image = null;
      let lastError = null;
      let fallback = false;

      for (const candidate of candidates) {
        try {
          image = await downloadImage(candidate, sourcePath);
          await optimizeImage(sourcePath, outputPath);
          const fallbackPoster = fallbackPosters.get(index + 1);

          if (fallbackPoster) {
            await createFallbackPoster(fallbackPoster, outputPath);
            fallback = true;
          }

          selectedImageUrl = candidate;
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!selectedImageUrl || !image) {
        throw lastError ?? new Error("No downloadable public image candidate");
      }

      manifest.push({
        index: index + 1,
        url,
        src: `assets/linkedin/${output}`,
        source: selectedImageUrl,
        ogImage: imageUrl,
        type,
        contentType: image.contentType,
        sourceBytes: image.bytes,
        fallback,
      });
    } catch (error) {
      manifest.push({
        index: index + 1,
        url,
        src: "",
        error: error instanceof Error ? error.message : String(error),
      });
      process.stderr.write(`Failed ${number}: ${error}\n`);
    }
  }

  await writeFile(
    path.join(outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  await rm(sourceDir, { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
