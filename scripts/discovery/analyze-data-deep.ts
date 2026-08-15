import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const caAppDir = path.join(legacyDir, 'ca_app');

export function deepAnalyze() {
  console.log('🔬 Performing Deep Schema & Field Frequency Analysis on Legacy Systems...\n');

  // 1. Analyze CA data.js
  const dataJsPath = path.join(caAppDir, 'data.js');
  if (fs.existsSync(dataJsPath)) {
    const content = fs.readFileSync(dataJsPath, 'utf-8');
    // Extract array items using eval or Function in a safe sandbox or regex
    const notesMatch = content.match(/const\s+CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
    if (notesMatch) {
      try {
        const caNotes = eval(notesMatch[1]);
        console.log(`✅ Extracted ${caNotes.length} CA notes from data.js`);

        const fieldPresence: Record<string, number> = {};
        const miniGridHeaderCounts: Record<string, number> = {};

        for (const note of caNotes) {
          for (const key of Object.keys(note)) {
            fieldPresence[key] = (fieldPresence[key] || 0) + 1;
          }
          if (note.miniGrid && note.miniGrid.headers) {
            const hKey = note.miniGrid.headers.join(' | ');
            miniGridHeaderCounts[hKey] = (miniGridHeaderCounts[hKey] || 0) + 1;
          }
        }

        console.log('\n📊 CA Notes Field Frequency (out of ' + caNotes.length + ' notes):');
        for (const [k, count] of Object.entries(fieldPresence)) {
          console.log(`   - ${k}: ${count} (${((count / caNotes.length) * 100).toFixed(1)}%)`);
        }

        console.log('\n📊 Top miniGrid Header Patterns:');
        Object.entries(miniGridHeaderCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .forEach(([headers, count]) => {
            console.log(`   - [${headers}]: ${count} occurrences`);
          });
      } catch (e: any) {
        console.error('Failed to parse CA_NOTES_DATA:', e.message);
      }
    }
  }

  // 2. Analyze Static GA data
  const staticJsPath = path.join(caAppDir, 'static_ga_data.js');
  if (fs.existsSync(staticJsPath)) {
    const content = fs.readFileSync(staticJsPath, 'utf-8');
    const staticMatch = content.match(/const\s+STATIC_GA_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
    if (staticMatch) {
      try {
        const staticChapters = eval(staticMatch[1]);
        console.log(`\n✅ Extracted ${staticChapters.length} Static GA chapters`);
        let totalSubsections = 0;
        for (const ch of staticChapters) {
          totalSubsections += ch.subsections ? ch.subsections.length : 0;
        }
        console.log(`   - Total Static GA Subsections: ${totalSubsections}`);
      } catch (e: any) {
        console.error('Failed to parse STATIC_GA_CHAPTERS:', e.message);
      }
    }
  }

  // 3. Analyze Quant data
  const quantJsPath = path.join(caAppDir, 'quant_data.js');
  if (fs.existsSync(quantJsPath)) {
    const content = fs.readFileSync(quantJsPath, 'utf-8');
    const quantMatch = content.match(/const\s+QUANT_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
    if (quantMatch) {
      try {
        const quantChapters = eval(quantMatch[1]);
        console.log(`\n✅ Extracted ${quantChapters.length} Quant chapters`);
        let totalQuantTopics = 0;
        for (const ch of quantChapters) {
          totalQuantTopics += ch.subsections ? ch.subsections.length : 0;
        }
        console.log(`   - Total Quant Topics/Subsections: ${totalQuantTopics}`);
      } catch (e: any) {
        console.error('Failed to parse QUANT_CHAPTERS:', e.message);
      }
    }
  }

  // 4. Analyze Schemes data
  const schemesJsPath = path.join(caAppDir, 'updated_schemes_data.js');
  if (fs.existsSync(schemesJsPath)) {
    const content = fs.readFileSync(schemesJsPath, 'utf-8');
    const schemesMatch = content.match(/const\s+updatedSchemesData\s*=\s*(\[[\s\S]*?\]);/);
    if (schemesMatch) {
      try {
        const schemes = eval(schemesMatch[1]);
        console.log(`\n✅ Extracted ${schemes.length} Government Schemes notes`);
      } catch (e: any) {
        console.error('Failed to parse updatedSchemesData:', e.message);
      }
    }
  }

  // 5. Analyze Core Chapter Files Structure
  const subjects = ['Economy', 'Polity', 'Science', 'geography', 'history'];
  let totalCoreFiles = 0;
  const corePatternTotal = {
    tables: 0,
    mindmaps: 0,
    mathjax: 0,
    lists: 0,
    callouts: 0
  };

  for (const subj of subjects) {
    const dir = path.join(legacyDir, subj);
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.json') || f.endsWith('.js') || f.endsWith('.txt'));
      totalCoreFiles += files.length;

      for (const f of files) {
        const txt = fs.readFileSync(path.join(dir, f), 'utf-8');
        if (txt.includes('<table')) corePatternTotal.tables++;
        if (txt.includes('mindmap')) corePatternTotal.mindmaps++;
        if (txt.includes('\\(') || txt.includes('\\[')) corePatternTotal.mathjax++;
        if (txt.includes('<ul') || txt.includes('<ol')) corePatternTotal.lists++;
        if (txt.includes('callout') || txt.includes('trap')) corePatternTotal.callouts++;
      }
    }
  }

  console.log(`\n📚 Total Core Chapters across 5 Subject Folders: ${totalCoreFiles}`);
  console.log('   - Core Pattern Analysis across chapter files:', JSON.stringify(corePatternTotal, null, 2));
}

deepAnalyze();
