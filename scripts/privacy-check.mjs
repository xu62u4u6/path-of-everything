import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const ignoredDirectories = new Set([".git", "node_modules", "dist", "build", "coverage"]);
const files = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    if (entry.isFile()) files.push(relative(root, path));
  }
}
walk(root);
const failures = [];
const forbiddenExtensions = new Set([".db", ".sqlite", ".sqlite3", ".pob"]);
const forbiddenSegments = new Set(["private", "snapshots", "characters", "builds", "cache"]);

for (const file of files) {
  const normalized = file.split(sep).join("/");
  const segments = normalized.split("/");
  const extension = extname(normalized).toLowerCase();
  const isPublicFixture = normalized.startsWith("fixtures/public/");
  const isVendor = normalized.startsWith("vendor/");

  if (segments.some((segment) => forbiddenSegments.has(segment))) {
    failures.push(`${normalized}: forbidden private-data path`);
  }
  if (forbiddenExtensions.has(extension)) {
    failures.push(`${normalized}: forbidden private-data extension`);
  }
  if (extension === ".xml" && !isPublicFixture && !isVendor) {
    failures.push(`${normalized}: PoB XML is allowed only in fixtures/public or vendor`);
  }

  if (isVendor) continue;
  const content = readFileSync(join(root, normalized), "utf8");
  if (/POESESSID\s*[:=]/i.test(content)) {
    failures.push(`${normalized}: possible trade-session credential`);
  }
  if (/<PathOfBuilding[>\s]/.test(content) && !isPublicFixture) {
    failures.push(`${normalized}: embedded PoB export outside fixtures/public`);
  }
  if (/\b[A-Za-z0-9_]{3,}#[0-9]{4}\b/.test(content)) {
    failures.push(`${normalized}: possible PoE account discriminator`);
  }
}

if (failures.length > 0) {
  console.error("Privacy check failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Privacy check passed (${files.length} candidate files).`);
