import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function inspectCoreDeep() {
  console.log('🔍 Deeply inspecting Legacy Source A (index.html & subject files)...\n');

  const indexPath = path.join(legacyDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  // Search for chapter data structures in index.html
  const chapterMatches = content.match(/id=["'](ch-\d+|pol-\d+|econ-\d+|hist-\d+|geo-\d+|sci-\d+)["']/gi) || [];
  console.log(`Found ${chapterMatches.length} ID attributes matching chapter patterns in index.html`);

  const articleMatches = content.match(/<article[\s\S]*?>/gi) || [];
  const sectionMatches = content.match(/<section[\s\S]*?>/gi) || [];
  console.log(`Found ${articleMatches.length} <article> tags and ${sectionMatches.length} <section> tags in index.html`);

  // Search for JS objects or arrays in index.html
  const scriptTags = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
  let scriptCharCount = 0;
  scriptTags.forEach(s => scriptCharCount += s.length);
  console.log(`Total JS script tags in index.html: ${scriptTags.length} (${(scriptCharCount / 1024).toFixed(1)} KB)`);

  // Inspect files inside subject subdirectories if any
  const dirs = fs.readdirSync(legacyDir).filter(f => fs.statSync(path.join(legacyDir, f)).isDirectory() && !f.startsWith('.'));
  console.log('Subdirectories:', dirs);

  for (const d of dirs) {
    const subFiles = fs.readdirSync(path.join(legacyDir, d));
    console.log(`Directory ${d}: ${subFiles.length} files (${subFiles.slice(0, 5).join(', ')})`);
  }
}

inspectCoreDeep();
