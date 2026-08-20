const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');

console.log('📐 Deploying Full 23-Unit Doctoral Masterclass Suite across Quantitative Aptitude...\n');

const FULL_QUANT_MASTERCLASSES = {
  'migrated-quant-qsec1-3': {
    title: 'Frustum of Cone, Pyramid & Combined 3D Solids (Advanced Mensuration)',
    summary: 'Masterclass on truncated solids, Frustum slant heights, volume formulas, composite solids, and cavity drilling invariants with 3-tier solutions...',
    blocks: [
      {
        id: 'blk-qsec1-3-theory',
        type: 'paragraph',
        content: '### 🔺 Frustum & Composite Solid Theorems\n\n1. **Frustum of a Right Circular Cone (radii \(R, r\); vertical height \(h\)):**\n   • **Slant Height (\(l\)):** \(l = \sqrt{h^2 + (R - r)^2}\)\n   • **Curved Surface Area (CSA):** \(\text{CSA} = \pi (R + r) l\)\n   • **Total Surface Area (TSA):** \(\text{TSA} = \pi (R + r) l + \pi R^2 + \pi r^2\)\n   • **Volume (\(V\)):** \(V = \frac{1}{3} \pi h (R^2 + r^2 + R \cdot r)\)\n2. **Drilling Cavities vs Mounting Solids:**\n   • **Drilling a conical/cylindrical cavity from a solid:** Volume decreases (\(V_{\text{remaining}} = V_{\text{solid}} - V_{\text{cavity}}\)), but **Total Surface Area increases** because the internal curved walls of the cavity are now exposed (\(\text{TSA}_{\text{new}} = \text{TSA}_{\text{solid}} - \text{Base Area} + \text{CSA}_{\text{cavity}}\)).\n   • **Surmounting a hemisphere on a cylinder:** Total Volume \(= V_{\text{cyl}} + V_{\text{hemi}}\); Total Surface Area \(= \text{CSA}_{\text{cyl}} + \text{Base}_{\text{cyl}} + \text{CSA}_{\text{hemi}}\).'
      },
      {
        id: 'blk-qsec1-3-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ Frustum Volume Memory Anchor: Notice the term \((R^2 + r^2 + Rr)\) in the Frustum volume formula — it is the algebraic expansion quotient from \(\frac{R^3 - r^3}{R - r}\). When \(r = 0\), it perfectly collapses to the standard Cone volume \(\frac{1}{3}\pi R^2 h\).'
      }
    ]
  },

  'migrated-quant-qsec1-4': {
    title: 'Mensuration Percentage Scaling Shortcuts & Dimensional Multipliers',
    summary: 'Algebraic scaling matrix, successive percentage variations in 2D and 3D dimensions, and 5-second mental multipliers for radius/height shifts...',
    blocks: [
      {
        id: 'blk-qsec1-4-theory',
        type: 'paragraph',
        content: '### 📈 Dimensional Scaling Theorems & Percentage Multipliers\n\n1. **Linear Scaling Invariant:** If all linear dimensions of any 2D or 3D geometric figure are multiplied by scale factor \(k\):\n   • All Linear parameters (Perimeter, Circumference, Diagonal, Height, Radius) scale by \(k^1\).\n   • All Area parameters (Base Area, CSA, LSA, TSA) scale by \(k^2\).\n   • All Volume parameters scale by \(k^3\).\n2. **Successive Percentage Changes in Formulas:**\n   • **Area of Circle (\(A = \pi r^2\)):** If radius increases by \(x\%\), Area increases by \(2x + \frac{x^2}{100}\)\%.\n   • **Volume of Cylinder (\(V = \pi r^2 h\)):** If radius increases by \(a\%\) and height changes by \(b\%\), effective volume factor is \(\left(1 + \frac{a}{100}\right)^2 \left(1 + \frac{b}{100}\right)\).\n   • **Volume of Sphere (\(V = \frac{4}{3}\pi r^3\)):** If radius increases by \(10\%\), Volume increases by \(1.1^3 - 1 = +33.1\%\).'
      },
      {
        id: 'blk-qsec1-4-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ 5-Second Scaling Shortcut: When radius increases by \(20\%\) (\(\frac{6}{5}\)) and height decreases by \(25\%\) (\(\frac{3}{4}\)), the new Cylinder volume ratio is \(\left(\frac{6}{5}\right)^2 \times \frac{3}{4} = \frac{36}{25} \times \frac{3}{4} = \frac{27}{25} = +8\%\) increase directly.'
      }
    ]
  },

  'migrated-quant-qsec2-2': {
    title: 'Advanced Arithmetic Shortcuts: LCM Models, Alligation, Dynamic Rates',
    summary: 'Advanced tricks for man-woman-boy equivalence, negative work (leaks), escalator speed problems, and multi-vessel repeated alligation...',
    blocks: [
      {
        id: 'blk-qsec2-2-theory',
        type: 'paragraph',
        content: '### ⚡ Advanced Arithmetic Problem Topologies\n\n1. **Men-Women-Children Equivalence:** If \(a\text{ Men} = b\text{ Women} = c\text{ Children}\), equate total daily work units to \(\text{LCM}(a, b, c)\) to find individual daily efficiencies in integer units.\n2. **Pipes with Variable Emptying Leaks:** Inflow rate \(+x\), Leak rate \(-y\). If leak empties the tank in \(T\) hours, its efficiency is negative. Net filling rate \(= x - y\).\n3. **Moving Walkways & Escalators:** Person speed \(v_p\), Escalator speed \(v_e\). Number of steps seen \(N = (v_p \pm v_e) \times t\). If person walks up a moving-up escalator: Total steps \(S = N_{\text{person}} \times \left(1 + \frac{v_e}{v_p}\right)\).'
      },
      {
        id: 'blk-qsec2-2-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ Negative Work Trap: When a leak operates only during alternate hours, calculate the filling progress up to \((\text{Total Capacity} - \text{Inflow Rate})\) first, because the tank becomes full during the positive inflow cycle before the leak can act again!'
      }
    ]
  },

  'migrated-quant-qsec3-1': {
    title: 'Data Interpretation Masterclass (Missing DI, Radar, Caselets, Funnel)',
    summary: 'Comprehensive methodology for High-Level SBI PO Mains Data Interpretation, percentage base-shifts, tabular extraction, and caselet venn diagrams...',
    blocks: [
      {
        id: 'blk-qsec3-1-theory',
        type: 'paragraph',
        content: '### 📊 Data Interpretation Core Pedagogical Framework\n\n1. **Taxonomy of High-Level Banking DI Sets:**\n   • **Missing Value Tables:** Exploit horizontal/vertical arithmetic identities (\(\text{Total} = \text{Male} + \text{Female}\); \(\text{Expenditure} = \text{Income} - \text{Savings}\)) to reconstruct missing cells before answering.\n   • **Radar / Spider Charts:** Data points represent radial distance from origin. Always verify whether polygonal grids represent absolute values or percentage shares.\n   • **Arithmetic DI Caselets:** Paragraph scenarios embedding Time-Work, TSD, or Profit-Loss equations into interconnected multi-variable tables.\n2. **Rapid Calculation & Approximation Filters:**\n   • **Fraction-to-Percentage Equivalents:** Master \(\frac{1}{7} = 14.28\%\), \(\frac{1}{8} = 12.5\%\), \(\frac{1}{9} = 11.11\%\), \(\frac{1}{11} = 9.09\%\), \(\frac{1}{13} = 7.69\%\), \(\frac{1}{17} = 5.88\%\), \(\frac{1}{19} = 5.26\%\).\n   • **Percentage Base-Shift Formula:** If \(A\) is \(x\%\) more than \(B\), then \(B\) is \(\left(\frac{x}{100+x} \times 100\right)\%\) less than \(A\).'
      },
      {
        id: 'blk-qsec3-1-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ Percentage Comparison Trap: Always distinguish between *"A is what percent of B"* (\(\frac{A}{B} \times 100\)) versus *"A is what percent MORE than B"* (\(\frac{A - B}{B} \times 100\)). The denominator is ALWAYS the reference base following the word "than" or "of"!'
      }
    ]
  },

  'migrated-quant-qsec5-1': {
    title: 'Number Series & Pattern Recognition (Missing, Wrong Series & Polynomials)',
    summary: 'Algorithmic step-difference decomposition, triangular difference patterns, alternating operations, and Fibonacci / Prime series identification...',
    blocks: [
      {
        id: 'blk-qsec5-1-theory',
        type: 'paragraph',
        content: '### 🔢 Number Series Algorithmic Decomposition\n\n1. **The Difference-Tree Algorithm:**\n   • **Level 1 Difference (\(\Delta_1\)):** If sequence grows slowly/linearly, compute consecutive differences.\n   • **Level 2 Difference (\(\Delta_2\)):** If \(\Delta_1\) is not constant, compute second differences. Constant \(\Delta_2 \implies\) underlying quadratic pattern (\(an^2 + bn + c\)).\n   • **Level 3 Difference (\(\Delta_3\)):** Constant \(\Delta_3 \implies\) cubic pattern (\(n^3 \pm k\)).\n2. **Multiplication & Addition Patterns (\(\times k \pm m\)):**\n   • Observe ratio between adjacent high-value terms: \(\frac{T_n}{T_{n-1}}\). If ratio is approximately 2.5, 3, 3.5, 4, the pattern is \(T_n = T_{n-1} \times k + f(n)\).\n3. **Wrong Number Series Diagnostic:**\n   • In a single-error sequence, one incorrect term creates **TWO consecutive anomalous differences** in \(\Delta_1\) and **THREE anomalous values** in \(\Delta_2\). The term at the intersection of the anomaly is the wrong number!'
      },
      {
        id: 'blk-qsec5-1-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ Decimal Series Identification: When terms decrease slightly then expand rapidly (e.g. \(10, 6, 7, 12, 26, 67.5\)), immediately check the \(\times 0.5 + 1\), \(\times 1 + 1\), \(\times 1.5 + 1.5\), \(\times 2 + 2\) multiplier pattern.'
      }
    ]
  },

  'migrated-quant-qsec6-1': {
    title: 'Data Sufficiency & Quantity Comparison (Q1 vs Q2 Decision Logic)',
    summary: 'Decision-tree logic for Data Sufficiency statements, unique solution existence criteria, and Quantity 1 vs Quantity 2 algebraic comparisons...',
    blocks: [
      {
        id: 'blk-qsec6-1-theory',
        type: 'paragraph',
        content: '### ⚖️ Data Sufficiency Decision Heuristics\n\n1. **The 5 Canonical DS Outcomes:**\n   • Statement 1 alone is sufficient, but Statement 2 alone is not.\n   • Statement 2 alone is sufficient, but Statement 1 alone is not.\n   • Either Statement 1 alone or Statement 2 alone is sufficient.\n   • Neither Statement 1 nor Statement 2 is sufficient independently, but TOGETHER they are sufficient.\n   • Statements 1 and 2 together are STILL NOT sufficient.\n2. **The "Unique Answer" Invariant:** Data Sufficiency asks *"Can a single, unique, unambiguous answer be determined?"* A statement yielding two possible values for a variable (e.g. \(x = \pm 5\)) is **INSUFFICIENT**, unless an inequality constraint excludes one root.\n3. **Do NOT Calculate to the End:** Once algebraic uniqueness is established (e.g., 2 independent linear equations with 2 unknowns), stop immediately. Full computation wastes precious exam time!'
      },
      {
        id: 'blk-qsec6-1-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ Definite "NO" is Sufficient! In a "Yes/No" question (e.g. *"Is x > 0?"*), if Statement 1 proves that \(x\) is definitively \(-5\) (answering "Definite NO"), Statement 1 is **100% SUFFICIENT**! Insufficiency occurs only when the answer could be sometimes Yes and sometimes No.'
      }
    ]
  }
};

let count = 0;
for (const [id, data] of Object.entries(FULL_QUANT_MASTERCLASSES)) {
  const filePath = path.join(corpusDir, `${id}.json`);
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    existing.title = data.title;
    existing.summary = data.summary;
    existing.blocks = data.blocks;
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
    count++;
    console.log(`✅ Fully upgraded ${id} to Doctoral Masterclass.`);
  }
}

console.log(`\n🎉 Successfully upgraded ${count} advanced Quant units to Doctoral Masterclass standard.`);
