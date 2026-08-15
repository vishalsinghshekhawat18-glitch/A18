import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function inspectCASystem() {
  console.log('🔍 Inspecting Legacy Source B (Current Affairs & Static GA & Quant)...');

  const caAppDir = path.join(legacyDir, 'ca_app');
  let searchPaths = [legacyDir];
  if (fs.existsSync(caAppDir)) {
    searchPaths.push(caAppDir);
  }

  const foundDataFiles: string[] = [];

  for (const sPath of searchPaths) {
    const files = fs.readdirSync(sPath);
    for (const f of files) {
      if (f.endsWith('.js') || f.endsWith('.json') || f.includes('data')) {
        foundDataFiles.push(path.join(sPath, f));
      }
    }
  }

  console.log(`Discovered ${foundDataFiles.length} potential CA data files:`, foundDataFiles);

  for (const filePath of foundDataFiles) {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    console.log(`\n📄 Analyzing Data File: ${fileName} (${(content.length / 1024).toFixed(1)} KB)`);

    // Check array or object structures inside JS files
    const constMatches = content.match(/(?:const|var|let)\s+([a-zA-Z0-9_]+)\s*=/g) || [];
    console.log(`   - Exported Variables/Constants: ${constMatches.join(', ')}`);

    // Field occurrence counters for CA items
    const fieldCounts = {
      id: (content.match(/["']?id["']?\s*:/g) || []).length,
      secId: (content.match(/["']?secId["']?\s*:/g) || []).length,
      title: (content.match(/["']?title["']?\s*:/g) || []).length,
      date: (content.match(/["']?date["']?\s*:/g) || []).length,
      hook: (content.match(/["']?hook["']?\s*:/g) || []).length,
      bullets: (content.match(/["']?bullets["']?\s*:/g) || []).length,
      staticGk: (content.match(/["']?staticGk["']?\s*:/g) || []).length,
      trap: (content.match(/["']?trap["']?\s*:/g) || []).length,
      miniGrid: (content.match(/["']?miniGrid["']?\s*:/g) || []).length,
      category: (content.match(/["']?category["']?\s*:/g) || []).length,
      tags: (content.match(/["']?tags["']?\s*:/g) || []).length,
      importance: (content.match(/["']?importance["']?\s*:/g) || []).length,
      source: (content.match(/["']?source["']?\s*:/g) || []).length,
      formula: (content.match(/["']?formula["']?\s*:/g) || []).length,
      workedExample: (content.match(/["']?workedExample["']?\s*:/g) || []).length
    };

    console.log('   - Field Occurrences:', JSON.stringify(fieldCounts, null, 2));
  }
}

inspectCASystem();
