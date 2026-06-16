#!/usr/bin/env node
/* Worktree-isolation guard (#25 — Cypher).  AGENTS.md requires Neo + The Oracle to work in SEPARATE
   git worktrees; nothing enforced it, so two agents in one dir risked clobbering each other / wrong-branch
   commits. This WARNS (never blocks): it echoes the branch you're about to commit to (so a wrong-branch
   commit is caught by eye) and flags any file that is ALSO modified in another worktree — the real
   shared-dir clobber signal. Legit parallel work on DIFFERENT files stays silent (low noise).

   Run at session start:  node tools/check-isolation.mjs
   Or automatically: wired as the pre-commit hook (.githooks/pre-commit + `git config core.hooksPath .githooks`).
   ALWAYS exits 0 — a guard must never block a commit. */
import { execSync } from "node:child_process";
const sh = (c, cwd) => { try { return execSync(c, { cwd, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { return ""; } };
const C = { cyan: "\x1b[36m", yellow: "\x1b[33m", reset: "\x1b[0m" };
const warn = s => process.stderr.write(s + "\n");
try {
  const top = sh("git rev-parse --show-toplevel");
  if (!top) process.exit(0);
  const branch = sh("git rev-parse --abbrev-ref HEAD") || "(detached)";
  const filesOf = s => new Set(s.split("\n").filter(Boolean).map(l => l.slice(3).replace(/^.*\s->\s/, "")));   // porcelain "XY name" (rename → after arrow)
  const mine = filesOf(sh("git status --porcelain", top));
  warn(`${C.cyan}[isolation] committing to branch '${branch}' · ${mine.size} file(s) changed in this worktree${C.reset}`);
  const others = sh("git worktree list --porcelain").split("\n").filter(l => l.startsWith("worktree ")).map(l => l.slice(9).trim());
  let flagged = false;
  for (const o of others) {
    if (!o || o === top) continue;
    const theirs = filesOf(sh("git status --porcelain", o));
    const overlap = [...mine].filter(f => theirs.has(f));
    if (overlap.length) {
      flagged = true;
      warn(`${C.yellow}⚠ [isolation] these files are ALSO modified in another worktree:\n   ${o}\n   ${overlap.join("\n   ")}\n   → possible clobber. AGENTS.md: Neo + The Oracle use SEPARATE worktrees on DIFFERENT files.${C.reset}`);
    }
  }
  if (others.length > 1 && !flagged) warn(`${C.cyan}[isolation] ${others.length} worktrees active, no overlapping files — isolation looks good.${C.reset}`);
} catch { /* a guard must never break tooling */ }
process.exit(0);
