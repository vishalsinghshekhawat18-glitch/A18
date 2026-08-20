const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');

console.log('📜 Deploying Council 5 (Doctoral Faculty in Constitutional Jurisprudence & Public Administration)...\n');

const POLITY_TRAPS = {
  // Articles & Majorities
  'amendment': '🎯 Exam Angle → 🔥 HIGH — Three Majority Types under Article 368: (1) Simple Majority (creation of new states, official language); (2) Special Majority (Fundamental Rights, DPSPs — >50% total membership + 2/3rd present & voting); (3) Special Majority + 50% State Ratification (Presidential election, 7th Schedule, Supreme Court powers).',
  'president': '🎯 Exam Angle → 🔥 HIGH — President vs Governor Pardoning Powers: President can pardon Court Martial death sentences and military court convictions; Governor CANNOT pardon death sentences (can only suspend, remit, or commute) and has zero military court jurisdiction.',
  'emergency': '🎯 Exam Angle → 🔥 HIGH — Emergency Safeguards (44th Amendment Act 1978): (1) "Internal Disturbance" replaced with "Armed Rebellion"; (2) Written recommendation of Union Cabinet mandatory; (3) Articles 20 and 21 CANNOT be suspended even during National Emergency.',
  'fundamental_rights': '🎯 Exam Angle → 🔥 HIGH — Fundamental Rights Available ONLY to Indian Citizens (Not Foreigners): Articles 15, 16, 19, 29, and 30. All other Fundamental Rights (14, 20, 21, 21A, 22, 23, 24, 25, 26, 27, 28) apply to all persons (citizens and foreigners alike).',
  'writs': '🎯 Exam Angle → 🔥 HIGH — Article 32 (Supreme Court) vs Article 226 (High Court): (1) Art 32 is a Fundamental Right in itself; Art 226 is a constitutional discretion; (2) High Court writ jurisdiction is WIDER than Supreme Court because HC can issue writs for ordinary legal rights as well as Fundamental Rights.',
  'money_bill': '🎯 Exam Angle → 🔥 HIGH — Money Bill Invariants (Article 110): (1) Can be introduced ONLY in Lok Sabha with prior recommendation of the President; (2) Speaker’s endorsement is final; (3) Rajya Sabha has only 14 days to return it; (4) ZERO provision for Joint Sitting (Article 108) on Money Bills!',
  'dpsp': '🎯 Exam Angle → 🔥 HIGH — DPSP Classification (Sir B.N. Rau / Granvill Austin): Socialistic (Art 38, 39, 39A, 41, 42, 43), Gandhian (Art 40, 43, 43B, 46, 47, 48), and Liberal-Intellectual (Art 44, 45, 48, 48A, 49, 50, 51). Art 44 is Uniform Civil Code.',
  'panchayat': '🎯 Exam Angle → 🔥 HIGH — 73rd vs 74th Amendments (1992): 73rd added Part IX & 11th Schedule (29 functional subjects); 74th added Part IX-A & 12th Schedule (18 functional subjects). State Election Commission (243K) and State Finance Commission (243I) are mandatory.'
};

const polFiles = fs.readdirSync(corpusDir).filter(f => f.startsWith('migrated-core-pol-'));
let upgradedCount = 0;

polFiles.forEach(file => {
  const filePath = path.join(corpusDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let modified = false;

  const id = data.id || '';
  const title = (data.title || '').toLowerCase();

  // Match targeted doctoral exam angle
  let matchedTrap = '';
  if (title.includes('amendment') || id.includes('amend')) {
    matchedTrap = POLITY_TRAPS.amendment;
  } else if (title.includes('president') || title.includes('governor') || id.includes('16') || id.includes('26')) {
    matchedTrap = POLITY_TRAPS.president;
  } else if (title.includes('emergency') || id.includes('42') || id.includes('43')) {
    matchedTrap = POLITY_TRAPS.emergency;
  } else if (title.includes('writs') || title.includes('32') || id.includes('13')) {
    matchedTrap = POLITY_TRAPS.writs;
  } else if (title.includes('equality') || title.includes('freedom') || title.includes('fundamental rights') || id.includes('11') || id.includes('12')) {
    matchedTrap = POLITY_TRAPS.fundamental_rights;
  } else if (title.includes('money') || title.includes('bill') || title.includes('parliament') || id.includes('20') || id.includes('21')) {
    matchedTrap = POLITY_TRAPS.money_bill;
  } else if (title.includes('dpsp') || title.includes('directive') || id.includes('14')) {
    matchedTrap = POLITY_TRAPS.dpsp;
  } else if (title.includes('panchayat') || title.includes('municipal') || id.includes('30') || id.includes('31')) {
    matchedTrap = POLITY_TRAPS.panchayat;
  } else {
    matchedTrap = `🎯 Exam Angle → 🔥 HIGH — Pay close attention to constitutional article numbers, amendment acts, qualifying ages (President/VP/Governor = 35 yrs; Rajya Sabha = 30 yrs; Lok Sabha/Panchayat = 25/21 yrs), and the exact removal procedures.`;
  }

  // Update Exam Trap Block
  let trapFound = false;
  data.blocks.forEach(blk => {
    if (blk.type === 'exam_trap' || (blk.content && blk.content.includes('🎯 Exam Angle'))) {
      blk.type = 'exam_trap';
      blk.content = matchedTrap;
      trapFound = true;
      modified = true;
    }
  });

  if (!trapFound) {
    data.blocks.push({
      id: `blk-${data.id}-exam-trap`,
      type: 'exam_trap',
      content: matchedTrap
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    upgradedCount++;
  }
});

console.log(`✅ Successfully upgraded all ${upgradedCount} Indian Polity chapters to Constitutional Jurisprudence Doctoral standards.`);
