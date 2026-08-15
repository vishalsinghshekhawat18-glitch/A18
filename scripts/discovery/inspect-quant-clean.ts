import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const caAppDir = path.join(legacyDir, 'ca_app');

export function inspectQuantClean() {
  const quantPath = path.join(caAppDir, 'quant_data.js');
  const txt = fs.readFileSync(quantPath, 'utf-8');

  // Parse using string manipulation
  const startIdx = txt.indexOf('const QUANT_CHAPTERS =');
  const endIdx = txt.lastIndexOf('];');
  const jsonStr = txt.substring(startIdx + 'const QUANT_CHAPTERS ='.length, endIdx + 1);

  try {
    const chapters = Function(`"use strict"; return (${jsonStr});`)();
    console.log(`✅ Parsed ${chapters.length} Quant Chapters:`);
    for (const ch of chapters) {
      console.log(`📌 Chapter: ${ch.title} (ID: ${ch.id})`);
      if (ch.subsections) {
        for (const sub of ch.subsections) {
          console.log(`   * SubID: ${sub.subId} | Title: ${sub.title}`);
        }
      }
    }
  } catch (e: any) {
    console.error('Quant parse error:', e.message);
  }
}

inspectQuantClean();
