import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function inspectSchemeObject() {
  const schemesPath = path.join(legacyDir, 'ca_app', 'updated_schemes_data.js');
  const txt = fs.readFileSync(schemesPath, 'utf-8');
  const scMatch = txt.match(/const\s+updatedSchemesData\s*=\s*(\[[\s\S]*?\]);/);
  if (scMatch) {
    const schemes = eval(scMatch[1]);
    console.log(`Loaded ${schemes.length} schemes.`);
    const s15 = schemes.find((s: any) => s.id === 'scheme-15' || s.id === 15);
    console.log('Scheme-15 keys:', Object.keys(s15));
    console.log('Scheme-15 details:', s15);

    console.log('\nFirst 5 schemes titles:');
    schemes.slice(0, 5).forEach((s: any) => console.log(`   - ID: ${s.id} | Title: ${s.title || s.schemeName || s.name}`));
  }
}

inspectSchemeObject();
