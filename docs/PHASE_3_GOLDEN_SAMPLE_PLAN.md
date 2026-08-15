# Phase 3 — Golden Sample Selection Plan

**Purpose**: Define the selection criteria and representative items for the Phase 4 Golden Sample Pilot Migration.

---

## 1. Selection Strategy

The Golden Sample consists of **15 highly representative real-data items** selected from Legacy Source A (Core) and Legacy Source B (Current Affairs, Static GA, Quant & Schemes).

These items exercise every semantic block type, complex layout, math formula, worked example, table grid, exam trap, timeline, and relationship link present across the 926 legacy items.

---

## 2. Selected Golden Sample Items

### Core System Pilot Items (7 Items)

| Legacy ID | Subject | Chapter Title | Complex Features Included |
| :--- | :--- | :--- | :--- |
| `eco-ch-1` | Economics | *1. What is Economics? Scarcity, Choice & Opportunity Cost* | Foundational chapter, truth summary, mindmap container |
| `eco-ch-14` | Economics | *14. Money Supply, Monetary Policy Operations & RBI Stance* | MathJax formulas, statutory text, financial metrics |
| `pol-ch-35` | Polity | *35. Election Commission of India & Electoral Reforms* | Comparison of RPA 1950 vs 1951, constitutional traps |
| `hist-ch-20` | History | *20. Freedom Struggle & Indian National Congress Movements* | Long timeline events, detailed lists, historic quotes |
| `geo-ch-5` | Geography | *5. Geomorphic Processes, Weathering & Mass Movements* | Spatial classifications, dense bullet structures |
| `sci-ch-3` | Science | *3. Human Physiology, Circulatory System & Blood Components* | Biological formulas, medical metrics, complex tables |
| `rev-ch-1` | Revision | *1. Rapid Revision — Ancient & Medieval History Traps* | Trap-heavy callouts, rapid revision summaries |

### Current Affairs & GA & Quant Pilot Items (8 Items)

| Legacy ID / Sec | Domain | Note / Topic Title | Complex Features Included |
| :--- | :--- | :--- | :--- |
| `ca-012` | Current Affairs | *RBI Monetary Policy Committee Review August 2026* | Repo rates (`6.50%`), inflation metrics, dates |
| `ca-045` | Current Affairs | *National Appointments & Cabinet Reorganization 2026* | `miniGrid` appointment table (50 occurrences pattern) |
| `ca-102` | Current Affairs | *Union Budget Macro Provisions & Fiscal Deficit Targets* | Metric statistics (`₹12.5 Lakh Cr`), traps |
| `scheme-015` | Schemes | *Pradhan Mantri Jan Dhan Yojana (PMJDY) 10-Year Progress* | Financial inclusion metrics, scheme eligibility |
| `static-ch-1-1` | Static GA | *Regulatory & Financial Institutions Overview* | Structured Static GA subsection table |
| `quant-ch-1-1` | Quant | *2D Shape Formulas & Mensuration Applications* | Math formulas, shortcuts, unit conversions |
| `quant-ch-2-2` | Quant | *Time, Work & Alternate Day Efficiency Problems* | Worked example with step-by-step calculations |
| `pyq-rbi-2024` | PYQs | *RBI Grade B 2024 Phase 2 Question on FIT Framework* | Model answer structure, relationship links |

---

## 3. Golden Sample Acceptance Criteria

For the Golden Sample Pilot to pass Phase 4 & Phase 5 acceptance:

1. **100% Extraction Rate**: All 15 selected items must extract and normalize without error.
2. **Zero Hard Failure Triggers**: All 15 items pass Level 1–5 CLI audit checks.
3. **Visual Reader Acceptance**: All 15 items render in the Kindle reader view with zero collapsed solution boxes, zero layout overflow, and crisp typography.
4. **Fidelity Verification**: 100% preservation of math expressions, rupee values (`₹`), percentages (`%`), dates, and statutory sections.
