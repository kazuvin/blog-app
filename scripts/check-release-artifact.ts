import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");

const SECURITY_HEADERS = [
  /^\s*Strict-Transport-Security\s*:/m,
  /^\s*X-Content-Type-Options\s*:\s*nosniff/im,
  /^\s*Content-Security-Policy\s*:.*frame-ancestors/im,
] as const;

const REQUIRED_FILES = ["robots.txt", "sitemap.xml", "favicon.svg", "_headers"] as const;

// Apple icon: accept either the legacy `apple-touch-icon.*` filename, or
// Next.js App Router's `apple-icon.*` static convention, or the
// `apple-icon` extensionless artifact emitted by `apple-icon.tsx`
// (route-handler ImageResponse — Next sets Content-Type via headers).
const APPLE_ICON_PATTERN = /^(apple-touch-icon|apple-icon)(\.(png|svg|jpg|jpeg|ico))?$/;

const PER_PAGE_TAG_CHECKS: { name: string; pattern: RegExp }[] = [
  { name: "<title>", pattern: /<title[^>]*>[^<]+<\/title>/i },
  { name: '<meta name="description">', pattern: /<meta[^>]+name=["']description["'][^>]*>/i },
  { name: '<link rel="canonical">', pattern: /<link[^>]+rel=["']canonical["'][^>]*>/i },
  { name: '<meta property="og:title">', pattern: /<meta[^>]+property=["']og:title["'][^>]*>/i },
  {
    name: '<meta property="og:description">',
    pattern: /<meta[^>]+property=["']og:description["'][^>]*>/i,
  },
  { name: '<meta property="og:url">', pattern: /<meta[^>]+property=["']og:url["'][^>]*>/i },
  { name: '<meta property="og:image">', pattern: /<meta[^>]+property=["']og:image["'][^>]*>/i },
  { name: '<meta name="twitter:card">', pattern: /<meta[^>]+name=["']twitter:card["'][^>]*>/i },
];

const NOINDEX_PATTERN = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i;

// Bundle size: warn only. Adjust as the app grows.
const JS_BUDGET_BYTES = 350 * 1024;

type Severity = "error" | "warn";
type Violation = { severity: Severity; where: string; message: string };

const violations: Violation[] = [];
const add = (severity: Severity, where: string, message: string): void => {
  violations.push({ severity, where, message });
};

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function checkRequiredFiles(): void {
  for (const name of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(OUT_DIR, name))) {
      add("error", name, `missing in out/`);
    }
  }
  const hasAppleIcon = fs
    .readdirSync(OUT_DIR)
    .some((entry) => APPLE_ICON_PATTERN.test(entry));
  if (!hasAppleIcon) {
    add("error", "apple-icon", "no apple-icon.* / apple-touch-icon.* in out/");
  }
}

function checkHeaders(): void {
  const headersPath = path.join(OUT_DIR, "_headers");
  if (!fs.existsSync(headersPath)) return; // already reported by checkRequiredFiles
  const text = fs.readFileSync(headersPath, "utf8");
  for (const pattern of SECURITY_HEADERS) {
    if (!pattern.test(text)) {
      add("error", "_headers", `missing required header matching ${pattern}`);
    }
  }
}

function checkHtmlPages(): void {
  const htmlFiles = [...walk(OUT_DIR)].filter((p) => p.endsWith(".html"));
  for (const file of htmlFiles) {
    const rel = path.relative(OUT_DIR, file);
    const isErrorPage = rel === "404.html" || rel.startsWith("404/");
    const text = fs.readFileSync(file, "utf8");

    for (const { name, pattern } of PER_PAGE_TAG_CHECKS) {
      if (pattern.test(text)) continue;
      // 404 is not shareable / not indexed → skip canonical, og:*, twitter:*
      if (isErrorPage && (name.includes("canonical") || name.includes("og:") || name.includes("twitter:"))) continue;
      add("error", rel, `missing ${name}`);
    }

    if (!isErrorPage && NOINDEX_PATTERN.test(text)) {
      add("error", rel, "noindex meta found on a public page");
    }
  }
}

function checkBundleSize(): void {
  const chunksDir = path.join(OUT_DIR, "_next/static/chunks");
  if (!fs.existsSync(chunksDir)) return;
  const total = [...walk(chunksDir)]
    .filter((p) => p.endsWith(".js"))
    .reduce((sum, p) => sum + fs.statSync(p).size, 0);
  if (total > JS_BUDGET_BYTES) {
    add(
      "warn",
      "_next/static/chunks",
      `JS bundle ${(total / 1024).toFixed(1)}KB exceeds budget ${(JS_BUDGET_BYTES / 1024).toFixed(0)}KB`
    );
  }
}

function report(): never {
  if (violations.length === 0) {
    console.info("[check-release-artifact] OK");
    process.exit(0);
  }
  const errors = violations.filter((v) => v.severity === "error");
  const warns = violations.filter((v) => v.severity === "warn");
  const grouped = new Map<string, Violation[]>();
  for (const v of violations) {
    const list = grouped.get(v.where) ?? [];
    list.push(v);
    grouped.set(v.where, list);
  }
  console.error(`\n[check-release-artifact] ${errors.length} error(s), ${warns.length} warning(s)`);
  for (const [where, list] of grouped) {
    console.error(`\n  ${where}`);
    for (const v of list) {
      const tag = v.severity === "error" ? "ERROR" : "warn ";
      console.error(`    ${tag}  ${v.message}`);
    }
  }
  console.error("");
  process.exit(errors.length > 0 ? 1 : 0);
}

if (!fs.existsSync(OUT_DIR)) {
  console.error(`[check-release-artifact] ${OUT_DIR} does not exist. Run \`pnpm build\` first.`);
  process.exit(1);
}

checkRequiredFiles();
checkHeaders();
checkHtmlPages();
checkBundleSize();
report();
