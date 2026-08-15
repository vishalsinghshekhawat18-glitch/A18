import { LegacySourceIndex } from '../migration/source-index';
import { transformCANoteToKnowledgeItem } from '../migration/extractors/ca-extractor';
import { transformQuantStaticToKnowledgeItem } from '../migration/extractors/quant-static-extractor';

export function debugGateF() {
  const index = new LegacySourceIndex();

  // 1. note-sec1-1
  const ca1 = index.getEntity('CA', 'note-sec1-1');
  console.log('--- raw note-sec1-1 ---');
  console.log(JSON.stringify(ca1?.rawPayload, null, 2));

  const t1 = transformCANoteToKnowledgeItem(ca1?.rawPayload);
  console.log('--- target blocks for note-sec1-1 ---');
  console.log(JSON.stringify(t1.blocks, null, 2));

  console.log('Raw text includes ₹:', JSON.stringify(ca1?.rawPayload).includes('₹'));
  console.log('Target blocks include ₹:', JSON.stringify(t1.blocks).includes('₹'));

  // 2. StaticGA ch2-sub1
  const st1 = index.getEntity('StaticGA', 'ch2-sub1');
  console.log('\n--- raw ch2-sub1 ---');
  console.log(JSON.stringify(st1?.rawPayload, null, 2));

  const t2 = transformQuantStaticToKnowledgeItem(st1?.rawPayload, 'StaticGA', 'ca_app/static_ga_data.js');
  console.log('--- target blocks for ch2-sub1 ---');
  console.log(JSON.stringify(t2.blocks, null, 2));

  console.log('Raw text includes ₹:', JSON.stringify(st1?.rawPayload).includes('₹'));
  console.log('Target blocks include ₹:', JSON.stringify(t2.blocks).includes('₹'));

  // 3. Quant qsec2-1
  const q1 = index.getEntity('Quant', 'qsec2-1');
  console.log('\n--- raw qsec2-1 ---');
  console.log(JSON.stringify(q1?.rawPayload, null, 2));

  const t3 = transformQuantStaticToKnowledgeItem(q1?.rawPayload, 'Quant', 'ca_app/quant_data.js');
  console.log('--- target blocks for qsec2-1 ---');
  console.log(JSON.stringify(t3.blocks, null, 2));

  console.log('Raw text includes %:', JSON.stringify(q1?.rawPayload).includes('%'));
  console.log('Target blocks include %:', JSON.stringify(t3.blocks).includes('%'));
}

debugGateF();
