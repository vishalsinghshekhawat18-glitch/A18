# Banking Command Center --- Repo C Master Architecture Constitution v1.0

Status: Approved Baseline
Purpose: Define the architecture of the new unified Banking Command Center before any legacy study data is migrated.

0. Non-Negotiable Principles
- Repo C is a completely new Git repository.
- Existing Core and Current Affairs systems remain protected production baselines.
- Content and presentation are completely separated.
- AI agents generate structured knowledge, not page-specific HTML/CSS.
- A presentation change must never require regeneration of study notes.
- A content update must never require manual HTML/CSS editing.
- No information is silently removed during migration.
- No unverified factual enrichment is introduced into migrated study content.
- Every migration is reversible and independently validated.
- The reader is optimized for sustained study and comprehension.

1. Controlled Block Vocabulary
- heading, paragraph, bullet_list, numbered_list, table, comparison, formula, worked_example, exam_trap, key_concept, definition, timeline, statistic, source_note, related_knowledge, quote, image.

2. Worked Examples
- Reading mode MUST ALWAYS display complete question, method, step-by-step working, and final answer. Zero collapsible/accordion toggles.

3. Validation & Fidelity
- Zod schema validation independent of browser via CLI scripts (`tsx`).
- Migration fidelity reconciliation engine inspecting information preservation, metadata preservation, formula/table preservation, ID mapping, and detecting omissions. Block count changes are treated as diagnostic information.
