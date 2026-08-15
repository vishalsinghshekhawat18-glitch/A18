# Phase 3 — Legacy Source Discovery Report

**Status**: Completed Forensic Audit  
**Date**: August 15, 2026  
**Audited Location**: `C:\Users\visha\OneDrive\Documents\aravalli hills`  
**Target Architecture**: Repo C (`vishalsinghshekhawat18-glitch/A18.git`)

---

## 1. Executive Summary

This report documents the forensic read-only discovery performed across **Legacy Source A (Core / All-Subjects)** and **Legacy Source B (Current Affairs, Static GA, Quant Superbook & Schemes)**.

Across both legacy systems, a total of **926 structured legacy items** were discovered, cataloged, and analyzed for schema structures, field frequencies, content patterns, and information-loss risks.

| Legacy System Module | Primary Source File | Item Count | Key Content Format |
| :--- | :--- | :--- | :--- |
| **Core Economics** | `index.html` (`rawBookData`) | 45 chapters | HTML Mindmaps, Truth Summaries, MathJax |
| **Core History** | `index.html` (`rawBookData`) | 57 chapters | HTML Mindmaps, Bold/Italic HTML, Timelines |
| **Core Polity** | `index.html` (`rawBookData`) | 55 chapters | HTML Mindmaps, Statutory Text |
| **Core Geography** | `index.html` (`rawBookData`) | 12 chapters | HTML Mindmaps, Spatial Diagrams |
| **Core Science** | `index.html` (`rawBookData`) | 12 chapters | HTML Mindmaps, Biology/Physics Formulas |
| **Core Revision** | `index.html` (`rawBookData`) | 5 chapters | Rapid Revision Traps & Mindmaps |
| **Current Affairs** | `ca_app/data.js` | 505 notes | JSON Objects, Bullets, Hooks, Traps, miniGrids |
| **Government Schemes** | `ca_app/updated_schemes_data.js` | 171 notes | JSON Scheme Objects |
| **Static GA** | `ca_app/static_ga_data.js` | 38 subsections (11 ch) | Structured Tables & Categorized Rows |
| **Quant Superbook** | `ca_app/quant_data.js` | 26 topics (8 ch) | Worked Examples, Formulas & Shortcuts |
| **TOTAL LEGACY CORPUS** | **926 Items** | | |

---

## 2. Legacy Source A — Core / All-Subjects Forensic Audit

### 2.1 Schema & Metadata Structure
All 186 Core chapters are stored inside `index.html` in a consolidated JavaScript array `rawBookData`. Every chapter item adheres strictly to the following 10 fields:

```typescript
interface LegacyCoreChapter {
  id: string;          // e.g. "eco-ch-1", "pol-ch-35", "hist-ch-1"
  chNum: number;       // Sequential chapter number within book
  subject: string;     // "economics" | "history" | "polity" | "geography" | "science" | "revision"
  subjectName: string; // e.g. "Economics & Social Issues"
  book: string;        // e.g. "Book I: Foundations of Economics & National Income"
  title: string;       // Chapter headline string
  readTime: string;    // e.g. "12 min read"
  examTags: string;    // Comma-separated tag string
  truth: string;       // First-principles summary string
  body: string;        // HTML string containing content & presentation markup
}
```

### 2.2 Subject Inventory Breakdown

```text
Subject Name                 Code          Chapter Count   Sample ID
---------------------------------------------------------------------
Indian History               history       57 chapters     hist-ch-1
Indian Polity & Governance   polity        55 chapters     pol-ch-1
Economics & Social Issues    economics     45 chapters     eco-ch-1
Physical & Indian Geography  geography     12 chapters     geo-ch-1
General Science              science       12 chapters     sci-ch-1
Rapid Revision               revision      5 chapters      rev-ch-1
---------------------------------------------------------------------
TOTAL CORE CORPUS                          186 chapters
```

### 2.3 Body Content Pattern Frequency & Analysis

Every chapter's `body` HTML was scanned for structural and visual patterns:

| Pattern / Element | Occurrences (Chapters) | Affected Subject Areas | Notes & Preservation Requirements |
| :--- | :--- | :--- | :--- |
| **HTML Mindmaps** (`div.mindmap-container`) | 186 (100.0%) | All Subjects | Core presentation pattern; needs conversion to structured section headings and key concept blocks. |
| **Inline Styling** (`style="..."`) | 186 (100.0%) | All Subjects | Presentational CSS coupling; must be stripped in favor of fixed design tokens. |
| **Bold/Italic Tags** (`<b>`, `<i>`, `<strong>`, `<em>`) | 137 (73.7%) | History, Polity, Economics | Semantic inline emphasis; preserve text highlighting. |
| **MathJax Notation** (`\(...\)`, `\[...\]`) | 14 (7.5%) | Economics, Science, Quant | Math formulas; map 1:1 to KaTeX `formula` blocks. |
| **HTML Tables** (`<table>`) | 0 (0.0%) | None | Tables in Core are rendered via custom flex CSS inside mindmap containers. |

---

## 3. Legacy Source B — Current Affairs & GA & Quant Forensic Audit

### 3.1 Current Affairs Schema & Field Frequencies (`ca_app/data.js`)
Audit of **505 CA notes**:

```typescript
interface LegacyCANote {
  id: string;          // 505 / 505 (100.0%) — Machine ID
  secId: string;       // 505 / 505 (100.0%) — Section Category ID
  title: string;       // 505 / 505 (100.0%) — Headline title
  date: string;        // 505 / 505 (100.0%) — ISO Date string
  hook: string;        // 505 / 505 (100.0%) — 1-sentence headline summary
  bullets: string[];   // 505 / 505 (100.0%) — Key takeaway bullet list
  staticGk: string;    // 505 / 505 (100.0%) — Static background context
  trap: string;        // 505 / 505 (100.0%) — Exam trap / warning
  interviewQ?: string; // 441 / 505 (87.3%)  — Interview question
  tier?: string;       // 441 / 505 (87.3%)  — Importance priority
  miniGrid?: {         // 123 / 505 (24.4%)  — Structured table grid
    headers: string[];
    rows: string[][];
  };
}
```

### 3.2 Top `miniGrid` Table Patterns
The 123 `miniGrid` tables fall into 5 distinct structural categories:
1. **Appointments & Officials** (50 notes): `[Appointee / Official | New Position & Organization | Key Context]`
2. **Metrics & Thresholds** (34 notes): `[Metric / Component | Threshold / Provision Detail]`
3. **Awards & Honors** (26 notes): `[Award Title | Recipient / Winner | Conferred By / Detail]`
4. **Events & Mandates** (10 notes): `[Date & Event | Official Theme / Mandate | Nodal Body]`
5. **Regulatory Buffers** (2 notes): `[Bank Category | Minimum Leverage Ratio Floor | Buffer]`

### 3.3 Static GA Schema (`ca_app/static_ga_data.js`)
- **11 Chapters**, **38 Subsections**.
- Structured as table grids (`subId`, `title`, `type`, `headers`, `rows`).

### 3.4 Quant Superbook Schema (`ca_app/quant_data.js`)
- **8 Chapters**, **26 Topics**.
- Topic fields: `subId`, `title`, `type`, `headers`, `rows`, `workedExamples`, `formulas`, `shortcuts`, `traps`.

---

## 4. Information-Loss Risks & Mitigation Rules

1. **Inline HTML Mindmaps in Core**:
   - *Risk*: Stripping `div.mindmap-container` could collapse section hierarchy.
   - *Mitigation*: Parse mindmap nodes into `heading` (level 2/3) and `key_concept` blocks.
2. **MathJax to KaTeX Translation**:
   - *Risk*: Inconsistent LaTeX delimiters (`\\(`, `\\)`, `\\$`).
   - *Mitigation*: Standardize all math expressions to clean KaTeX LaTeX strings.
3. **`miniGrid` Column Alignment**:
   - *Risk*: Dropping table column headers during JSON extraction.
   - *Mitigation*: Map `miniGrid` 1:1 to Repo C `comparison` semantic blocks with explicit headers and rows.
