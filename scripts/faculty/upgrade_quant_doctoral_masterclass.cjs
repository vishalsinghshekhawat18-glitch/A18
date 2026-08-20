const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');
const registryPath = path.join(__dirname, '..', '..', 'content', 'note-registry.json');

console.log('📐 Deploying Council 2 (Doctoral Faculty in Applied Mathematics & Quantitative Reasoning)...\n');

const QUANT_MASTERCLASSES = {
  // -------------------------------------------------------------
  // QSEC 1: MENSURATION (2D, 3D, FRUSTUM, SCALING)
  // -------------------------------------------------------------
  'migrated-quant-qsec1-1': {
    title: '2D Geometry & Mensuration Masterclass (Plane Figures & Inscribed Systems)',
    summary: 'Comprehensive 2D geometry masterclass covering perimeter, area, inradius, circumradius, concentric paths, and maximum area theorems with 3-tier solutions...',
    blocks: [
      {
        id: 'blk-qsec1-1-theory',
        type: 'paragraph',
        content: '### 📐 Fundamental 2D Geometric Invariants & Optimization Principles\n\n1. **Isoperimetric Optimization Theorem:** For any fixed perimeter \(P\), the plane figure with the **maximum enclosed area is always a Circle**. Among regular polygons with fixed perimeter, area strictly increases as the number of sides \(n \to \infty\). Among 4-sided figures of fixed perimeter, a **Square maximizes area**.\n2. **Inradius (\(r\)) & Circumradius (\(R\)) Invariants:**\n   • **Right-Angled Triangle (\(a, b, c\)):** Inradius \(r = \frac{a + b - c}{2}\); Circumradius \(R = \frac{c}{2}\) (midpoint of hypotenuse).\n   • **Equilateral Triangle (side \(a\)):** Inradius \(r = \frac{a}{2\sqrt{3}}\); Circumradius \(R = \frac{a}{\sqrt{3}}\); Ratio \(\frac{R}{r} = 2:1\); Area Ratio \(\frac{\text{Circumcircle}}{\text{Incircle}} = 4:1\).\n   • **General Triangle (\(\Delta, s\)):** Inradius \(r = \frac{\Delta}{s}\) where \(s = \frac{a+b+c}{2}\); Circumradius \(R = \frac{abc}{4\Delta}\).'
      },
      {
        id: 'blk-qsec1-1-table',
        type: 'table',
        headers: ['Plane Figure', 'Area Formula', 'Perimeter / Diagonal', 'Special Geometric Invariants'],
        rows: [
          ['Square (side a)', 'a² = ½ d²', 'P = 4a | Diagonal d = a√2', 'Inradius = a/2 | Circumradius = a/√2'],
          ['Rectangle (l, b)', 'l × b', 'P = 2(l + b) | d = √(l² + b²)', 'Area of internal pathway of width w = 2w(l + b − 2w)'],
          ['Equilateral Triangle (a)', '(√3 / 4) a²', 'P = 3a | Height h = (√3 / 2) a', 'Height h = 3r = 1.5R | Area = h² / √3'],
          ['Scalene Triangle (a, b, c)', '√[s(s-a)(s-b)(s-c)]', 's = (a + b + c) / 2', 'Heron’s Formula; Area = ½ a b sin(C)'],
          ['Rhombus (diagonals d₁, d₂)', '½ × d₁ × d₂', 'P = 4a | Side a = ½ √(d₁² + d₂²)', 'Diagonals bisect at 90°; Area = a × height'],
          ['Trapezium (parallel a, b; height h)', '½ (a + b) × h', 'Sum of all 4 sides', 'Median = ½(a + b); Line joining diagonal midpoints = ½|a − b|'],
          ['Circle & Sector (radius r, angle θ)', 'Area = π r² | Sector = (θ/360) π r²', 'Circumference = 2π r | Arc = (θ/360) 2π r', 'Area of ring between concentric circles R, r = π(R² − r²)']
        ]
      },
      {
        id: 'blk-qsec1-1-tier3',
        type: 'paragraph',
        content: '### ⚡ 3-Tier Exam Problem Breakdown: Inscribed Circle in Right Triangle\n\n**Problem:** A right-angled triangle has perpendicular sides of length 15 cm and 20 cm. Find the radius and area of the inscribed circle.\n\n* **Tier 1 (First Principles):** Hypotenuse \(c = \sqrt{15^2 + 20^2} = 25\text{ cm}\). Semi-perimeter \(s = \frac{15 + 20 + 25}{2} = 30\text{ cm}\). Area of triangle \(\Delta = \frac{1}{2} \times 15 \times 20 = 150\text{ cm}^2\). Inradius \(r = \frac{\Delta}{s} = \frac{150}{30} = 5\text{ cm}\).\n* **Tier 2 (Standard Banking PO Shortcut):** Directly apply the right-triangle inradius invariant: \(r = \frac{a + b - c}{2} = \frac{15 + 20 - 25}{2} = \frac{10}{2} = 5\text{ cm}\). Area \(= \pi r^2 = 25\pi\text{ cm}^2 \approx 78.57\text{ cm}^2\).\n* **Tier 3 (10-Second Mental Elimination):** Recognize the fundamental 3-4-5 Pythagorean triple scaled by factor 5. For a 3-4-5 base triple, inradius \(r_0 = \frac{3+4-5}{2} = 1\). Therefore, scaled inradius \(= 1 \times 5 = 5\text{ cm}\) instantly.'
      },
      {
        id: 'blk-qsec1-1-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ Classic Mensuration Traps:\n1. **Pathway Area Direction:** Internal pathway subtracts \(2w\) from dimensions (\(2w(l+b-2w)\)), while External pathway adds \(2w\) (\(2w(l+b+2w)\)).\n2. **Crossroad Pathway Area:** Center crossroad area \(= w(l + b - w)\) — don’t forget to subtract the central overlapping square \(w^2\) once!'
      }
    ]
  },

  'migrated-quant-qsec1-2': {
    title: '3D Solid Mensuration & Surface Topology (Cylinder, Cone, Sphere, Prism)',
    summary: 'Exhaustive 3D solid geometry reference covering Curved Surface Area, Total Surface Area, Volume, melting and recasting invariants, and maximum cube in sphere...',
    blocks: [
      {
        id: 'blk-qsec1-2-theory',
        type: 'paragraph',
        content: '### 📦 3D Solid Mensuration Principles & Conservation of Volume\n\n1. **Melting & Recasting Invariant:** When one or more solid bodies are melted and recast into new shapes, the **Total Volume remains strictly invariant** (\(\sum V_{\text{initial}} = \sum V_{\text{final}}\)), provided no material is lost. However, the **Total Surface Area (TSA) ALWAYS changes**.\n2. **Cutting Invariant:** When a solid is cut along a plane, Volume remains unchanged, but **Total Surface Area strictly increases** by twice the cross-sectional cut area (\(\Delta \text{TSA} = 2 \times A_{\text{cut}}\)).\n3. **Largest Inscribed Cube Theorems:**\n   • Inscribed in a Sphere of radius \(R\): Cube diagonal \(a\sqrt{3} = 2R \implies a = \frac{2R}{\sqrt{3}}\).\n   • Inscribed in a Right Circular Cone (base \(R\), height \(H\)): Cube side \(x = \frac{R \cdot H \cdot \sqrt{2}}{R\sqrt{2} + H}\).'
      },
      {
        id: 'blk-qsec1-2-table',
        type: 'table',
        headers: ['3D Solid', 'Curved / Lateral Surface Area', 'Total Surface Area (TSA)', 'Volume (V)'],
        rows: [
          ['Cube (side a)', 'LSA = 4a²', 'TSA = 6a²', 'V = a³ | Body Diagonal = a√3'],
          ['Cuboid (l, b, h)', 'LSA = 2h(l + b) [Area of 4 walls]', 'TSA = 2(lb + bh + hl)', 'V = l × b × h | Diagonal = √(l² + b² + h²)'],
          ['Right Circular Cylinder (r, h)', 'CSA = 2π r h', 'TSA = 2π r (h + r)', 'V = π r² h'],
          ['Hollow Cylinder (R, r, h)', 'CSA = 2π h (R + r)', 'TSA = 2π h(R + r) + 2π(R² − r²)', 'V = π h (R² − r²)'],
          ['Right Circular Cone (r, h, l)', 'CSA = π r l [Slant height l = √(r² + h²)]', 'TSA = π r (l + r)', 'V = ⅓ π r² h'],
          ['Sphere (radius r)', 'CSA = 4π r²', 'TSA = 4π r²', 'V = ⁴⁄₃ π r³'],
          ['Hemisphere (radius r)', 'CSA = 2π r²', 'TSA = 3π r² [Solid]', 'V = ⅔ π r³']
        ]
      },
      {
        id: 'blk-qsec1-2-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ High-Frequency Examiner Traps:\n1. **Hemisphere TSA Trap:** Hollow hemisphere without lid \(\text{TSA} = 2\pi r^2\); Solid hemisphere \(\text{TSA} = 3\pi r^2\); Sphere cut into 2 halves increases total surface area by \(50\%\) (\(4\pi r^2 \to 6\pi r^2\)).\n2. **Longest Rod in a Room:** The longest pole that can be placed in a room is always along the 3D space diagonal: \(d = \sqrt{l^2 + b^2 + h^2}\).'
      }
    ]
  },

  'migrated-quant-qsec2-1': {
    title: 'Arithmetic Mastery: Time & Work, Pipes, TSD, Boats, Alligation & Interest',
    summary: 'Comprehensive arithmetic formulation guide covering Unitary LCM work models, relative speeds, circular tracks, compound interest shifts, and replacement formulas...',
    blocks: [
      {
        id: 'blk-qsec2-1-theory',
        type: 'paragraph',
        content: '### ⚡ Core Arithmetic Invariants & Ratio Frameworks\n\n1. **Work Invariant (LCM Method):** Total Work \(W = \text{Efficiency } (E) \times \text{Time } (T)\). Assume Total Work = \(\text{LCM}(t_1, t_2, \dots, t_n)\). Efficiency is inversely proportional to time (\(E \propto \frac{1}{T}\)).\n2. **Chain Rule Formulation:** \(\frac{M_1 \times D_1 \times H_1 \times E_1}{W_1} = \frac{M_2 \times D_2 \times H_2 \times E_2}{W_2}\).\n3. **Relative Speed Dynamics:**\n   • **Same Direction:** Relative Speed \(= |S_1 - S_2|\); Time to cross \(= \frac{L_1 + L_2}{S_1 - S_2}\).\n   • **Opposite Direction:** Relative Speed \(= S_1 + S_2\); Time to cross \(= \frac{L_1 + L_2}{S_1 + S_2}\).\n   • **Boats & Streams:** Downstream \(S_d = u + v\); Upstream \(S_u = u - v\); Speed of Boat \(u = \frac{S_d + S_u}{2}\); Stream Speed \(v = \frac{S_d - S_u}{2}\).\n4. **Compound Interest Differences (P, R%):**\n   • **For 2 Years:** \(\text{CI}_2 - \text{SI}_2 = P \left(\frac{R}{100}\right)^2\).\n   • **For 3 Years:** \(\text{CI}_3 - \text{SI}_3 = P \left(\frac{R}{100}\right)^2 \left(\frac{300 + R}{100}\right)\).\n5. **Successive Dilution & Replacement Rule:** If a vessel contains \(V\) litres of pure liquid and \(x\) litres are removed and replaced with water \(n\) times, the final quantity of pure liquid is \(Q_{\text{final}} = V \left(1 - \frac{x}{V}\right)^n\).'
      },
      {
        id: 'blk-qsec2-1-tier3',
        type: 'paragraph',
        content: '### 🚀 3-Tier Worked Problem: Alternate Working Days in Time & Work\n\n**Problem:** A can complete a task in 12 days, and B can complete it in 18 days. If they work on alternate days starting with A, in how many days will the work be completed?\n\n* **Tier 1 (Fraction Method):** A’s daily work = \(\frac{1}{12}\), B’s daily work = \(\frac{1}{18}\). In a 2-day cycle, work done = \(\frac{1}{12} + \frac{1}{18} = \frac{5}{36}\). In 7 cycles (14 days), work done = \(7 \times \frac{5}{36} = \frac{35}{36}\). Remaining work = \(\frac{1}{36}\). On day 15, A works: Time taken = \(\frac{1/36}{1/12} = \frac{1}{3}\) day. Total = \(14\frac{1}{3}\) days.\n* **Tier 2 (LCM Units Method):** Total Work = \(\text{LCM}(12, 18) = 36\text{ units}\). Efficiency: \(E_A = \frac{36}{12} = 3\text{ units/day}\); \(E_B = \frac{36}{18} = 2\text{ units/day}\). In 2 days = \(3 + 2 = 5\text{ units}\). Multiply by 7: In 14 days = \(35\text{ units}\). Remaining = \(1\text{ unit}\). On Day 15, A needs \(\frac{1}{3}\) day. Total = \(14\frac{1}{3}\) days.\n* **Tier 3 (Mental Inspection Shortcut):** Recognize that the average rate is 2.5 units/day. \(36 / 2.5 = 14.4\) days. Since A starts first, cycle ends on Day 14 at 35 units; last unit requires exactly \(\frac{1}{3}\) day. Result: \(14.33\) days.'
      },
      {
        id: 'blk-qsec2-1-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ Calculation Traps:\n1. **Average Speed Trap:** If a person travels from A to B at speed \(x\) and returns at speed \(y\), Average Speed is NOT \(\frac{x+y}{2}\). It is the harmonic mean: \(\text{Avg Speed} = \frac{2xy}{x+y}\).\n2. **Train Passing a Platform vs Man:** Passing a platform requires distance \(D = L_{\text{train}} + L_{\text{platform}}\); passing a pole or standing person requires distance \(D = L_{\text{train}}\).'
      }
    ]
  },

  'migrated-quant-qsec4-2': {
    title: 'Algebra & Quadratic Equations Masterclass (Sign Table & Root Comparisons)',
    summary: 'Masterclass on quadratic equation root determination, master sign table heuristics, discriminant analysis, and root comparison shortcuts for Bank PO Mains...',
    blocks: [
      {
        id: 'blk-qsec4-2-theory',
        type: 'paragraph',
        content: '### 🧮 Quadratic Root Determination & Master Sign Table\n\nFor a standard quadratic equation \(ax^2 + bx + c = 0\) with roots \(\alpha, \beta\):\n• Sum of roots: \(\alpha + \beta = -\frac{b}{a}\)\n• Product of roots: \(\alpha \cdot \beta = \frac{c}{a}\)\n• Discriminant \(D = b^2 - 4ac\): Real & distinct (\(D > 0\)), Real & equal (\(D = 0\)), Complex/imaginary (\(D < 0\)).'
      },
      {
        id: 'blk-qsec4-2-table',
        type: 'table',
        headers: ['Equation Signs (b, c)', 'Root Signs (α, β)', 'Mental Shortcut Rule', 'Direct Relation (x vs y)'],
        rows: [
          ['+ , + (e.g. x² + 7x + 12 = 0)', '− , − (Both Negative)', 'Both roots negative', 'If y has (− , +) roots (+, +), then x < y directly!'],
          ['− , + (e.g. x² − 7x + 12 = 0)', '+ , + (Both Positive)', 'Both roots positive', 'If y has (+ , +) roots (−, −), then x > y directly!'],
          ['+ , − (e.g. x² + x − 12 = 0)', '− , + (Larger is Negative)', 'Opposite signs; |Negative| > Positive', 'If both eqns have c < 0, answer is ALWAYS CND (No Relation)!'],
          ['− , − (e.g. x² − x − 12 = 0)', '+ , − (Larger is Positive)', 'Opposite signs; |Positive| > Negative', 'If both eqns have c < 0, answer is ALWAYS CND (No Relation)!']
        ]
      },
      {
        id: 'blk-qsec4-2-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ 5-Second Quadratic Elimination Rules:\n1. **The Double Negative Constant Rule:** If the constant term \(c\) is negative in BOTH equations (\(ax^2 + bx - c_1 = 0\) and \(py^2 + qy - c_2 = 0\)), the roots will always be \((-, +)\) and \((-, +)\). The relationship can NEVER be determined (\(x = y\) or CND). Solve 0 steps!\n2. **Coefficient Normalization:** Never forget to divide the factorized roots by the leading coefficient \(a\), or cross-multiply the roots by the other equation\'s leading coefficient before comparing!'
      }
    ]
  },

  'migrated-quant-qsec7-1': {
    title: 'Modern Mathematics: Permutations, Combinations & Probability Theory',
    summary: 'Rigorous theoretical framework covering Fundamental Counting Principles, circular arrangements, derangements, conditional probability, and Bayes Theorem...',
    blocks: [
      {
        id: 'blk-qsec7-1-theory',
        type: 'paragraph',
        content: '### 🎲 Combinatorics & Probability Invariants\n\n1. **Permutation vs Combination:**\n   • **Permutation (\(P\)):** Order matters. \({}^n P_r = \frac{n!}{(n-r)!}\).\n   • **Combination (\(C\)):** Selection only, order does not matter. \({}^n C_r = \frac{n!}{r!(n-r)!}\).\n   • Relationship: \({}^n P_r = r! \times {}^n C_r\); \({}^n C_r = {}^n C_{n-r}\).\n2. **Arrangement Invariants:**\n   • Linear arrangement of \(n\) distinct items = \(n!\).\n   • Linear arrangement with repetitions \((p, q, r)\) = \(\frac{n!}{p! \cdot q! \cdot r!}\).\n   • Circular arrangement of \(n\) distinct persons = \((n - 1)!\).\n   • Circular necklace/garland (clockwise = counterclockwise) = \(\frac{(n - 1)!}{2}\).\n3. **Probability Fundamentals:**\n   • \(P(E) = \frac{n(E)}{n(S)}\) where \(0 \le P(E) \le 1\).\n   • Addition Theorem: \(P(A \cup B) = P(A) + P(B) - P(A \cap B)\).\n   • Mutually Exclusive Events: \(P(A \cap B) = 0 \implies P(A \cup B) = P(A) + P(B)\).\n   • Independent Events: \(P(A \cap B) = P(A) \times P(B)\).\n   • At Least One Rule: \(P(\text{at least one}) = 1 - P(\text{none})\).'
      },
      {
        id: 'blk-qsec7-1-trap',
        type: 'exam_trap',
        content: '🎯 Exam Angle → ⚡ High-Yield Traps:\n1. **"Together" vs "Never Together":** To find items "never together", calculate \(\text{Total Arrangements} - \text{Arrangements where they are together}\) (Grouping Method).\n2. **Card Pack Proportions:** Standard 52-card deck = 4 suits of 13 cards each (2 Red: Hearts, Diamonds; 2 Black: Spades, Clubs). Face cards = 12 (4 Kings, 4 Queens, 4 Jacks). Aces are NOT face cards!'
      }
    ]
  }
};

let upgradedCount = 0;

for (const [id, masterData] of Object.entries(QUANT_MASTERCLASSES)) {
  const filePath = path.join(corpusDir, `${id}.json`);
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    existing.title = masterData.title;
    existing.summary = masterData.summary;
    existing.blocks = masterData.blocks;
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
    upgradedCount++;
    console.log(`✅ Upgraded ${id} to Doctoral Masterclass standard.`);
  }
}

console.log(`\n🎉 Successfully upgraded ${upgradedCount} Quant foundation files.`);
