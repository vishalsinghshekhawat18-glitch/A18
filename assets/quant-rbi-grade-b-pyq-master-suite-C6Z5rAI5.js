const t="quant-rbi-grade-b-pyq-master-suite",e="quant_topic",r="quant",i="RBI Grade B Phase 1 Quant Memory-Based PYQ Masterclass (2020–2025)",n="Exhaustive 3-tier solved masterclass covering authentic RBI Grade B Phase 1 Quant questions: Missing NPA Recovery DI, Circular Track TSD, and Weighted Probability...",a=[{id:"blk-rbi-pyq-1",type:"paragraph",content:`### 📊 Question 1: Missing Arithmetic Caselet DI (Banking Asset Quality & Recovery)

**Problem (RBI Grade B Memory-Based):** A commercial bank has total Gross NPAs of ₹12,000 Crore across three sectors: Agriculture, MSME, and Corporate in the ratio (3:4:5). In Agriculture, the bank recovers (40%) of NPAs via Lok Adalats and DRTs, writes off (25%), and the remainder is restructured. In MSME, total recovered amount is (1.5) times the Agricultural recovery, while restructured amount is (20%) of MSME NPAs. In Corporate, the recovery through NCLT under IBC 2016 is (₹1,800	ext{ Crore}). What is the ratio of Total Restructured NPAs across Agriculture and MSME combined to Total Corporate NPAs?


**3-Tier Solution:**

* **Tier 1 (First Principles):**
  1. Ratio (3:4:5 implies 3x + 4x + 5x = 12x = 12,000	ext{ Cr} implies x = 1,000	ext{ Cr}).
  2. **Agriculture:** Total (= ₹3,000	ext{ Cr}). Recovery (= 40% = ₹1,200	ext{ Cr}); Write-off (= 25% = ₹750	ext{ Cr}); Restructured (= 3,000 - (1,200 + 750) = ₹1,050	ext{ Cr}).
  3. **MSME:** Total (= ₹4,000	ext{ Cr}). Recovery (= 1.5 	imes 1,200 = ₹1,800	ext{ Cr}); Restructured (= 20% 	imes 4,000 = ₹800	ext{ Cr}).
  4. **Corporate:** Total (= ₹5,000	ext{ Cr}).
  5. Combined Agri + MSME Restructured (= 1,050 + 800 = ₹1,850	ext{ Cr}).
  6. Ratio (= \frac{1,850}{5,000} = \frac{37}{100} = 37:100).
* **Tier 2 (Banking Mains Standard):** Set up a 3×3 matrix with columns [Recovery, Write-off, Restructured]. Fill row 1: (3,000 	imes [0.40, 0.25, 0.35] implies 	ext{Restructured} = 1,050). Fill row 2: (4,000 	imes [-, -, 0.20] implies 	ext{Restructured} = 800). Desired ratio (= \frac{1,050 + 800}{5,000} = \frac{1,850}{5,000} = \frac{37}{100}).
* **Tier 3 (10-Second Elimination):** Check the numerator: Agri restructured is (35% 	imes 30 = 10.5) units; MSME is (20% 	imes 40 = 8) units. Total (= 18.5) units. Denominator is 50 units. (\frac{18.5}{50} = \frac{37}{100}). Option with numerator 37 is the immediate unique answer!`},{id:"blk-rbi-pyq-2",type:"paragraph",content:`### 🏃 Question 2: Circular Track Relative Speed & First Meeting Point

**Problem:** Two runners A and B start simultaneously from the same point on a circular track of length 1,200 meters. A runs clockwise at (15	ext{ m/s}) and B runs counter-clockwise at (25	ext{ m/s}). After how many seconds will they meet for the **first time**, and how many distinct meeting points exist on the track?


**3-Tier Solution:**

* **Tier 1 (First Principles):** Running in opposite directions (implies) Relative Speed (= 15 + 25 = 40	ext{ m/s}). Time to 1st meeting (T_1 = \frac{	ext{Track Length}}{	ext{Relative Speed}} = \frac{1,200}{40} = 30	ext{ seconds}).
* **Tier 2 (Distinct Meeting Points Formula):** Ratio of speeds in simplest integer terms: (\frac{S_A}{S_B} = \frac{15}{25} = \frac{3}{5}) ((a = 3, b = 5), where (gcd(a, b) = 1)).
  • When running in **Opposite Directions**, the number of distinct meeting points is (a + b = 3 + 5 = 8	ext{ points}).
  • *(If they were running in the **Same Direction**, distinct meeting points would be (|a - b| = |3 - 5| = 2	ext{ points}))*.
* **Tier 3 (Mental Rule):** 1st meeting = (\frac{1,200}{40} = 30	ext{ s}); Distinct points = (3 + 5 = 8).`},{id:"blk-rbi-pyq-trap",type:"exam_trap",content:`🎯 Exam Angle → ⚡ Circular Track Invariants in RBI Grade B:
1. **First Meeting at Starting Point:** Time taken to meet at the *starting point* for the first time is (	ext{LCM}left(\frac{L}{S_A}, \frac{L}{S_B}\right) = 	ext{LCM}left(\frac{1,200}{15}, \frac{1,200}{25}\right) = 	ext{LCM}(80, 48) = 240	ext{ seconds}).
2. Don’t confuse: *First meeting anywhere on track* (30s) vs *First meeting at starting point* (240s) vs *Number of distinct meeting points* (8 points)!`}],s={exam:["RBI Grade B Phase 1 2026","SBI PO Mains 2026","IBPS PO Mains 2026"],tags:["quant","rbi-grade-b","pyq","data-interpretation","tsd"],category:"Quant",sectionCode:"QUANT",difficulty:"advanced",relevanceTier:"TIER_A",noteTier:"TIER_A",date:"2026-08-20",period:"2026-Q4",provenance:{sourceSystem:"DF-EIC",sourceFile:"Phase 2 Quant Suite",sourceTitle:"RBI Grade B Quant PYQs"},noteNumber:546},o=[],c={id:t,type:e,domain:r,title:i,summary:n,blocks:a,metadata:s,relationships:o};export{a as blocks,c as default,r as domain,t as id,s as metadata,o as relationships,n as summary,i as title,e as type};
