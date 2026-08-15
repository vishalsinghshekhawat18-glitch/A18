import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function inspectCoreScripts() {
  console.log('🔍 Extracting script variables and chapter data from index.html...\n');

  const indexPath = path.join(legacyDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  // Match inline script blocks
  const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptIndex = 0;

  while ((match = scriptRegex.exec(content)) !== null) {
    scriptIndex++;
    const scriptBody = match[1];
    console.log(`📜 Script #${scriptIndex} Length: ${scriptBody.length} characters`);

    // Look for variable declarations
    const vars = scriptBody.match(/(?:const|var|let)\s+([a-zA-Z0-9_]+)\s*=/g) || [];
    console.log(`   - Declared variables: ${vars.join(', ')}`);

    // Look for array or object signatures
    const chaptersMatch = scriptBody.match(/(?:const|var|let)\s+([a-zA-Z0-9_]*chapter[a-zA-Z0-9_]*)\s*=\s*(\[[\s\S]*?\]);/i);
    if (chaptersMatch) {
      console.log(`   - Found chapter array variable: ${chaptersMatch[1]}`);
      try {
        const arr = eval(chaptersMatch[2]);
        console.log(`   - Successfully parsed ${arr.length} chapters!`);

        if (arr.length > 0) {
          const sample = arr[0];
          console.log('   - Sample Chapter Keys:', Object.keys(sample));
          console.log('   - Sample Chapter Title:', sample.title || sample.name);
          console.log('   - Sample Chapter Subject:', sample.subject || sample.category);
        }
      } catch (e: any) {
        console.log(`   - Could not eval chapter array directly: ${e.message}`);
      }
    }
  }
}

inspectCoreScripts();
