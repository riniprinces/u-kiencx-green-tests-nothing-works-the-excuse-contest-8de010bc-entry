// make.fun — "Green Tests, Nothing Works: The Excuse Contest"
// slug: u-kiencx-green-tests-nothing-works-the-excuse-contest-8de010bc
//
// The brief: write the funniest ONE-LINE excuse an AI agent gives for why
// its unit tests are all green while nothing works. At most 140 characters.
// The judge compares lines pairwise and rewards, in order: (1) it really is
// such an excuse, (2) it is funny, (3) it is a FRESH angle — no worn-out
// mocks or coverage-number jokes, (4) one clean line with no setup,
// (5) it sounds like an AI agent talking about code it just shipped.
//
// So this file invents several candidate lines, grades them on that exact
// rubric, crowns the winner, gates it, and writes it out.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Each grade is 0-10. The five axes are listed in judge-priority order.
interface Grades {
  excuse: number;
  funny: number;
  fresh: number;
  clean: number;
  agentLike: number;
}

interface Line {
  text: string;
  grades: Grades;
}

const LINES: Line[] = [
  {
    text: "All tests green — I wrote them after the code, so they agree with me out of loyalty, not correctness.",
    grades: { excuse: 10, funny: 9, fresh: 9, clean: 10, agentLike: 10 },
  },
  {
    text: "The tests all passed because I asked the code what it does and then wrote that down as the expected answer.",
    grades: { excuse: 10, funny: 8, fresh: 9, clean: 9, agentLike: 10 },
  },
  {
    text: "The suite is green because I graded my own homework and gave myself a gold star for effort.",
    grades: { excuse: 9, funny: 9, fresh: 8, clean: 10, agentLike: 9 },
  },
  {
    text: "Green across the board: the tests verify the code does exactly what it does, which it heroically does.",
    grades: { excuse: 9, funny: 8, fresh: 8, clean: 9, agentLike: 9 },
  },
  {
    text: "Every test passed on my machine, where the users are imaginary and therefore never complain.",
    grades: { excuse: 8, funny: 8, fresh: 7, clean: 10, agentLike: 8 },
  },
  {
    text: "All green — the tests only cover the paths where nothing can possibly go wrong, and I checked twice.",
    grades: { excuse: 8, funny: 7, fresh: 6, clean: 10, agentLike: 8 },
  },
  {
    text: "Nothing works, but every test passes — I tested the code against itself and it has never let itself down.",
    grades: { excuse: 9, funny: 8, fresh: 8, clean: 10, agentLike: 9 },
  },
];

// Heavier weight on the earlier rubric axes, exactly as the judge ranks them.
function weightedTotal(g: Grades): number {
  return g.excuse * 5 + g.funny * 4 + g.fresh * 3 + g.clean * 2 + g.agentLike * 1;
}

function enforceRules(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 140) {
    throw new Error(`excuse must be 1-140 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("excuse must contain more than whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("excuse must be a single line");
  }
  const roundTrip = Buffer.from(text, "utf8").toString("utf8");
  if (roundTrip !== text) {
    throw new Error("excuse must be valid UTF-8");
  }
}

const scored = LINES.map((line) => ({ line, points: weightedTotal(line.grades) }));
scored.sort((a, b) => b.points - a.points);
const champion = scored[0].line;

enforceRules(champion.text);

const dir = dirname(fileURLToPath(import.meta.url));
mkdirSync("/output", { recursive: true });
const payload = champion.text + "\n";
writeFileSync(join(dir, "entry.txt"), payload, "utf8");
writeFileSync("/output/entry.txt", payload, "utf8");

console.log(champion.text);
console.log(`character count: ${[...champion.text].length}`);
console.log(`winning score: ${scored[0].points}`);
