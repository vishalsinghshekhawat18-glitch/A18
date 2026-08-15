import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function inspectCoreSystem() {
  console.log('🔍 Inspecting Legacy Source A (Core / All-Subjects)...');

  const indexPath = path.join(legacyDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ index.html not found at ${indexPath}`);
    return;
  }

  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Regex patterns to detect embedded chapters or script data in index.html
  const scriptBlocks = indexContent.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi) || [];
  console.log(`Found ${scriptBlocks.length} <script> blocks in index.html (Total length: ${indexContent.length} chars)`);

  // Inspect folders in legacyDir
  const entries = fs.readdirSync(legacyDir, { withFileTypes: true });
  const subjectFolders = entries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => e.name);
  console.log(`Discovered Legacy Subject Directories: ${subjectFolders.join(', ')}`);

  // Frequency inventory of HTML patterns in index.html and subject files
  const patternCounts = {
    tables: (indexContent.match(/<table[\s\S]*?>/gi) || []).length,
    mindmaps: (indexContent.match(/class=["'][^"']*mindmap[^"']*["']/gi) || []).length,
    mathjax: (indexContent.match(/\\\\\(|\\\\\)|\\\$|\\\\\[|\\\\\]|\$\$|MathJax/gi) || []).length,
    inlineStyles: (indexContent.match(/style=["'][^"']+["']/gi) || []).length,
    examTraps: (indexContent.match(/class=["'][^"']*trap[^"']*["']|exam[-_]?trap/gi) || []).length,
    callouts: (indexContent.match(/class=["'][^"']*callout[^"']*["']/gi) || []).length,
    nestedLists: (indexContent.match(/<ul[\s\S]*?<ul|<ol[\s\S]*?<ol/gi) || []).length,
    images: (indexContent.match(/<img[\s\S]*?>/gi) || []).length
  };

  console.log('\nPattern Frequency Inventory in index.html:', JSON.stringify(patternCounts, null, 2));

  // Count files inside subject folders
  const folderStats: Record<string, { fileCount: number; files: string[] }> = {};
  for (const folder of subjectFolders) {
    const fPath = path.join(legacyDir, folder);
    const files = fs.readdirSync(fPath).filter(f => !f.startsWith('.'));
    folderStats[folder] = {
      fileCount: files.length,
      files: files.slice(0, 10)
    };
  }

  console.log('\nSubject Folder File Breakdown:', JSON.stringify(folderStats, null, 2));
}

inspectCoreSystem();
