# Banking Command Center (Repo C)

Unified long-term study platform for Banking, Regulatory, Core Subjects, Current Affairs, Static GA, Quant, and PYQs.

Designed according to **Banking Command Center Master Architecture Constitution v1.0**.

## Core Principles
- **Strict Content-Presentation Separation**: AI agents generate structured JSON knowledge items; application components own visual rendering.
- **Kindle-Style Reader**: High legibility, zero visual clutter, warm reading aesthetic, robust font fallback stack.
- **Controlled Block System**: Semantic vocabulary (`heading`, `paragraph`, `bullet_list`, `table`, `comparison`, `formula`, `worked_example`, `exam_trap`, `key_concept`, `timeline`, `statistic`, etc.).
- **Strict Validation**: Zod CLI validation (`npm run validate`) and migration fidelity reconciliation (`npm run validate:fidelity`).

## Getting Started
```bash
npm install
npm run dev
```

## CLI Scripts
- `npm run validate`: Validate structural JSON schemas and ID links using `tsx`.
- `npm run validate:fidelity`: Execute migration fidelity reconciliation audit using `tsx`.
- `npm run build`: Compile TypeScript and Vite production bundle.
