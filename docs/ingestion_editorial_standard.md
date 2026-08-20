# 🏛️ Senior Exam Editorial & Fact-Verification Council: Ingestion Standard

---

## 📌 Core Ingestion Law: "Zero Raw Ingestion"

Under no circumstances should notes from `Claude/` or any external compilation be ingested directly or mechanically as-is into `content/corpus/`.

Every incoming note must pass through the **Senior Exam Editorial & Fact-Verification Council** protocol before emission.

---

## 🏗️ 1. Sections 1 to 10: Deep Understanding & Pedagogical Rigor

### A. Complete-Sentence Discipline (Zero Fragments)
- Every bullet point must be a **self-contained, grammatically complete statement** with an active subject, verb, and defined regulatory/economic context.
- Never split sentences arbitrarily on semicolons or commas.
- Never leave dangling parentheticals (e.g. `(Tata Advanced...`) or hanging em-dashes.

### B. Bold Categorical Lead-Ins
- Every bullet point must open with a **bold categorical anchor** defining its dimension:
  - `**Statutory Mandate & Authority:**`
  - `**Outlay & Funding Architecture:**`
  - `**Eligibility Slabs & Thresholds:**`
  - `**Operational & Effective Timelines:**`
  - `**Prudential Governance & Capital Norms:**`
  - `**State Performance & Leaderboard:**`

### C. Verified Fact Discipline (Anti-Hallucination)
- Cross-verify every statutory section, committee name, constitutional article, and monetary figure against official RBI circulars, Gazette notifications, and PIB releases.
- Flag provisional figures vs. final numbers explicitly.

### D. Targeted "🎯 Exam Angle"
- Conclude every note with an isolated `🎯 Exam Angle` block highlighting:
  - Deliberate examiner traps (e.g. notification date vs. effective in-force date).
  - Confusion pairs (e.g. Hurun vs. Forbes billionaire counts, 14th vs 15th vs 16th Finance Commission).
  - High-probability MCQ numerical pairings.

---

## ⚡ 2. Section 11: Rapid Revision, Flowcharts & Mindmaps

Section 11 is dedicated to **ultra-fast last-mile revision**:
- High-frequency one-liner master tables.
- Cross-month matrix tables (e.g., Base-Year Matrix, What Changes on April 1).
- Mermaid / ASCII process flowcharts (e.g. IBC CIIRP vs. CIRP liquidation timelines).
- Mnemonic memory clusters.

---

## 🚀 3. Quality Verification Before Deployment

1. Run `node scripts/deep_line_by_line_audit.cjs` — zero unescaped tags, zero title pollution, zero broken bullets.
2. Rebuild the lightweight index: `npx tsx scripts/build-corpus-index.ts`.
3. Verify production build: `npm run build`.
4. Deploy to GitHub Pages: `node scripts/migration/deploy-gh-pages.cjs`.
