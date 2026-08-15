import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const caAppDir = path.join(legacyDir, 'ca_app');

export function inspectCAQuant() {
  console.log('🔍 Extracting Quant and Static GA data structures...\n');

  // Quant
  const quantPath = path.join(caAppDir, 'quant_data.js');
  if (fs.existsSync(quantPath)) {
    const txt = fs.readFileSync(quantPath, 'utf-8');
    const startIdx = txt.indexOf('const QUANT_CHAPTERS =');
    if (startIdx !== -1) {
      const lastBracket = txt.lastIndexOf(']');
      const jsonStr = txt.substring(startIdx + 'const QUANT_CHAPTERS ='.length, lastBracket + 1).trim();
      try {
        const quantChapters = JSON.parse(jsonStr);
        console.log(`✅ Parsed ${quantChapters.length} Quant Chapters!`);

        let totalSubsections = 0;
        let totalWorkedExamples = 0;
        let totalTraps = 0;
        let totalFormulas = 0;

        for (const ch of quantChapters) {
          if (ch.subsections) {
            totalSubsections += ch.subsections.length;
            for (const sub of ch.subsections) {
              const body = JSON.stringify(sub);
              if (body.includes('workedExample') || body.includes('example')) totalWorkedExamples++;
              if (body.includes('trap')) totalTraps++;
              if (body.includes('formula') || body.includes('latex') || body.includes('\\(')) totalFormulas++;
            }
          }
        }

        console.log('Quant Breakdown:', {
          chapters: quantChapters.length,
          topicsSubsections: totalSubsections,
          sampleChapterTitle: quantChapters[0]?.title,
          sampleSubTitle: quantChapters[0]?.subsections?.[0]?.title,
          sampleSubKeys: quantChapters[0]?.subsections?.[0] ? Object.keys(quantChapters[0].subsections[0]) : []
        });
      } catch (e: any) {
        console.error('Quant JSON Parse Error:', e.message);
      }
    }
  }

  // Static GA
  const staticPath = path.join(caAppDir, 'static_ga_data.js');
  if (fs.existsSync(staticPath)) {
    const txt = fs.readFileSync(staticPath, 'utf-8');
    const startIdx = txt.indexOf('const STATIC_GA_CHAPTERS =');
    if (startIdx !== -1) {
      const lastBracket = txt.lastIndexOf(']');
      const jsonStr = txt.substring(startIdx + 'const STATIC_GA_CHAPTERS ='.length, lastBracket + 1).trim();
      try {
        const staticChapters = JSON.parse(jsonStr);
        console.log(`\n✅ Parsed ${staticChapters.length} Static GA Chapters!`);

        let totalSubsections = 0;
        for (const ch of staticChapters) {
          if (ch.subsections) totalSubsections += ch.subsections.length;
        }

        console.log('Static GA Breakdown:', {
          chapters: staticChapters.length,
          subsections: totalSubsections,
          sampleChapterTitle: staticChapters[0]?.title,
          sampleSubKeys: staticChapters[0]?.subsections?.[0] ? Object.keys(staticChapters[0].subsections[0]) : []
        });
      } catch (e: any) {
        console.error('Static GA JSON Parse Error:', e.message);
      }
    }
  }
}

inspectCAQuant();
