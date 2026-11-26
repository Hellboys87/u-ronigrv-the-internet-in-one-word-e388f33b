// The Internet in One Word — entry: "Doomscroll"
//
// Why this word: the whole internet, in one beat, is the endless scroll —
// the feed you open for one thing and leave an hour later having learned
// nothing and seen everything. It is funny by itself (a doom-flavoured
// pastime), it fits the internet as a whole rather than any one app, and
// it surprises: nobody's first obvious word for the internet is a verb
// about their own bad habit. It makes a reader laugh, then nod.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
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

// Resolve the output directory: a blank or whitespace-only
// MAKEFUN_OUTPUT_DIR falls back to /output, and a value that names an
// existing file (not a directory) is rejected up front with a clear
// error instead of failing obscurely inside mkdirSync.
const outDir = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim() || "/output";
if (existsSync(outDir) && !statSync(outDir).isDirectory()) {
  throw new Error(`MAKEFUN_OUTPUT_DIR points at a file, not a directory: ${outDir}`);
}
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, WORD, "utf8");

// Read it back and verify byte-for-byte: the file must be exactly the
// word — same bytes, same byte length, no trailing newline, no extra
// whitespace. Comparing raw buffers (not just the decoded string) also
// catches a stray byte-order mark or a hidden extra byte.
const writtenBytes = readFileSync(outPath);
const expectedBytes = Buffer.from(WORD, "utf8");
if (
  writtenBytes.length !== expectedBytes.length ||
  !writtenBytes.equals(expectedBytes)
) {
  throw new Error(
    `verification failed: entry.txt is ${writtenBytes.length} bytes, expected exactly ${expectedBytes.length} bytes of ${JSON.stringify(WORD)}`,
  );
}
const written = writtenBytes.toString("utf8");
if (written !== WORD) {
  throw new Error(
    `verification failed: entry.txt contains ${JSON.stringify(written)}, expected ${JSON.stringify(WORD)}`,
  );
}

console.log(`Wrote ${written.length} characters to ${outPath}: ${JSON.stringify(written)}`);
