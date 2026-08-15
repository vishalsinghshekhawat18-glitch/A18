# Banking Command Center — Content-Surface Architecture Specification

**Status**: PROPOSED ARCHITECTURE FOR HUMAN APPROVAL (Read-Only Specification Phase)  
**Date**: August 15, 2026  
**Repository**: `vishalsinghshekhawat18-glitch/A18.git`  
**Target Corpus**: 926 Total Legacy Items (Currently 50 Migrated Items Loaded)  
**Deliverable**: `docs/CONTENT_SURFACE_ARCHITECTURE.md`

---

## A. Core Architectural Principle: Content-Appropriate Surfaces

Repo C will function as **ONE unified Banking Command Center** offering **SIX content-appropriate reading surfaces**. 

We reject the fallacy of forcing every `KnowledgeItem` into a single page-oriented ebook template. While Kindle-inspired paper typography is ideal for long-form Core chapters, **Current Affairs, Schemes, Static GA, Quant, and PYQs require specialized reading surfaces** matching their natural information density and interaction model.

```text
========================================================================================================
UNIFIED DESIGN SYSTEM TOKENS (Warm Paper #fbf9f5, Charcoal #222222, Georgia Serif, System Sans)
========================================================================================================
   │                 │                  │                   │                  │                 │
   ▼                 ▼                  ▼                   ▼                  ▼                 ▼
[ Surface 1 ]   [ Surface 2 ]      [ Surface 3 ]       [ Surface 4 ]      [ Surface 5 ]     [ Surface 6 ]
 Core Chapters   Current Affairs    Govt Schemes        Static GA          Quant Studio      PYQ Practice
 (Book Reader)   (Briefing Feed)    (Reference Card)    (Ref Sheet)        (Studio Layout)   (Practice Card)
 Standalone      Continuous Stream  Categorized Stream  Categorized Stream Standalone        Standalone
 Page Reader     Vertical Feed      Card Feed           Table Feed         Problem Studio    Question Card
========================================================================================================
```

---

## B. Architectural Comparison

| Dimension | A. Current Repo C Architecture | B. Original Repo A CA Experience | C. Proposed Final Content-Surface Architecture |
| :--- | :--- | :--- | :--- |
| **Interaction Model** | Single-item page reader for all content types | Continuous vertical stream of cards | **Dual Surface Architecture**: Standalone reader for Core/Quant/PYQ; Continuous stream feeds for CA/Schemes/Static GA |
| **Current Affairs UX** | Isolated single-item pages with wasted whitespace | Dense vertical feed of 10–20 notes | **Continuous CA Briefing Feed** inspired by Repo A density, using Repo C semantic block cards |
| **Sidebar Click (CA)** | Swaps screen to an isolated short note | Filtered stream view | **Scroll-to-Target**: Loads the month/category feed and smooth-scrolls directly to the selected card |
| **Information Density** | Low for short notes (excessive padding) | Very High (compact cards, minimal whitespace) | **Maximized Scannable Density** tailored to each content surface |
| **Content Height** | Forced viewport/ebook page framing | Natural height determined strictly by content | **Strict Natural Content Height**: Zero 100vh force-padding |
| **Data Integrity** | Clean Zod schemas & SHA-256 provenance | Legacy unstructured arrays | **Preserves Repo C semantic architecture** while adopting Repo A's superior UX stream model |

---

## C. Wireframes for All Six Content Surfaces

### 1. Surface 1: `BookChapterSurface` (Core Long-Form Chapters)
- **Model**: Standalone long-form study reader.
- **Characteristics**: Centered `68ch` reading pane, Georgia serif typography, sticky right-margin Table of Contents (`InPageTOCDesktop`).

```text
+--------------------------------------------------------------------------------------------------+
| HEADER BAR: [ ☰ Menu ] Banking Command Center | Mode: Core Chapter | 🔍 Search (Ctrl+K)           |
+------------------------------+-------------------------------------------------------------------+
| SIDEBAR (300px)              | MAIN READING PANE (Centered 68ch max-width)                      |
|                              |                                                                   |
| ▾ 📚 CORE ALL-SUBJECTS       | [ ECONOMICS ]                                                     |
|   ├─ 1. What is Economics?   | CHAPTER 1: CENTRAL PROBLEMS OF AN ECONOMY                         |
|   ├─ 2. Scarcity & Choice    | Summary: Opportunity cost, production possibility frontier...     |
|   ├─ 3. Micro vs Macro       | ---------------------------------------------------------------   |
|                              |                                                 +----------------+|
|                              | Section 1: The Three Basic Economic Questions   | IN THIS CH.    ||
|                              | An economy must decide what to produce, how     | 📍 Section 1   ||
|                              | to produce, and for whom to produce...          | 📍 Section 2   ||
|                              |                                                 | 💡 Concept 1   ||
|                              | 💡 Key Concept: Production Possibility Curve    +----------------+|
|                              | Illustrates trade-offs between two goods...                       |
+------------------------------+-------------------------------------------------------------------+
```

---

### 2. Surface 2: `CAFeedSurface` (Current Affairs Continuous Briefing Feed)
- **Model**: **Continuous Vertical Feed Stream**.
- **Characteristics**: Multiple CA cards stacked vertically on the same page. Natural height compact cards, date/category metadata row, executive rationale box, side-by-side key takeaways & static GK / exam trap callouts, inline interview insights. Sidebar clicking a CA note smooth-scrolls directly to that card on the feed.

```text
+--------------------------------------------------------------------------------------------------+
| HEADER BAR: [ ☰ Menu ] Banking Command Center | Feed: August 2026 (5 Notes) | 🔍 Search (Ctrl+K)   |
+------------------------------+-------------------------------------------------------------------+
| SIDEBAR (300px)              | CONTINUOUS CURRENT AFFAIRS BRIEFING FEED (Natural Height Stream)  |
|                              |                                                                   |
| ▾ 📰 CURRENT AFFAIRS         | +---------------------------------------------------------------+ |
|   ├─ August 2026 (5)         | | CARD 1: Gross GST Collections Surge 15.4% to ₹2.11 Trillion  | |
|      • Gross GST Surge <---  | | 📅 Aug 1, 2026 | Tier A | SEC1 BANKING & TAXATION              | |
|      • NCGTC MFI Norms       | | RATIONALE: High-frequency indicator of indirect tax growth...  | |
|      • Ethanol Subsidy       | | +--------------------------------+ +-------------------------+ | |
|   ├─ July 2026               | | | • Domestic mop-up up 14%.      | | | 💡 Static GK: Art 279A | | |
|   ├─ June 2026               | | | • Import mop-up up 18%.        | | | ⚠️ Trap: Net vs Gross| | |
|                              | | +--------------------------------+ +-------------------------+ | |
|                              | +---------------------------------------------------------------+ |
|                              |                                                                   |
|                              | +---------------------------------------------------------------+ |
|                              | | CARD 2 (TARGET): NCGTC Tweaks MFI Credit Guarantee Norms      | |
|                              | | 📅 Aug 2, 2026 | Tier B | FINANCIAL INCLUSION                  | |
|                              | | RATIONALE: Expanded coverage for microfinance lenders...       | |
|                              | +---------------------------------------------------------------+ |
+------------------------------+-------------------------------------------------------------------+
```

---

### 3. Surface 3: `SchemeReferenceSurface` (Government Schemes Reference Grid)
- **Model**: Categorized Reference Card Feed / Grid.
- **Characteristics**: Nodal Ministry header, launching year, target outlay banner, 2-column key-value metrics grid (eligibility, overdraft limit, age limits), statutory guidelines list.

```text
+--------------------------------------------------------------------------------------------------+
| HEADER BAR: [ ☰ Menu ] Banking Command Center | Schemes: Ministry of Finance | 🔍 Search         |
+------------------------------+-------------------------------------------------------------------+
| SIDEBAR (300px)              | GOVERNMENT SCHEMES REFERENCE CARD                                 |
|                              |                                                                   |
| 🏛️ SCHEMES                   | 🏛️ ATAL PENSION YOJANA (APY)                                      |
|   ├─ Atal Pension Yojana     | Nodal Ministry: Ministry of Finance / DFS | Launch: 2015           |
|   ├─ PMSBY                   | Outlay: Central Pension Scheme | Target: Unorganized Sector       |
|   ├─ PMVVY                   | ---------------------------------------------------------------   |
|                              | KEY STATUTORY ELIGIBILITY GRID:                                   |
|                              | • Entry Age: 18 to 40 years     • Pension Range: ₹1,000 to ₹5,000  |
|                              | • Minimum Contribution: 20 yrs  • Nominee Benefit: 100% Corpus   |
|                              | ---------------------------------------------------------------   |
|                              | STATUTORY GUIDELINES & FEATURES:                                  |
|                              | • Guaranteed minimum pension by Govt of India.                    |
+------------------------------+-------------------------------------------------------------------+
```

---

### 4. Surface 4: `StaticGAReferenceSurface` (Static GA Reference Sheet)
- **Model**: Reference Sheet View.
- **Characteristics**: Apex Regulatory Body headers (RBI, SEBI, IRDAI), multi-column statutory tables, base year revision statistics.

```text
+--------------------------------------------------------------------------------------------------+
| HEADER BAR: [ ☰ Menu ] Banking Command Center | Static GA: Apex Bodies | 🔍 Search                |
+------------------------------+-------------------------------------------------------------------+
| SIDEBAR (300px)              | STATIC GA REFERENCE SHEET                                         |
|                              |                                                                   |
| 📌 STATIC GA                 | 📌 PART 1: REGULATORY & APEX BODIES IN INDIA                      |
|   ├─ Regulatory Bodies       | Apex Regulatory Authorities & Statutory Enactments                |
|   ├─ Deputy Governors        | ---------------------------------------------------------------   |
|   ├─ Welfare Schemes         | +--------------------+-------------------+----------------------+ |
|                              | | Regulatory Body    | Statutory Act     | Current Head / HQ    | |
|                              | +--------------------+-------------------+----------------------+ |
|                              | | Reserve Bank (RBI) | RBI Act, 1934     | Governor / Mumbai    | |
|                              | | SEBI               | SEBI Act, 1992    | Chairman / Mumbai    | |
|                              | +--------------------+-------------------+----------------------+ |
+------------------------------+-------------------------------------------------------------------+
```

---

### 5. Surface 5: `QuantStudioSurface` (Quant Formulas & Worked Studio)
- **Model**: Formula & Problem Studio.
- **Characteristics**: LaTeX KaTeX formula blocks, 100% visible worked examples with step-by-step working cards and Kindle warm-paper answer highlight (`#f5eedf`).

```text
+--------------------------------------------------------------------------------------------------+
| HEADER BAR: [ ☰ Menu ] Banking Command Center | Quant: Mensuration & Geometry | 🔍 Search        |
+------------------------------+-------------------------------------------------------------------+
| SIDEBAR (300px)              | QUANT & REASONING STUDIO                                          |
|                              |                                                                   |
| 📐 QUANT                     | 📐 1.1 2D SHAPE FORMULAS & WORKED METHODS                         |
|   ├─ 1.1 2D Geometry         |                                                                   |
|   ├─ 1.2 3D Geometry         | CORE FORMULAS:                                                    |
|   ├─ 2.1 Time & Work         | Area of Circle:  \( A = \pi r^2 \)   |  Perimeter: \( C = 2\pi r \) |
|                              | ---------------------------------------------------------------   |
|                              | 📐 WORKED EXAMPLE 1: CIRCLE & TRIANGLE COMBINATION                |
|                              | Question: Radius of circle is 14 cm. Find shaded area...         |
|                              | Method: Area(Circle) - Area(Equilateral Triangle)                 |
|                              | Step 1: Area(Circle) = (22/7) * 14 * 14 = 616 sq cm               |
|                              | +---------------------------------------------------------------+ |
|                              | | FINAL ANSWER: 616 - 84.87 = 531.13 sq cm                      | |
|                              | +---------------------------------------------------------------+ |
+------------------------------+-------------------------------------------------------------------+
```

---

### 6. Surface 6: `PYQPracticeSurface` (Question-First Practice Cards)
- **Model**: Question-First Practice Surface.
- **Characteristics**: Exam badge (`🎓 RBI GRADE B 2024 / SBI PO`), prominent question prompt box, solution strategy box, step-by-step working cards, Kindle warm-paper final answer box (`#f5eedf`).

```text
+--------------------------------------------------------------------------------------------------+
| HEADER BAR: [ ☰ Menu ] Banking Command Center | PYQs: Arithmetic | 🔍 Search                     |
+------------------------------+-------------------------------------------------------------------+
| SIDEBAR (300px)              | PREVIOUS YEAR QUESTION PRACTICE SURFACE                           |
|                              |                                                                   |
| 🎓 PYQs                      | 🎓 8.2 ARITHMETIC MEMORY PYQs [ RBI Grade B 2024 / SBI PO Mains ]  |
|   └─ 8.2 Arithmetic PYQs     | ---------------------------------------------------------------   |
|                              | +---------------------------------------------------------------+ |
|                              | | ❓ QUESTION PROMPT                                            | |
|                              | | Q1. A completes work in 20 days. B takes 2x% more days...     | |
|                              | +---------------------------------------------------------------+ |
|                              | 💡 STRATEGY: Express B & C in terms of x%, equate C = A + B       | |
|                              | 📝 STEP-BY-STEP WORKING:                                         | |
|                              | • Step 1: 1 + 2x% = 2 => x = 50. Efficiency ratio = 6:3:2       | |
|                              | +---------------------------------------------------------------+ |
|                              | | FINAL ANSWER: 120 Days                                        | |
|                              | +---------------------------------------------------------------+ |
+------------------------------+-------------------------------------------------------------------+
```

---

## D. Detailed Interaction & System Mechanics

### 1. Feed vs Standalone Display Model
- **Standalone Items** (`book_chapter`, `quant_studio`, `pyq_practice`): Rendered as dedicated, full-focus single documents.
- **Continuous Feed Items** (`news_briefing`, `scheme_reference`, `static_ga_reference`): Rendered as continuous vertical card streams grouped by Category / Month / Ministry.

### 2. Sidebar Navigation Selection Behavior
- **Selecting a Standalone Item** (e.g. `eco-ch-1`): Swaps reader view to the target standalone document.
- **Selecting a Feed Item** (e.g. `note-sec1-2` under `August 2026`):
  1. Ensures the `August 2026` CA Feed Surface is active.
  2. Smoothly scrolls vertically (`element.scrollIntoView({ behavior: 'smooth' })`) to `note-sec1-2` on the continuous feed.
  3. Briefly applies a warm subtle focus outline (`.card-target-highlight`) to confirm navigation destination.

### 3. Global Search Behavior (`Ctrl+K`)
- Selecting any search result:
  - Automatically loads the appropriate surface (Standalone or Feed).
  - Auto-expands the sidebar category tree to the item's location.
  - Scrolls directly to the item and highlights it cleanly.

### 4. URL & Deep-Linking Routing Scheme
- **Core Chapter Standalone**: `/#/core/economics/eco-ch-1`
- **Current Affairs Feed Stream**: `/#/ca/august-2026?item=migrated-ca-note-sec1-1`
- **Government Schemes Feed**: `/#/schemes/finance?item=migrated-schemes-scheme-1`
- **Quant Topic Standalone**: `/#/quant/geometry/qsec1-1`
- **PYQ Standalone**: `/#/pyqs/arithmetic/qsec8-2`

### 5. Mobile Behavior (< 768px)
- **Top Bar**: Compact header (`50px`) with Hamburger button (`☰`), active surface badge, and Search button (`🔍`).
- **Sidebar Drawer**: Smooth off-screen slide-over drawer overlay (`280px` width) with semi-transparent backdrop backdrop. Selecting an item closes the drawer automatically.
- **Continuous Feed Touch Experience**: Smooth touch-driven vertical scrolling through natural-height cards with `0px` horizontal page overflow.

### 6. Scalability to All 926 Items
- The navigation tree and feed surface use **Category Chunking & Windowing**:
  - Current Affairs (505 items) is chunked into Monthly Feed Streams (e.g. August 2026: 25 items per feed).
  - Government Schemes (171 items) is chunked by Nodal Ministry feeds.
  - Core Chapters (186 items) is chunked by Subject.
- This ensures maximum DOM performance, fast initial render (`<50ms`), and smooth scrolling across the entire 926-item corpus.

---

## E. Summary Recommendation & Next Action

We recommend accepting this **Content-Surface Architecture Specification** (`docs/CONTENT_SURFACE_ARCHITECTURE.md`). 

Upon your explicit authorization, we will refactor Repo C's presentation layer to support continuous feed streams for Current Affairs, Schemes, and Static GA while maintaining standalone readers for Core Chapters, Quant, and PYQs.

**Migration & Code Status**:
- **Batch 003**: FROZEN (0 content items migrated).
- **Legacy Repo A**: STRICTLY READ-ONLY (0 files touched).
- **UI Code**: UNMUTATED in this turn.
