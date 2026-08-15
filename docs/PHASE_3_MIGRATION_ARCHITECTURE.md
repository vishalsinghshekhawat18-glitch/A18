# Phase 3 — End-to-End Migration Pipeline Architecture

**Purpose**: Define the proposed deterministic migration architecture, data pipeline stages, validation gates, and human review routing for Repo C.

---

## 1. Migration Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LEGACY EXTRACTION STAGE (READ-ONLY)                      │
│ - Parse index.html rawBookData (186 Core chapters)          │
│ - Parse ca_app/data.js (505 CA notes)                       │
│ - Parse static_ga_data.js (38 GA subsections)               │
│ - Parse quant_data.js (26 Quant topics)                     │
│ - Parse updated_schemes_data.js (171 Scheme notes)          │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. NORMALIZATION & SEMANTIC PARSING STAGE                   │
│ - Map HTML tags & JSON fields to 17 Controlled Block types  │
│ - Strip inline presentation styles & mindmap markup         │
│ - Convert MathJax to KaTeX LaTeX strings                    │
│ - Construct explicit KnowledgeItem schemas                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. CLI VALIDATION GATE STAGE                                │
│ - Level 1: Inventory Audit (Counts match, 0 dups, 0 missing)│
│ - Level 2: Metadata Audit (ID, title, domain, date)         │
│ - Level 3: Structural Audit (Headings, tables, formulas)    │
│ - Level 4: Text Loss Audit (Length ratio >= 0.85)           │
│ - Level 5: Symbol Audit (₹, %, dates, MathJax/KaTeX)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
        [PASS ALL 5]                   [WARN / AMBIGUOUS]
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│ 4A. AUTOMATIC COMMIT STAGE  │ │ 4B. HUMAN REVIEW ROUTER     │
│ - Write KnowledgeItem JSON  │ │ - Flag item in audit report │
│ - Update search index       │ │ - Require manual approval   │
└─────────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Pipeline Design Principles

1. **Deterministic First**: Use deterministic Regex/AST HTML parsers and typed JSON transformers. AI/LLM assistance is invoked ONLY for complex unstructured HTML mindmap node extraction.
2. **Zero Modification to Source**: Extraction operates on in-memory read streams from legacy files. Legacy files are never altered or overwritten.
3. **Reversible & Idempotent**: The migration pipeline can be re-run at any time. Target Knowledge Items in Repo C are written to predictable JSON paths (`content/core/polity/pol-ch-35.json`).
4. **Independent Validation**: Zod schema validation and migration fidelity audits run automatically as CLI gates (`npm run validate`, `npm run validate:fidelity`).

---

## 3. Proposed Folder Layout for Migrated Data in Repo C

Once real migration is authorized in later phases, content will be organized as follows:

```
banking-command-center/
└── content/
    ├── core/
    │   ├── economics/     # 45 chapters
    │   ├── history/       # 57 chapters
    │   ├── polity/        # 55 chapters
    │   ├── geography/     # 12 chapters
    │   ├── science/       # 12 chapters
    │   └── revision/      # 5 chapters
    ├── current-affairs/   # 505 CA notes
    ├── static-ga/         # 38 GA notes
    ├── quant/             # 26 Quant topics
    └── schemes/           # 171 Scheme notes
```

---

## 4. Phase Transition Roadmap

- **Phase 3 (Current)**: Legacy Source Discovery & Migration Architecture **[COMPLETE & FROZEN]**
- **Phase 4 (Next)**: Golden Sample Pilot Migration (15 real-data items)
- **Phase 5**: Pilot Audit & Visual Review against Legacy Systems
- **Phase 6**: Controlled Full Corpus Migration (926 items)
- **Phase 7**: Final Regression Audit & Production Freeze
