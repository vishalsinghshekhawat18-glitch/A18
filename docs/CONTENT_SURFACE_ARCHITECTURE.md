# Banking Command Center — Content-Surface Architecture Specification (Refined)

**Status**: REFINED ARCHITECTURE PROPOSAL FOR HUMAN APPROVAL (Read-Only Specification Phase)  
**Date**: August 15, 2026  
**Repository**: `vishalsinghshekhawat18-glitch/A18.git`  
**Target Corpus**: 926 Total Legacy Items (Currently 50 Migrated Items Loaded)  
**Deliverable**: `docs/CONTENT_SURFACE_ARCHITECTURE.md`

---

## 1. Core Architectural Principle: Content-Appropriate Surfaces

Repo C is **ONE unified Banking Command Center** offering **SIX content-appropriate reading surfaces**.

We reject the fallacy of forcing every `KnowledgeItem` into a single page-oriented ebook template. While Kindle-inspired paper typography is ideal for long-form Core chapters, **Current Affairs, Schemes, Static GA, Quant, and PYQs require specialized reading surfaces** matching their natural information density and interaction model.

```text
========================================================================================================
UNIFIED KINDLE DESIGN SYSTEM TOKENS (Warm Paper #fbf9f5, Charcoal #222222, Georgia Serif, System Sans)
========================================================================================================
   │                 │                  │                   │                  │                 │
   ▼                 ▼                  ▼                   ▼                  ▼                 ▼
[ Surface 1 ]   [ Surface 2 ]      [ Surface 3 ]       [ Surface 4 ]      [ Surface 5 ]     [ Surface 6 ]
 Core Chapters   Current Affairs    Govt Schemes        Static GA          Quant Studio      PYQ Practice
 (Book Reader)   (Briefing Feed)    (Reference Grid)    (Ref Sheet)        (Problem Studio)  (Practice Card)
 Standalone      Continuous Feed    Statutory Cards     Statutory Tables   Formula & Worked  Question-First
 Single Doc      Vertical Stream    Category Stream     Reference Sheet    Problem Studio    Practice Card
========================================================================================================
```

---

## 2. Architectural Comparison & Reference UX Model

| Dimension | A. Single-Template Ebook Fallacy | B. Original Repo A CA Reference | C. Refined Content-Surface Architecture |
| :--- | :--- | :--- | :--- |
| **Interaction Model** | Single-item page reader for all content types | Continuous vertical stream of cards | **Dual Surface Architecture**: Standalone reader for Core/Quant/PYQ; Continuous stream feeds for CA/Schemes/Static GA |
| **Current Affairs UX** | Isolated single-item pages with wasted whitespace | Dense vertical feed of 10–20 notes | **Continuous CA Briefing Feed**: Stacks multiple CA notes vertically on the same page by Month |
| **Sidebar Click (CA)** | Swaps screen to an isolated short note | Filtered stream view | **Scroll-to-Target**: Loads the month's feed, smooth-scrolls directly to the selected card, and applies a temporary focus highlight |
| **Information Density** | Low for short notes (excessive padding) | Very High (compact cards, minimal whitespace) | **High Scannable Density**: Compact badges, concise rationale, structured bullets, static GK, exam traps, interview insights |
| **Content Height** | Forced 100vh viewport padding | Natural height determined by content | **Strict Natural Content Height**: Zero `height: 100vh` or `min-height: 100vh` container force |
| **Data Integrity** | Clean Zod schemas & SHA-256 provenance | Legacy unstructured arrays | **Preserves Repo C semantic architecture** while adopting Repo A's superior UX stream model |

---

## 3. The 6 Content Surfaces Specification

### Surface 1: `BookChapterSurface` (Core Long-Form Chapters)
- **Display Model**: **Standalone Reader** (Core Economics, Polity, History, Geography, Science, Revision).
- **Design Language**: Kindle paper typography, centered `68ch` reading pane, H1/H2/H3 section dividers, outer right-margin sticky TOC (`InPageTOCDesktop`).

### Surface 2: `CAFeedSurface` (Current Affairs Continuous Briefing Feed)
- **Display Model**: **Continuous Vertical Feed Stream** (Reproducing Repo A UX principles).
- **Design Language**:
  - Multiple CA cards stacked vertically on the same page grouped by Month (e.g. `August 2026`).
  - **Natural Height Compact Cards**: Title, date/category metadata row, executive rationale summary, core key takeaways (`.block-list`), static GK link box (`.block-key-concept`), exam trap warning (`.block-exam-trap`), interview insights (`.block-quote`), and mini-grids.
  - **Sidebar Click Behavior**: Clicking a CA note in the sidebar loads the month's feed, smooth-scrolls directly to the card (`element.scrollIntoView()`), and applies a temporary focus highlight (`.card-target-highlight`).

### Surface 3: `SchemeReferenceSurface` (Government Schemes Reference Grid)
- **Display Model**: **Categorized Reference Grid**.
- **Design Language**: Optimized for quick lookup and statutory comparison. Nodal Ministry header, launching year, target outlay banner, 2-column key-value metrics grid (eligibility, overdraft limit, age limits), statutory guidelines list.

### Surface 4: `StaticGAReferenceSurface` (Static GA Reference Sheet)
- **Display Model**: **Categorized Reference Sheet**.
- **Design Language**: Optimized for tables, statutory facts, and regulatory bodies (RBI, SEBI, IRDAI). Multi-column statutory tables, base year revision statistics, executive appointments.

### Surface 5: `QuantStudioSurface` (Quant Formulas & Problem Studio)
- **Display Model**: **Standalone Problem Studio**.
- **Design Language**: Centered LaTeX KaTeX formula blocks (`.block-formula`), 100% permanently visible worked examples with step-by-step working cards and Kindle warm-paper answer box (`#f5eedf`).

### Surface 6: `PYQPracticeSurface` (Question-First Practice Cards)
- **Display Model**: **Standalone Practice Card**.
- **Design Language**: Exam badge (`🎓 RBI GRADE B 2024 / SBI PO`), prominent question prompt box (`.pyq-question-card`), strategy box, step-by-step working cards, Kindle warm-paper final answer box (`#f5eedf`).

---

## 4. Navigation & Interaction Mechanics

### 1. Sidebar Navigation Behavior by Surface Type
- **Standalone Surfaces** (Core / Quant / PYQ): Click replaces active standalone document.
- **Collection Surfaces** (Current Affairs / Schemes / Static GA): Click loads the collection feed, smooth-scrolls to the target card (`element.scrollIntoView({ behavior: 'smooth' })`), applies a temporary focus highlight (`.card-target-highlight`), and updates the URL.

### 2. Global Search Behavior (`Ctrl+K`)
- **Core / Quant / PYQ result**: Opens target standalone document.
- **CA / Scheme / Static GA result**: Opens relevant collection feed, smooth-scrolls to the target card, and applies a temporary focus highlight.

### 3. URL & Deep-Linking Routing Scheme
- **Core Chapter Standalone**: `/#/core/economics/eco-ch-1`
- **Current Affairs Feed Stream**: `/#/ca/august-2026?item=migrated-ca-note-sec1-1`
- **Government Schemes Feed**: `/#/schemes/finance?item=migrated-schemes-scheme-1`
- **Quant Topic Standalone**: `/#/quant/geometry/qsec1-1`
- **PYQ Standalone**: `/#/pyqs/arithmetic/qsec8-2`

### 4. Anti-Overdesign Philosophy
- No giant headers, decorative fluff, oversized badges, or excessive rounded shadows.
- Optimized for **Comprehension + Scanability + Revision + Retrieval + Information Density + Low Visual Fatigue**.

### 5. Mobile Responsiveness (< 768px)
- **Top Bar**: Compact header (`50px`) with Hamburger button (`☰`), active surface badge, and Search button (`🔍`).
- **Sidebar Drawer**: Smooth off-screen slide-over drawer overlay (`280px` width) with backdrop overlay.
- **Natural Vertical Swipe**: Dense vertical card flow on mobile with `0px` horizontal page overflow.

### 6. Scalability Strategy for 926 Items
- **Category & Month Segmentation**: Current Affairs (505 items) is segmented into Monthly Feed Streams (e.g. August 2026: ~25 items per stream).
- **DOM Efficiency**: Renders feed streams using clean collection chunking and selective loading so full 926 items are never mounted simultaneously.

---

## 5. Phased Implementation Roadmap (Pending Authorization)

Upon explicit human authorization, implementation will proceed sequentially surface-by-surface:

1. **PHASE A**: Current Affairs Continuous Briefing Feed (using real migrated CA notes from Batch 002).
2. **PHASE B**: Core Long-Form Reader (refining geometry & TOC).
3. **PHASE C**: Government Schemes Reference Grid.
4. **PHASE D**: Static GA Reference Sheet.
5. **PHASE E**: Quant Formula & Problem Studio.
6. **PHASE F**: PYQ Question-First Practice Cards.

Each phase will undergo mandatory automated validation (`npm run validate`, `npm run build`), mobile testing (375px & 414px), and visual human inspection before proceeding to the next.

---

## 6. Mandatory Constraints & Boundaries

- **Batch 003**: FROZEN (0 items migrated).
- **Legacy Repo A**: STRICTLY READ-ONLY (0 files modified).
- **Migrated Content**: 100% UNTOUCHED (0 JSON files modified).
- **UI Code**: UNMUTATED in this turn.
