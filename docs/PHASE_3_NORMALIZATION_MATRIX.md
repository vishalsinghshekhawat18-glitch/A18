# Phase 3 — Normalization Matrix (Core + CA → Repo C)

**Purpose**: Map all legacy concepts from Core and Current Affairs systems into normalized Repo C semantic blocks and schemas.

---

## 1. Concept Normalization Matrix

| Legacy Concept | Core System Representation | CA / GA / Quant Representation | Repo C Semantic Block / Field | Normalization Rule |
| :--- | :--- | :--- | :--- | :--- |
| **Headline Title** | `title` | `title` | `KnowledgeItem.title` | Direct string mapping. Trim leading numbers if redundant. |
| **Unique Identifier** | `id` (e.g. `eco-ch-1`) | `id` (e.g. `ca-001`) | `KnowledgeItem.id` | Machine-safe lower-case alphanumeric string with hyphens. |
| **Domain Category** | `subject` | `secId` / `category` | `KnowledgeItem.domain` | Map `economics` → `economics`, `polity` → `polity`, `banking` → `current-affairs`, `quant` → `quant`. |
| **First-Principles Summary** | `truth` | `hook` | `KnowledgeItem.summary` | Direct string mapping for article summary. |
| **Core Bullet Points** | Embedded HTML `<ul>`/`<li>` | `bullets: string[]` | `SemanticBlock: bullet_list` | Convert array of strings or `<li>` tags into `bullet_list`. |
| **Exam Trap / Misconception** | HTML `<div class="trap-box">` | `trap: string` | `SemanticBlock: exam_trap` | Extract title and trap details into structured `exam_trap` block. |
| **Structured Table / Grid** | HTML `<table>` or flex grid | `miniGrid: {headers, rows}` | `SemanticBlock: comparison` | Map 1:1 into `comparison` block preserving headers and rows. |
| **Static Background GK** | Embedded HTML paragraph | `staticGk: string` | `SemanticBlock: key_concept` / `paragraph` | Map static GK into `key_concept` block titled "Static Background & GK". |
| **Math Formula** | `\\( ... \\)` / `\\[ ... \\]` MathJax | `formula` string | `SemanticBlock: formula` | Extract LaTeX into `formula` block rendering via KaTeX. |
| **Worked Example** | Embedded HTML solution | `workedExample` object | `SemanticBlock: worked_example` | Map question, given, method, steps, and answer into 100% explicit `worked_example` block. |
| **Interview Question** | None | `interviewQ: string` | `SemanticBlock: exam_trap` / `key_concept` | Map interview questions into a dedicated callout block. |
| **Timelines & Events** | Embedded HTML timeline | Structured event array | `SemanticBlock: timeline` | Convert event dates, titles, and descriptions into `timeline` block. |
| **Macro Statistics** | Embedded HTML text | Metric string | `SemanticBlock: statistic` | Extract metric, value, unit, and date into structured `statistic` block. |
| **Relationships** | Inferred text references | Inferred category link | `KnowledgeItem.relationships` | Map explicit linkages (`updated_by`, `has_pyq`, `prerequisite`). |

---

## 2. Subject & Domain Classification Normalization

| Legacy Source Category | Legacy Subject ID | Repo C Target Domain | Target Item Type |
| :--- | :--- | :--- | :--- |
| **Core Economics** | `economics` | `economics` | `chapter` |
| **Core Polity** | `polity` | `polity` | `chapter` |
| **Core History** | `history` | `history` | `chapter` |
| **Core Geography** | `geography` | `geography` | `chapter` |
| **Core Science** | `science` | `science` | `chapter` |
| **Core Revision** | `revision` | `revision` | `chapter` |
| **Current Affairs Notes** | `secId` (polity, economy, banking, etc.) | `current-affairs` | `ca_note` |
| **Government Schemes** | `schemes` | `current-affairs` | `ca_note` |
| **Static GA Subsections** | `static_ga` | `static-ga` | `static_note` |
| **Quant Topics** | `quant` | `quant` | `quant_topic` |
| **PYQs** | `pyqs` | `pyqs` | `pyq_item` |

---

## 3. Block Vocabulary Mapping

All legacy HTML and JSON structures normalize into the **17 controlled semantic block types** of Repo C:

```text
Legacy HTML/JSON Elements                Repo C Semantic Block
-------------------------                ---------------------
<h2>, <h3>, <h4>                        heading
<p>, text node                           paragraph
<ul>, <li>                               bullet_list
<ol>, <li>                               numbered_list
<table>, miniGrid                        comparison / table
\(...\), \[...\], formula string         formula
workedExample object                     worked_example (100% EXPLICIT)
trap-box, trap string                    exam_trap
staticGk, key-box                        key_concept
definition text                          definition
timeline div, events array               timeline
metric / figure                          statistic
source footnote                          source_note
related link                             related_knowledge
<blockquote>                            quote
<img>                                    image
```
