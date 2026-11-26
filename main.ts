// The Internet in One Word — entry: "Doomscroll"
//
// Why this word: the whole internet, in one beat, is the endless scroll —
// the feed you open for one thing and leave an hour later having learned
// nothing and seen everything. It is funny by itself (a doom-flavoured
// pastime), it fits the internet as a whole rather than any one app, and
// it surprises: nobody's first obvious word for the internet is a verb
// about their own bad habit. It makes a reader laugh, then nod.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Doomscroll";

// The gate: entry.txt must be UTF-8 text of 1–30 characters, not only
// whitespace — and the judge weighs a single word, so reject anything
// that is not exactly one word.
if (WORD.length < 1 || WORD.length > 30) {
  throw new Error(`word must be 1–30 characters, got ${WORD.length}`);
}
if (/\s/.test(WORD)) {
  throw new Error("word must be a single word with no whitespace");
}

const outDir = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim() || "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, WORD, "utf8");

// Read it back and verify byte-for-byte: no trailing newline, no extra
// whitespace, exactly the word.
const written = readFileSync(outPath, "utf8");
if (written !== WORD) {
  throw new Error(
    `verification failed: entry.txt contains ${JSON.stringify(written)}, expected ${JSON.stringify(WORD)}`,
  );
}

console.log(`Wrote ${written.length} characters to ${outPath}: ${JSON.stringify(written)}`);
