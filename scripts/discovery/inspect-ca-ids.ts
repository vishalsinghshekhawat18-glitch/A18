import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';
const caDataPath = path.join(legacyDir, 'ca_app', 'data.js');

export function inspectCAIds() {
  const content = fs.readFileSync(caDataPath, 'utf-8');
  const caMatch = content.match(/const\s+CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
  if (caMatch) {
    const notes = eval(caMatch[1]);
    console.log(`Loaded ${notes.length} CA notes. Sample IDs:`);
    notes.slice(0, 15).forEach((n: any) => console.log(`   - ID: ${n.id} | Title: ${n.title}`));
  }
}

inspectCAIds();
