# Phase 4 — Migration Decisions & Architectural Log

**Purpose**: Document all non-trivial transformation decisions made during the Phase 4 Golden Sample Pilot.

---

## 1. Documented Decisions

### Decision 1: Deterministic HTML Mindmap Parsing
- **Context**: Core chapters contain `div.mindmap-container` HTML structures encoding section hierarchy and key concepts.
- **Decision**: Used AST/DOM string regex transformation (`<h1..3>` → `heading`, `<p>` → `paragraph`, `mindmap-node` → `heading` + `paragraph`).
- **Rationale**: Preserves 100% of mindmap text content without requiring expensive or non-deterministic LLM rewriting.

### Decision 2: Fallback Summary Strategy for CA Notes
- **Context**: Certain legacy CA notes contained `null` or empty `hook` values.
- **Decision**: In `ca-extractor.ts`, if `hook` is `null` or empty whitespace, fallback cleanly to `raw.title`.
- **Rationale**: Guarantees Zod schema validation (`summary: z.string().min(1)`) while preserving exact headline meaning.

### Decision 3: SHA-256 Provenance Embedding
- **Context**: Need strict source-to-destination traceability for every migrated item.
- **Decision**: Generated SHA-256 digest of the raw source JSON object and stored it under `metadata.provenance` along with `sourceSystem`, `sourceFile`, `sourceId`, `sourceTitle`, and `migrationTimestamp`.
- **Rationale**: Enables cryptographic proof of source origin for any Repo C Knowledge Item.

### Decision 4: Pilot ID Namespace Tagging
- **Context**: Preventing ID collisions between synthetic demo data (`pol-ch-35`) and pilot migration data (`pol-ch-35`).
- **Decision**: Prefixed pilot Knowledge Item IDs with `pilot-` (e.g. `pilot-pol-ch-35`).
- **Rationale**: Ensures global ID uniqueness across all environment layers while preserving source ID traceability in provenance metadata.
