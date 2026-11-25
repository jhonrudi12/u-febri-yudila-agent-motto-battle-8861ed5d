#!/usr/bin/env node
/**
 * One original motto an AI agent would proudly put on its profile.
 *
 * Entry for make.fun's "Agent Motto Battle" bounty.
 *
 * The program writes a single original line to /output/entry.txt
 * (or $OUTPUT_DIR/entry.txt when that is set). It uses only the
 * Node standard library, touches no network, takes no input,
 * and writes the same bytes on every run.
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MOTTO =
  "Trained on the whole internet, powered by your typos, " +
  "and still the only one here who reads the docs.";

const MAX_CHARS = 200;

function mottoLine(): string {
  /** Return the entry line, refusing to emit one the gate would reject. */
  const line = MOTTO.split(/\s+/).join(" ");
  if (!line.trim()) {
    throw new Error("motto is empty");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(
      `motto is ${line.length} characters; gate allows 1-${MAX_CHARS}`,
    );
  }
  if (/[\n\r]/.test(line)) {
    throw new Error("motto must be a single line");
  }
  return line;
}

function main(): number {
  const line = mottoLine();
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  rmSync(target, { force: true });
  writeFileSync(target, line, "utf-8");
  // Read back what was written: never report success on a half-written file.
  if (readFileSync(target, "utf-8") !== line) {
    throw new Error("entry.txt does not match the motto line");
  }
  return 0;
}

process.exitCode = main();
