const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', '..', 'content', 'corpus');

console.log('✍️ Deploying Council 4 (Doctoral Faculty in Applied Linguistics & Editorial Rhetoric)...\n');

const ENGLISH_UPGRADES = {
  'migrated-eng-ch-1': {
    title: 'The 250-Word / 18-Min Descriptive Essay Masterclass',
    summary: 'Doctoral guide on high-scoring descriptive essay writing for SBI PO Mains & RBI Grade B Phase 2, featuring the 4-paragraph PEEL framework, time distribution, and scoring rubrics...',
    examTrap: '🎯 Exam Angle → ✍️ Scoring Rubric & Pitfalls:\n1. **Word Limit Window:** Stay strictly within 250 words ± 10% (225 to 275 words). Exceeding 275 words penalizes coherence; writing <200 words loses 30% marks directly.\n2. **Zero Informal Contractions:** Never use "don\'t", "can\'t", "it\'s", or "won\'t". Always write "do not", "cannot", "it is", "will not".\n3. **Parallel Grammatical Structure:** When listing points in Body 2, ensure all verbs match tense and form (e.g. "enhancing..., promoting..., and securing...").'
  },

  'migrated-eng-ch-2': {
    title: 'Introduction Hooks, Thesis Statements & Circular Callbacks',
    summary: 'Comprehensive methodology for crafting high-impact opening hooks, definitive thesis statements, and circular conclusion callbacks for competitive examinations...',
    examTrap: '🎯 Exam Angle → ✍️ Introduction Pitfalls:\n1. **The Circular Thesis Trap:** Never start with generic filler like *"In today\'s modern world, technology is very important"*. Open with a striking macroeconomic or statutory fact.\n2. **Conclusion Alignment:** The conclusion must provide a forward-looking mitigation roadmap, not just repeat the introduction word-for-word.'
  },

  'migrated-eng-ch-3': {
    title: 'Formal Correspondence & Banking Ombudsman Letters Masterclass',
    summary: 'Standardized formats for formal complaints, letters to branch managers, representations to the Banking Ombudsman, and RTI applications with band-9 model templates...',
    examTrap: '🎯 Exam Angle → ✍️ Formal Letter Rules:\n1. **Salutation & Complementary Close:** If starting with *"Dear Sir/Madam"*, close with *"Yours faithfully"*. If addressing by name (*"Dear Mr. Sharma"*), close with *"Yours sincerely"*.\n2. **Subject Line Brevity:** The subject line must be a single concise noun phrase (e.g. *"Subject: Representation regarding unauthorized electronic transaction deduction"*).'
  },

  'migrated-eng-ch-4': {
    title: '120 Master Grammar Rules & Error Spotting Diagnostic Guide',
    summary: 'Comprehensive breakdown of 120 core grammar rules covering Subject-Verb Agreement, Inversion, Subjunctive Mood, Parallelism, and Conditional clauses for Bank PO Mains...',
    examTrap: '🎯 Exam Angle → ⚡ High-Frequency Error Spotting Traps:\n1. **Hardly / Scarcely Inversion:** *"Hardly had he entered the branch WHEN (not than) the siren sounded"*; *"No sooner did he arrive THAN (not when) the manager called"*.\n2. **Lest + Should:** *"Lest"* is always followed by *"should"* (or bare infinitive), and NEVER takes a negative *"not"* (e.g. *"Work hard lest you should fail"*).'
  },

  'migrated-eng-ch-5': {
    title: 'High-Yield Banking, Macroeconomic & Legal Wordlist Master Suite',
    summary: 'Exhaustive vocabulary bank featuring financial terminology, Latin legal maxims, root-word etymology, and contextual sentence usage for RC and Cloze Tests...',
    examTrap: '🎯 Exam Angle → ⚡ High-Yield Financial & Legal Pairs:\n1. **Fiscal vs Financial:** *"Fiscal"* pertains specifically to government revenue, taxation, and budget deficit; *"Financial"* pertains to commercial money management and banking.\n2. **Ultra Vires vs Intra Vires:** *"Ultra Vires"* means beyond legal authority/statutory powers; *"Intra Vires"* means within legal authority.'
  }
};

let count = 0;
for (const [id, data] of Object.entries(ENGLISH_UPGRADES)) {
  const filePath = path.join(corpusDir, `${id}.json`);
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    existing.title = data.title;
    existing.summary = data.summary;
    
    // Find or add exam trap
    let trapFound = false;
    existing.blocks.forEach(blk => {
      if (blk.type === 'exam_trap' || (blk.content && blk.content.includes('🎯 Exam Angle'))) {
        blk.type = 'exam_trap';
        blk.content = data.examTrap;
        trapFound = true;
      }
    });
    if (!trapFound) {
      existing.blocks.push({
        id: `blk-${id}-exam-trap`,
        type: 'exam_trap',
        content: data.examTrap
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
    count++;
    console.log(`✅ Upgraded ${id} (${data.title}) to Applied Linguistics Doctoral standard.`);
  }
}

console.log(`\n🎉 Successfully upgraded all ${count} English units.`);
