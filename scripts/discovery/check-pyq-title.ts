import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const quantPath = path.join(legacyDir, 'ca_app', 'quant_data.js');

export function checkPyqTitle() {
  const txt = fs.readFileSync(quantPath, 'utf-8');
  const quantStartIdx = txt.indexOf('const QUANT_CHAPTERS =');
  const quantEndIdx = txt.lastIndexOf('];');
  const quantJsonStr = txt.substring(quantStartIdx + 'const QUANT_CHAPTERS ='.length, quantEndIdx + 1);
  const chapters: any[] = Function(`"use strict"; return (${quantJsonStr});`)();

  for (const ch of chapters) {
    if (ch.subsections) {
      const found = ch.subsections.find((sub: any) => sub.subId === 'qsec8-2');
      if (found) {
        console.log('Raw qsec8-2 title:', JSON.stringify(found.title));
      }
    }
  }
}

checkPyqTitle();
