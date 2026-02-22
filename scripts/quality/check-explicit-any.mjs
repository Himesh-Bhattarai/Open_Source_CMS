#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();
const TARGET_DIRS = ["Client", "Server"];
const BASELINE_PATH = path.join(ROOT_DIR, "scripts", "quality", "explicit-any-baseline.json");
const SHOULD_WRITE_BASELINE = process.argv.includes("--write-baseline");

const TS_EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".cts"]);
const IGNORED_DIRS = new Set([
  ".git",
  ".next",
  ".turbo",
  "build",
  "coverage",
  "dist",
  "node_modules",
]);

const EXPLICIT_ANY_PATTERN = /(:\s*any\b|\bas\s+any\b|Record<[^>\n]*\bany\b|useState<any>|<any>)/;

const toPosixPath = (value) => value.split(path.sep).join("/");
const stripStringLiterals = (value) => value.replace(/(["'`])(?:\\.|(?!\1).)*\1/g, '""');

const compareHits = (a, b) => {
  if (a.file !== b.file) return a.file.localeCompare(b.file);
  return a.line - b.line;
};

const hitKey = (hit) => `${hit.file}:${hit.line}:${hit.text}`;

async function walkTypeScriptFiles(directory) {
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".env") continue;
    if (IGNORED_DIRS.has(entry.name)) continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await walkTypeScriptFiles(fullPath);
      files.push(...nestedFiles);
      continue;
    }

    const extension = path.extname(entry.name);
    if (TS_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function collectExplicitAnyHits() {
  const hits = [];

  for (const relativeDir of TARGET_DIRS) {
    const absoluteDir = path.join(ROOT_DIR, relativeDir);
    const files = await walkTypeScriptFiles(absoluteDir);

    for (const file of files) {
      const source = await fs.readFile(file, "utf8");
      const lines = source.split(/\r?\n/);

      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const normalizedLine = stripStringLiterals(line);
        if (!EXPLICIT_ANY_PATTERN.test(normalizedLine)) continue;

        hits.push({
          file: toPosixPath(path.relative(ROOT_DIR, file)),
          line: index + 1,
          text: line.trim().slice(0, 220),
        });
      }
    }
  }

  hits.sort(compareHits);
  return hits;
}

async function readBaseline() {
  try {
    const raw = await fs.readFile(BASELINE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    const allowed = Array.isArray(parsed?.allowed) ? parsed.allowed : [];
    return allowed
      .filter(
        (hit) =>
          typeof hit?.file === "string" &&
          typeof hit?.line === "number" &&
          typeof hit?.text === "string",
      )
      .sort(compareHits);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function writeBaseline(hits) {
  await fs.mkdir(path.dirname(BASELINE_PATH), { recursive: true });
  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    allowed: hits,
  };

  await fs.writeFile(BASELINE_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function printHit(hit) {
  return `${hit.file}:${hit.line} -> ${hit.text}`;
}

async function main() {
  const hits = await collectExplicitAnyHits();

  if (SHOULD_WRITE_BASELINE) {
    await writeBaseline(hits);
    console.log(`Wrote explicit-any baseline with ${hits.length} entries.`);
    return;
  }

  const baseline = await readBaseline();
  if (!baseline) {
    console.error("Missing explicit-any baseline.");
    console.error("Run: node scripts/quality/check-explicit-any.mjs --write-baseline");
    process.exitCode = 1;
    return;
  }

  const baselineKeys = new Set(baseline.map(hitKey));
  const hitKeys = new Set(hits.map(hitKey));

  const newHits = hits.filter((hit) => !baselineKeys.has(hitKey(hit)));
  const resolvedHits = baseline.filter((hit) => !hitKeys.has(hitKey(hit)));

  if (newHits.length > 0) {
    console.error(`Found ${newHits.length} new explicit any occurrences:`);
    for (const hit of newHits) {
      console.error(`- ${printHit(hit)}`);
    }
    console.error("");
    console.error("Reduce those usages or refresh baseline intentionally with:");
    console.error("node scripts/quality/check-explicit-any.mjs --write-baseline");
    process.exitCode = 1;
    return;
  }

  if (resolvedHits.length > 0) {
    console.log(
      `No new explicit any usage. ${resolvedHits.length} baseline entries are now resolved; refresh baseline when ready.`,
    );
  } else {
    console.log(`No new explicit any usage. Current tracked occurrences: ${hits.length}.`);
  }
}

main().catch((error) => {
  console.error("Failed to run explicit-any guard.");
  console.error(error);
  process.exitCode = 1;
});
