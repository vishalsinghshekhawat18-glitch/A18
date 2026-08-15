# Phase 3 — Migration Fidelity Specification & Audit Protocol

**Purpose**: Define the multi-level information fidelity verification model, failure policies, and human review criteria for Repo C content migration.

---

## 1. Six-Level Information Fidelity Verification Model

To ensure zero information loss during migration, every migrated item must pass six distinct audit levels:

```
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 1: INVENTORY FIDELITY (Item counts, no missing/dups)   │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 2: METADATA FIDELITY (IDs, titles, domains, dates)    │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 3: STRUCTURAL FIDELITY (Headings, lists, tables, etc) │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 4: TEXT/CONTENT FIDELITY (Substantial text loss audit)│
├─────────────────────────────────────────────────────────────┤
│ LEVEL 5: SPECIAL-CONTENT FIDELITY (Math, ₹, %, Unicode)     │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 6: VISUAL EQUIVALENCE (Targeted visual review)        │
└─────────────────────────────────────────────────────────────┘
```

### Level 1 — Inventory Fidelity
- **Requirement**: Total legacy items extracted must equal total items created in Repo C.
- **Metrics**: `Total Source Items = Total Migrated + Missing (0) + Duplicates (0) + Unmapped (0)`.

### Level 2 — Metadata Fidelity
- **Requirement**: Preserve all metadata attributes (`id`, `title`, `domain`, `date`, `tags`, `exam`, `summary`).
- **Audit**: Verify string equality for titles and dates, and array containment for tags and exam metadata.

### Level 3 — Structural Fidelity
- **Requirement**: Preserve structural components (headings, lists, tables, worked examples, traps, timelines).
- **Audit Note**: Block-count parity is recorded as **diagnostic information** because semantic normalization may combine or split legacy HTML nodes. However, key structural blocks (e.g. 1 table in legacy = at least 1 table in target) must be preserved.

### Level 4 — Text & Content Fidelity
- **Requirement**: Detect accidental omissions, truncated sentences, or missing bullet points.
- **Audit**: String length ratio check (`Target Text Length >= Source Text Length * 0.85`). Any ratio below 0.85 triggers a text loss warning/error.

### Level 5 — Special Content & Symbol Fidelity
- **Requirement**: Validate zero corruption of special characters and formatting:
  - Rupee values (`₹12,50,000`)
  - Percentages (`6.50%`, `9.00%`)
  - Math symbols (\(\sum\), \(\frac{a}{b}\), \(\sqrt{x}\))
  - Statutory section references (`Section 45ZB`, `RPA 1951`)
  - Dates (`2026-08-15`)

### Level 6 — Targeted Visual Equivalence
- **Requirement**: For complex multi-column comparison tables or dense worked examples, perform visual rendering verification in the Kindle reader shell.

---

## 2. Hard Migration Failure Policy

Migration MUST explicitly FAIL and halt pipeline execution if ANY of the following occur:

1. **ID Collision**: Duplicate target ID detected.
2. **Title Disappearance**: Target title is missing or empty.
3. **Table Structure Destruction**: Source contained a table/grid, but zero table/comparison blocks were emitted.
4. **Formula Destruction**: Source contained MathJax formula, but zero formula/worked example blocks were emitted.
5. **Text Truncation**: Target text length drops by > 15% compared to source text.
6. **Encoding Corruption**: Special symbols (`₹`, `%`, math operators) rendered as replacement characters (`?`, ``).
7. **Orphan Relationship Target**: Relationship points to a non-existent target ID.

---

## 3. Transformation Categorization & Human Review Framework

To streamline audit of 926 items without requiring manual inspection of simple notes:

```text
Transformation Type          Handling Strategy          Human Review Requirement
-------------------          -----------------          ------------------------
Standard CA Notes (382)      Deterministic Parsing      AUTOMATIC (Passed Level 1-5 CLI Audit)
Standard Core Notes (150)    Deterministic Parsing      AUTOMATIC + CLI Audit
CA Notes with miniGrid (123) Table Mapping              AUTOMATIC + Structural Audit
Quant Worked Examples (26)   Step-by-Step Mapping       HUMAN REVIEW REQUIRED (Sample Check)
Complex Core HTML (36)       Mindmap Extraction         HUMAN REVIEW REQUIRED (Visual Check)
Unresolved / Error (0)       Pipeline Halt              BLOCKED (Rule Addition Required)
```
