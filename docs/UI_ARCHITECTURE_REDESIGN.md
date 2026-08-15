# Banking Command Center — UI/UX Architecture Redesign Specification

**Status**: PROPOSED ARCHITECTURE FOR HUMAN APPROVAL (Read-Only Review Phase)  
**Date**: August 15, 2026  
**Repository**: `vishalsinghshekhawat18-glitch/A18.git`  
**Target Corpus**: 926 Total Legacy Items (Currently 50 Migrated Items Loaded)  
**Deliverable**: `docs/UI_ARCHITECTURE_REDESIGN.md`

---

## A. Root-Cause Analysis of Current UI Failure

### 1. The "Single-Template Ebook" Fallacy
The current UI (`ReaderView.tsx` + `theme-kindle.css`) treats every single `KnowledgeItem` as if it were a 30-page long-form textbook chapter. It enforces:
- Fixed viewport container height (`height: 100vh`, `flex: 1`)
- Heavy top/bottom padding (`2.5rem 1.5rem`)
- Large article title header (`font-size: 2.2rem`, `margin-bottom: 2.5rem`)
- Single vertical column clamped to `68ch` max-width

### 2. Failure Mode on Short Content (Current Affairs & Schemes)
When a 4-block Current Affairs note (`migrated-ca-note-sec1-1.json`) or a 1-block Scheme entry (`migrated-schemes-scheme-1.json`) is loaded:
- The article header (`2.2rem` title + summary + metadata badges) occupies the top 200px.
- The 4 short semantic blocks occupy ~300px in the middle.
- The remaining 60% of the screen (500px+) becomes a **giant, empty, wasted void of blank paper space**, followed by a single isolated relationship chip at the bottom.
- To a human reviewer, the presentation appears broken: **a brief news note fills a huge empty page and then abruptly ends.**

### 3. Missing Reading Stream / Contextual Continuity
Short news notes, schemes, and static GA entries are not meant to be read in isolation on empty 100vh pages. They require **dense, multi-item briefing stream views, compact card layouts, or side-by-side context panels** that match their natural information density.

---

## B. Content-Type Taxonomy

The 926-item legacy corpus contains **6 fundamentally different content types**, each requiring a tailored reading layout while sharing the exact same underlying design tokens:

| Content Type | Primary Legacy Sources | Typical Block Count | Primary Study Objective | Proposed Layout Mode |
| :--- | :--- | :--- | :--- | :--- |
| **1. Core Chapters** | `index.html` (`rawBookData`) | 18–30 blocks | Long-form conceptual learning | `BookChapterLayout` |
| **2. Current Affairs** | `ca_app/data.js` (`CA_NOTES_DATA`) | 4–6 blocks | Rapid daily/monthly revision & scanning | `NewsBriefingLayout` |
| **3. Government Schemes** | `ca_app/updated_schemes_data.js` | 1–3 blocks | Quick statutory reference & eligibility lookup | `SchemeReferenceLayout` |
| **4. Static GA** | `ca_app/static_ga_data.js` | 1–2 blocks | Fact lookup & apex body statistics | `StaticGAReferenceLayout` |
| **5. Quant Topics** | `ca_app/quant_data.js` | 2–8 blocks | Formula reference & step-by-step methods | `QuantStudioLayout` |
| **6. PYQs** | `ca_app/quant_data.js` (qsec8-*) | 1–3 blocks | Question-first memory testing | `PYQPracticeLayout` |

---

## C. Proposed Presentation Model for Each Content Type

### Mode 1: `BookChapterLayout` (Core Chapters)
- **Target**: Long-form Core subjects (Economics, Polity, History, Geography, Science, Revision).
- **Layout**:
  - Classic Kindle long-form reading container (`max-width: 68ch`).
  - Chapter metadata header with subject badge, title, and summary.
  - Sticky right-margin Table of Contents (`InPageTOC`) on desktop.
  - Generous line-height (1.7) and structured H1/H2/H3 section dividers.

### Mode 2: `NewsBriefingLayout` (Current Affairs)
- **Target**: Current Affairs notes (`note-sec1-1` to `note-sec1-5`).
- **Layout**:
  - **Zero Artificial Height**: Container height fits content exactly without 100vh force-padding.
  - **Header Bar**: Compact date pill (`📅 Aug 1, 2026`), Tier badge (`Tier A`), category badge (`SEC1`).
  - **Headline**: High-density bold title (`1.4rem`).
  - **Hook / Context Box**: Subtle warm accent summary card (`.briefing-hook`).
  - **Side-by-Side Context Grid**:
    - Left Column: Core Key Takeaway bullets (`.block-list`).
    - Right Column: Static Background & GK link box (`.block-key-concept`) + Exam Trap warning callout (`.block-exam-trap`).
  - **Stream Navigation**: Quick "Next Briefing →" inline footer control allowing continuous reading without returning to the sidebar.

### Mode 3: `SchemeReferenceLayout` (Government Schemes)
- **Target**: Government Schemes (`scheme-1` to `scheme-5`).
- **Layout**:
  - **Structured Reference Card**:
    - Top Banner: Scheme name, Nodal Ministry badge (e.g. `MoF / DFS`), launching year, target outlay (`₹13,000 crore`).
    - Key Metrics Grid: Overdraft limit, age eligibility, premium rates in 2-column key-value cards.
    - Full Details List: Clean bulleted statutory guidelines.

### Mode 4: `StaticGAReferenceLayout` (Static GA Subsections)
- **Target**: Static GA apex bodies & policy subsections (`ch1-sub1` to `ch4-sub1`).
- **Layout**:
  - **Reference Sheet Layout**:
    - Apex Body Header & Regulatory Domain.
    - Multi-column structured data tables (`.table-custom`).
    - Highlighted stat callout cards for base year revisions & rate trajectories.

### Mode 5: `QuantStudioLayout` (Quant Topics & Formulas)
- **Target**: Quant topics (`qsec1-1` to `qsec2-2`).
- **Layout**:
  - **Formula Studio**:
    - Formula Sheet Header with topic title.
    - Centered LaTeX KaTeX formula blocks (`.block-formula`).
    - **100% Explicit Worked Examples**: Question box, Given parameters, Step-by-step working steps, and Kindle Warm-Paper Answer Box (`.worked-example-answer-kindle`). Zero accordions or click-to-reveal controls.

### Mode 6: `PYQPracticeLayout` (Previous Year Questions)
- **Target**: RBI / IBPS / SBI Memory PYQs (`qsec8-2`).
- **Layout**:
  - **Question-First Study Card**:
    - Exam badge (`RBI Grade B 2024 / SBI PO`).
    - Prominent Question Box (`.pyq-question-box`).
    - Step-by-Step Method & Permanent Solution Box.
    - Concept linkage chip mapping back to Core Economics / Quant topic.

---

## D. Shared Design-System Rules

Every content layout mode MUST adhere strictly to ONE unified design system:

```css
/* Design System Tokens */
:root {
  /* Paper & Charcoal Palette */
  --bg-reading-paper: #fbf9f5;
  --bg-sidebar: #f2eee5;
  --bg-card: #ffffff;
  --bg-accent-subtle: #f5eedf;
  --bg-warning-subtle: #fff6e5;

  --text-primary: #222222;
  --text-secondary: #555555;
  --text-muted: #777777;
  --text-accent: #6b5b45;
  --text-warning: #8a4b00;

  --border-subtle: #e5dec9;
  --border-strong: #c2b69d;
  --border-warning: #e09f3e;

  /* Typography Stack */
  --font-reading: "Georgia", "Cambria", "Times New Roman", Times, serif;
  --font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: SFMono-Regular, Consolas, monospace;

  /* Natural Height Rule: ZERO artificial min-height or 100vh force-padding */
  --content-max-width-chapter: 68ch;
  --content-max-width-briefing: 900px;
}
```

### Core Constraints
1. **Natural Height**: Content height is determined strictly by content length. Zero `min-height: 100vh` on reader containers.
2. **Monochrome Warm Paper**: Zero high-contrast saturated green or neon accents.
3. **Typography**: Georgia serif for reading body, System sans for UI controls.
4. **Permanent Visibility**: All study notes, worked examples, and PYQs are 100% visible without accordions.

---

## E. Desktop Layout Architecture

```text
+--------------------------------------------------------------------------------------------------+
| HEADER BAR: [ ☰ Menu ] Banking Command Center | Mode: Auto | 🔍 Search (Ctrl+K) | Font: [A-] 18px [A+]|
+------------------------------+-------------------------------------------------------------------+
| SIDEBAR (300px fixed)        | MAIN READING PANE (Flexible natural height)                       |
|                              |                                                                   |
| ▾ 📚 CORE ALL-SUBJECTS       | [ Category Badge ]                                                |
|   ▸ Economics (25)           | ARTICLE TITLE / HEADLINE                                          |
|   ▸ Polity (1)               | Metadata Row: [ 🎓 Exam ] [ #Tag ] [ 📅 Date ]                   |
|   ▸ History (1)              | ---------------------------------------------------------------   |
|   ▸ Geography (1)            |                                                 +----------------+|
|   ▸ Science (1)              | CONTENT AREA (Tailored Layout Mode):            | IN THIS CH.    ||
|   ▸ Revision (1)             | - Core Chapter: Long-form text                  | 📍 Heading 1   ||
| ▾ 📰 CURRENT AFFAIRS (5)     | - CA Briefing: Dense 2-column cards             | 📍 Heading 2   ||
| ▾ 🏛️ GOVT SCHEMES (5)        | - Scheme Entry: Structured Key-Value Grid       | 📐 Example 1   ||
| ▾ 📌 STATIC GA (5)           | - Quant Studio: Formula & Worked Example Studio | 💡 Concept 1   ||
| ▾ 📐 QUANT & PYQS (5)        | - PYQ Practice: Question-first card             +----------------+|
|                              |                                                                   |
| [ Search / Filter input ]    | [ Related Topics & Stream Controls: ← Prev | Next → ]             |
+------------------------------+-------------------------------------------------------------------+
```

---

## F. Mobile Layout Architecture

On screens `<768px`:
- **Header**: Compact top bar (`50px`) containing Hamburger menu (`☰`), active category pill, and Search icon (`🔍`).
- **Sidebar**: Off-screen slide-over overlay drawer (`width: 280px`, `left: -300px`) with semi-transparent backdrop overlay. Selecting an item closes the drawer automatically.
- **Reading Container**: Fluid `100%` width with `1rem` side padding. Zero horizontal scroll overflow.
- **Inline TOC**: Compact inline dropdown button ("📍 In This Chapter (4 sections) ▼") rendered below article summary.

```text
+------------------------------------------+
| ☰  Banking Command Center     🔍  Font A+ |
+------------------------------------------+
| [ Domain Badge ]                         |
| TITLE / HEADLINE                         |
| [ 📍 In This Chapter (4) ▼ ]             |
| ---------------------------------------- |
| DENSE CONTENT CARD / BRIEFING            |
| (Fits device height naturally)           |
|                                          |
| [ ← Prev Note | Next Note → ]            |
+------------------------------------------+
```

---

## G. Navigation Architecture (Scaling to 926 Items)

The navigation sidebar (`NavSidebar.tsx`) handles 50 items today and scales to 926 items seamlessly:

```text
NavSidebar
├── Header & Corpus Progress Indicator (50 / 926 Migrated)
├── Filter / Quick Search Input Box
└── Hierarchical Folder Tree:
    ├── Group 1: 📚 Core All-Subjects (186 Total)
    │   ├── Economics (50 chapters)
    │   ├── Polity (35 chapters)
    │   ├── History (40 chapters)
    │   ├── Geography (25 chapters)
    │   ├── Science (20 chapters)
    │   └── Revision (16 chapters)
    ├── Group 2: 📰 Current Affairs (505 Total)
    │   ├── Monthly Folders (e.g. August 2026, July 2026)
    │   └── Category Subfolders (Banking, Macro, Tax, Trade)
    ├── Group 3: 🏛️ Government Schemes (171 Total)
    │   └── Nodal Ministries (MoF, MSME, MoHUA, MoA)
    ├── Group 4: 📌 Static GA Superbook (38 Total)
    │   └── Apex Bodies & Policy Chapters
    └── Group 5: 📐 Quant & PYQs (26 Total)
        ├── Arithmetic & Geometry Topics
        └── SBI / IBPS / RBI Memory PYQs
```

---

## H. Search Architecture (`FlexSearchProvider`)

- Keyboard Shortcut: `Ctrl+K` / `Cmd+K` launches global search modal overlay.
- Search indexing: Indexes title, domain, summary, tags, and block contents across all migrated items.
- Result highlighting: Instant substring matches with domain badge, title snippet, and match context.
- Keyboard navigation: `Up` / `Down` arrow key selection, `Enter` to open, `Esc` to dismiss.

---

## I. Reader State Model

```typescript
export type LayoutMode = 'book_chapter' | 'news_briefing' | 'scheme_reference' | 'static_ga_reference' | 'quant_studio' | 'pyq_practice';

export interface ReaderState {
  activeItemId: string;
  activeItem: KnowledgeItem;
  layoutMode: LayoutMode; // Derived automatically from item.type & item.domain
  fontSize: number;
  isSidebarOpenMobile: boolean;
  isSearchModalOpen: boolean;
  searchQuery: string;
}
```

### LayoutMode Resolution Logic
```typescript
export function resolveLayoutMode(item: KnowledgeItem): LayoutMode {
  if (item.type === 'ca_note') return 'news_briefing';
  if (item.id.includes('scheme') || item.domain === 'schemes') return 'scheme_reference';
  if (item.domain === 'static-ga' || item.type === 'static_note') return 'static_ga_reference';
  if (item.domain === 'pyqs' || item.type === 'pyq_item' || item.id.includes('pyq')) return 'pyq_practice';
  if (item.domain === 'quant' || item.type === 'quant_topic') return 'quant_studio';
  return 'book_chapter'; // Default for Core long-form chapters
}
```

---

## J. Exact Component Architecture

```text
src/
├── app/
│   ├── App.tsx                        (Main state & layout mode orchestrator)
│   ├── navigation/
│   │   └── NavSidebar.tsx             (Hierarchical collapsible folder sidebar)
│   ├── reader/
│   │   ├── ReaderShell.tsx            (Multi-mode reading container dispatcher)
│   │   ├── ReadingControls.tsx        (Header controls bar + mobile hamburger)
│   │   ├── InPageTOC.tsx              (Desktop floating & mobile inline TOC)
│   │   └── modes/
│   │       ├── BookChapterView.tsx    (Mode 1: Long-form ebook chapter view)
│   │       ├── CABriefingView.tsx     (Mode 2: Dense news briefing card view)
│   │       ├── SchemeRefView.tsx      (Mode 3: Structured scheme reference view)
│   │       ├── StaticGARefView.tsx    (Mode 4: Static GA reference sheet view)
│   │       ├── QuantStudioView.tsx    (Mode 5: Formula & worked example studio)
│   │       └── PYQPracticeView.tsx    (Mode 6: Question-first practice view)
│   ├── search/
│   │   ├── SearchModal.tsx            (Ctrl+K modal search UI)
│   │   └── FlexSearchProvider.ts      (FlexSearch indexing engine)
│   └── styles/
│       ├── reset.css                  (CSS Reset)
│       └── theme-kindle.css           (Unified Kindle Paper Tokens & Mode Layouts)
```

---

## K. Before / After Conceptual Wireframes

### Before (Flawed Single-Template Ebook View for Short CA Note)

```text
+------------------------------------------------------------------------------------+
| 📖 Kindle Reading Mode                                      🔍 Search  Font [A-] 18px |
+------------------------------------------------------------------------------------+
|                                                                                    |
|  CURRENT-AFFAIRS                                                                   |
|  Gross GST Collections Surge 15.4% to ₹2.11 Trillion in July 2026                 |
|  GST collections serve as India's primary high-frequency indicator...              |
|  [ 🎓 RBI Grade B ] [ #sec1 ] [ 📅 2026-08-01 ]                                   |
|  -------------------------------------------------------------------------------   |
|                                                                                    |
|  * Growth was driven primarily by higher mop-up...                                 |
|  * Represents one of the highest monthly figures...                                |
|                                                                                    |
|  💡 Static Background & GK Context                                                 |
|     GST introduced July 1, 2017 via 101st CAA, 2016 (Article 279A).              |
|                                                                                    |
|  ⚠️ Exam Trap                                                                      |
|     Do not confuse Gross GST with Net GST collection.                              |
|                                                                                    |
|                                                                                    |
|  <--- GIANT 500px EMPTY VOID OF BLANK PAPER COVERING 60% OF SCREEN --->             |
|                                                                                    |
|                                                                                    |
|  -------------------------------------------------------------------------------   |
|  [ Related: CA Briefs ]                                                            |
+------------------------------------------------------------------------------------+
```

---

### After (New Tailored `NewsBriefingLayout` Mode for Current Affairs)

```text
+------------------------------------------------------------------------------------+
| ☰  Banking Command Center | Mode: CA Briefing               🔍 Search  Font [A-] 18px |
+------------------------------------------------------------------------------------+
|                                                                                    |
| +--------------------------------------------------------------------------------+ |
| | 📅 Aug 1, 2026  |  Tier A  |  SEC1 BANKING & TAX                               | |
| | Gross GST Collections Surge 15.4% to ₹2.11 Trillion in July 2026               | |
| |                                                                                | |
| | SUMMARY: GST collections serve as India's primary high-frequency indicator...  | |
| +--------------------------------------------------------------------------------+ |
|                                                                                    |
| +-----------------------------------------+ +------------------------------------+ |
| | 📌 CORE KEY TAKEAWAYS                   | | 💡 STATIC GK & EXAM TRAP LINKAGE   | |
| | • Growth driven by domestic mop-up &    | | • GST introduced July 1, 2017 via  | |
| |   goods import.                         | |   101st CAA, 2016 (Article 279A).| |
| | • Highest monthly gross collection.     | | ---------------------------------- | |
| | • Tax buoyancy index remains strong.    | | ⚠️ EXAM TRAP: Do not confuse Gross | |
| |                                         | |    GST with Net GST post-refunds.  | |
| +-----------------------------------------+ +------------------------------------+ |
|                                                                                    |
| [ ← Prev Note: NCGTC Norms | Stream Navigation | Next Note: Ethanol Subsidy → ]   |
+------------------------------------------------------------------------------------+
```

---

## L. Existing Components to Retain

1. **`BlockRenderer.tsx`**: Core semantic block dispatcher (handles `heading`, `paragraph`, `bullet_list`, `table`, `formula`, `worked_example`, `exam_trap`, `key_concept`, `timeline`, `quote`).
2. **`FormulaBlockRenderer.tsx`**: KaTeX math expression renderer.
3. **`WorkedExampleBlockRenderer.tsx`**: 100% visible step-by-step worked example renderer.
4. **`FlexSearchProvider.ts`**: Substring indexing search engine.
5. **`SearchModal.tsx`**: Keyboard-navigable search dialog.
6. **Zod Schemas & TypeScript Definitions** (`schema/knowledge-item.ts`, `schema/knowledge-item.zod.ts`): Fully valid and preserved without breaking changes.

---

## M. Components to Replace / Refactor

1. **`app/reader/ReaderView.tsx`**: Replace monolithic single-template reader with `ReaderShell.tsx` dispatcher routing to the 6 specialized layout modes.
2. **`app/navigation/NavSidebar.tsx`**: Refactor from flat list to hierarchical folder tree supporting 926 items + mobile slide-over drawer handlers.
3. **`app/reader/ReadingControls.tsx`**: Refactor header bar to include active mode badge and mobile Hamburger toggle menu button (`☰`).
4. **`app/styles/theme-kindle.css`**: Refactor CSS rules to eliminate `height: 100vh` force-padding on short content containers and add layout rules for the 6 presentation modes.

---

## N. Schema / Rendering Changes Required

**ZERO breaking schema changes required.**
The existing `KnowledgeItem` data model already contains all required fields (`domain`, `type`, `summary`, `blocks`, `metadata`, `relationships`).
The redesign is 100% view-layer presentation architecture based on `resolveLayoutMode(item)`.

---

## O. Migration Safety Implications

- **Corpus Data Integrity**: **100% PRESERVED**. All 50 migrated JSON items in `content/corpus/` remain byte-for-byte identical.
- **Legacy Repository Protection**: **100% READ-ONLY**. `C:\Users\visha\OneDrive\Documents\aravalli hills` remains untouched.
- **Batch 003 Status**: **FROZEN**. Zero new content migrated.

---

## Summary Recommendation & Next Action

We recommend accepting this **UI/UX Architecture Redesign Specification** (`docs/UI_ARCHITECTURE_REDESIGN.md`). Upon your explicit authorization, we will implement the 6 specialized layout modes and responsive app shell in Repo C.
