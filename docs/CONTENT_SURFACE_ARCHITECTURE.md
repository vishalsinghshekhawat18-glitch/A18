# Banking Command Center — Content-Surface Architecture Specification (Refined v2.0)

**Status**: THREE-TIER NAVIGATION ARCHITECTURE SPECIFICATION FOR HUMAN APPROVAL (Read-Only)  
**Date**: August 15, 2026  
**Repository**: `vishalsinghshekhawat18-glitch/A18.git`  
**Target Corpus**: 926 Total Legacy Items (Currently 50 Migrated Items Loaded)  
**Deliverable**: `docs/CONTENT_SURFACE_ARCHITECTURE.md`

---

## 1. Three-Tier Navigation Layer Architecture

Repo C is structured as **ONE unified Banking Command Center** operating across a **Three-Tier Navigation Hierarchy**:

```text
========================================================================================================
LEVEL 1: COMMAND CENTER HOME DASHBOARD ("What do I want to study?")
Route: /
Orienting entry page featuring Continue Studying card and 10 Subject Tiles. (No 926-item tree dump).
========================================================================================================
                                                  │
                                                  ▼
========================================================================================================
LEVEL 2: SUBJECT HUB (e.g., Economics Hub, Current Affairs Hub, Schemes Hub)
Route: /core/economics, /current-affairs, /schemes, /static-ga, /quant, /pyqs
Chapter/Month-level navigation hub where users enter specific subject areas.
========================================================================================================
                                                  │
                                                  ▼
========================================================================================================
LEVEL 3: SIX CONTENT-APPROPRIATE READING SURFACES
Routes: /core/economics/eco-ch-1, /current-affairs/2026/august?item=id, /schemes/finance?item=id...
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

## 2. Command Center / Home Surface Architecture (`/`)

The root route (`/`) functions as a clean, orientation-focused **Subject Dashboard**.

### Design Principles:
- **No Cluttered Widgets**: Absolutely no 926-item lists, giant tree dumps, fake productivity statistics, or decorative card fluff.
- **Single Objective**: Answers one question immediately: **"WHAT DO I WANT TO STUDY?"**
- **V1 Layout**:
  - **Continue Studying Card**: Displays the last active knowledge item (e.g. *Economics — Inflation Mechanics*).
  - **Subject Grid (10 Tiles)**:
    - *Core*: Economics (25), Polity (1), History (1), Geography (1), Science (1), Revision (1).
    - *Briefings & References*: Current Affairs (5), Government Schemes (5), Static GA (5).
    - *Studio & Practice*: Quant (4), PYQs (1).
  - Simple metadata: Item counts and surface type badges.

---

## 3. Subject Hub Architecture (Level 2)

Clicking any Subject Tile from the Command Center navigates to that subject's dedicated **Subject Hub**.

### 1. Economics Subject Hub (`/core/economics`)
- Shows Core Economics chapter list (`01` through `25`).
- Shows Quick Revision section cards (National Income, Inflation, Monetary Policy).

### 2. Current Affairs Subject Hub (`/current-affairs`)
- Shows Year folders (`2026`).
- Shows Monthly Feed tiles: `August 2026` (27 notes), `July 2026`, `June 2026`.
- Clicking `August 2026` launches the **August 2026 Continuous CA Briefing Feed** (`CAFeedSurface`).

### 3. Schemes Subject Hub (`/schemes`)
- Shows Nodal Ministries (Finance, MSME, Agriculture) and statutory scheme collections.

### 4. Static GA / Quant / PYQ Hubs (`/static-ga`, `/quant`, `/pyqs`)
- Displays categorized topic hubs and problem sets.

---

## 4. Contextual Sidebar Architecture

The sidebar is **NO LONGER a permanent 926-item tree dump**. Its navigation depth matches the user's active context:

| User Navigation Depth | Contextual Sidebar Content |
| :--- | :--- |
| **Command Center Home** (`/`) | **Subjects Only**: Core (Eco, Pol, His, Geo, Sci, Rev), CA, Schemes, Static GA, Quant, PYQs |
| **Inside Subject Hub** (`/core/economics`) | **Subject Chapters Only**: Chapter 1 through 25 + Revision topics |
| **Inside CA Hub** (`/current-affairs`) | **Month Folders Only**: August 2026, July 2026, June 2026 |
| **Inside August CA Feed** (`/current-affairs/2026/august`) | **August Notes List**: Smooth-scrolls to target card upon click |

---

## 5. Route & Deep-Link Architecture

| Conceptual Route | Surface / Component | Behavior |
| :--- | :--- | :--- |
| `/` | `CommandCenterHome` | Root subject orientation dashboard |
| `/core/economics` | `SubjectHubView` | Economics Subject Hub chapter index |
| `/core/economics/eco-ch-1` | `BookChapterSurface` | Standalone Core Economics Chapter 1 |
| `/current-affairs` | `SubjectHubView` | Current Affairs Month & Category Index |
| `/current-affairs/2026/august` | `CAFeedSurface` | August 2026 Continuous Briefing Feed Stream |
| `/current-affairs/2026/august?item=id` | `CAFeedSurface` | August Feed with target card scrolled & highlighted |
| `/schemes` | `SubjectHubView` | Government Schemes Category Index |
| `/schemes/finance?item=id` | `SchemeReferenceSurface` | Scheme Reference Grid with target item scrolled |
| `/static-ga` | `SubjectHubView` | Static GA Apex Bodies & Section Index |
| `/quant` | `QuantStudioSurface` | Quant Formula & Worked Problem Studio |
| `/pyqs` | `PYQPracticeSurface` | Previous Year Question Practice Cards |

---

## 6. Navigation State Model

```typescript
export type NavigationDepth = 'command_center' | 'subject_hub' | 'content_surface';

export interface NavigationState {
  depth: NavigationDepth;
  currentSubject?: string;       // e.g. 'economics', 'current-affairs'
  currentCollection?: string;    // e.g. 'august-2026', 'finance'
  activeItemId?: string;         // e.g. 'migrated-core-eco-ch-1'
}
```

---

## 7. The 6 Content Surfaces Specification (Level 3)

### Surface 1: `BookChapterSurface` (Core Long-Form Chapters)
- **Display Model**: Standalone Reader (`68ch` line clamping, Georgia serif typography, H1/H2/H3 dividers, outer right-margin sticky TOC).

### Surface 2: `CAFeedSurface` (Current Affairs Continuous Briefing Feed)
- **Display Model**: Continuous Vertical Feed Stream (Reproducing Repo A UX principles).
- **UX Mechanics**: Stacks multiple CA notes vertically on the same page by Month. Compact natural-height cards, date/category metadata row, executive rationale box, side-by-side takeaways & static GK/traps, interview insights. Sidebar click smooth-scrolls directly to target card on feed.

### Surface 3: `SchemeReferenceSurface` (Government Schemes Reference Grid)
- **Display Model**: Categorized Reference Grid (Nodal ministry, outlay banner, 2-column statutory metrics grid, eligibility list).

### Surface 4: `StaticGAReferenceSurface` (Static GA Reference Sheet)
- **Display Model**: Categorized Reference Sheet (Regulatory bodies RBI/SEBI/IRDAI, statutory tables, apex stats).

### Surface 5: `QuantStudioSurface` (Quant Formulas & Problem Studio)
- **Display Model**: Standalone Problem Studio (LaTeX KaTeX formula blocks, 100% visible worked examples with step-by-step working cards and warm paper answer box).

### Surface 6: `PYQPracticeSurface` (Question-First Practice Cards)
- **Display Model**: Standalone Practice Card (Exam badges, prominent question prompt box, strategy box, step-by-step working cards, Kindle warm-paper answer box).

---

## 8. Global Search Behavior (`Ctrl+K`)

- **Core / Quant / PYQ result**: Opens target standalone document route.
- **CA / Scheme / Static GA result**: Opens relevant collection feed route, smooth-scrolls to the target card, and applies a temporary focus highlight (`.card-target-highlight`).

---

## 9. Anti-Overdesign Study-System Principles

- No giant headers, decorative fluff, oversized badges, or fake productivity metrics.
- Optimized strictly for: **Comprehension + Scanability + Revision + Retrieval + Information Density + Low Visual Fatigue**.

---

## 10. Phased Implementation Roadmap (Pending Authorization)

Upon explicit human authorization, implementation will proceed in strict order:

1. **PHASE 0**: Command Center + Subject Hub + Contextual Navigation Foundation.
2. **PHASE A**: Current Affairs Continuous Feed.
3. **PHASE B**: Core Long-Form Reader.
4. **PHASE C**: Government Schemes Reference Grid.
5. **PHASE D**: Static GA Reference Sheet.
6. **PHASE E**: Quant Studio.
7. **PHASE F**: PYQ Practice Cards.

Each phase will undergo mandatory automated validation (`npm run validate`, `npm run build`), mobile testing (375px & 414px), and visual human inspection before proceeding to the next.

---

## 11. Mandatory Constraints & Boundaries

- **Batch 003**: FROZEN (0 items migrated).
- **Legacy Repo A**: STRICTLY READ-ONLY (0 files modified).
- **Migrated Content**: 100% UNTOUCHED (0 JSON files modified).
- **UI Code**: UNMUTATED in this turn.
