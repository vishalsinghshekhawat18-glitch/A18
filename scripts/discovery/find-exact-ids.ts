import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function findExactIds() {
  console.log('🔍 Locating exact source IDs for the 15 Golden Sample Items...\n');

  // 1. Core Chapters in index.html
  const indexPath = path.join(legacyDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const startIdx = indexContent.indexOf('const rawBookData =');
  const endIdx = indexContent.indexOf('let selectedSubject =', startIdx);
  const rawSnippet = indexContent.substring(startIdx + 'const rawBookData ='.length, endIdx);
  const lastBracketIdx = rawSnippet.lastIndexOf(']');
  const cleanArrayStr = rawSnippet.substring(0, lastBracketIdx + 1).trim();
  const allCoreChapters: any[] = JSON.parse(cleanArrayStr);

  console.log(`Core Chapters Total: ${allCoreChapters.length}`);
  const historyChapters = allCoreChapters.filter(c => c.subject === 'history');
  console.log(`History Chapters (${historyChapters.length}):`);
  historyChapters.slice(0, 25).forEach(c => console.log(`   - ID: ${c.id} | Title: ${c.title}`));

  // 2. Quant Chapters in ca_app/quant_data.js
  const quantPath = path.join(legacyDir, 'ca_app', 'quant_data.js');
  const quantTxt = fs.readFileSync(quantPath, 'utf-8');
  const qMatch = quantTxt.match(/const\s+QUANT_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
  if (qMatch) {
    try {
      const quantChs = Function(`"use strict"; return (${qMatch[1]});`)();
      console.log(`\nQuant Chapters (${quantChs.length}):`);
      for (const ch of quantChs) {
        console.log(`   - Chapter ID: ${ch.id} | Title: ${ch.title}`);
        if (ch.subsections) {
          ch.subsections.forEach((sub: any) => console.log(`     * Sub ID: ${sub.subId} | Title: ${sub.title}`));
        }
      }
    } catch (e: any) {
      console.error('Quant parse error:', e.message);
    }
  }

  // 3. Static GA Chapters in ca_app/static_ga_data.js
  const staticPath = path.join(legacyDir, 'ca_app', 'static_ga_data.js');
  const staticTxt = fs.readFileSync(staticPath, 'utf-8');
  const sMatch = staticTxt.match(/const\s+STATIC_GA_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
  if (sMatch) {
    try {
      const staticChs = eval(sMatch[1]);
      console.log(`\nStatic GA Chapters (${staticChs.length}):`);
      for (const ch of staticChs) {
        console.log(`   - Chapter ID: ${ch.id} | Title: ${ch.title}`);
        if (ch.subsections) {
          ch.subsections.forEach((sub: any) => console.log(`     * Sub ID: ${sub.subId} | Title: ${sub.title}`));
        }
      }
    } catch (e: any) {
      console.error('Static GA parse error:', e.message);
    }
  }

  // 4. Schemes in ca_app/updated_schemes_data.js
  const schemesPath = path.join(legacyDir, 'ca_app', 'updated_schemes_data.js');
  const schemesTxt = fs.readFileSync(schemesPath, 'utf-8');
  const scMatch = schemesTxt.match(/const\s+updatedSchemesData\s*=\s*(\[[\s\S]*?\]);/);
  if (scMatch) {
    try {
      const schemes = eval(scMatch[1]);
      console.log(`\nSchemes Total: ${schemes.length}`);
      console.log('Sample Scheme Items:');
      schemes.slice(0, 5).forEach((s: any) => console.log(`   - ID: ${s.id} | Title: ${s.title}`));
    } catch (e: any) {
      console.error('Schemes parse error:', e.message);
    }
  }

  // 5. CA Notes in ca_app/data.js (Search for PYQs or special notes)
  const caPath = path.join(legacyDir, 'ca_app', 'data.js');
  const caTxt = fs.readFileSync(caPath, 'utf-8');
  const caMatch = caTxt.match(/const\s+CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
  if (caMatch) {
    try {
      const caNotes = eval(caMatch[1]);
      console.log(`\nCA Notes Total: ${caNotes.length}`);
      const pyqNotes = caNotes.filter((n: any) => JSON.stringify(n).toLowerCase().includes('pyq') || JSON.stringify(n).toLowerCase().includes('rbi grade b'));
      console.log(`Found ${pyqNotes.length} CA notes mentioning PYQ or RBI Grade B:`);
      pyqNotes.slice(0, 5).forEach((n: any) => console.log(`   - ID: ${n.id} | Title: ${n.title}`));
    } catch (e: any) {
      console.error('CA parse error:', e.message);
    }
  }
}

findExactIds();
