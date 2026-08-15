import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export interface SourceEntityRecord {
  sourceSystem: 'Core' | 'CA' | 'Schemes' | 'StaticGA' | 'Quant' | 'PYQs';
  sourceFile: string;
  sourceId: string;
  sourceTitle: string;
  sourceDomain: string;
  sourceType: string;
  sourceChecksum: string;
  rawPayload: any;
}

export class LegacySourceIndex {
  private entityMap: Map<string, SourceEntityRecord> = new Map();
  private initialized = false;

  public initialize(): void {
    if (this.initialized) return;

    console.log('📦 INITIALIZING LEGACY SOURCE INDEX FOR ALL 926 CORPUS ITEMS...');

    // 1. Core Chapters in index.html (186 items)
    const indexPath = path.join(legacyDir, 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const startIdx = indexContent.indexOf('const rawBookData =');
    const endIdx = indexContent.indexOf('let selectedSubject =', startIdx);
    const rawSnippet = indexContent.substring(startIdx + 'const rawBookData ='.length, endIdx);
    const lastBracketIdx = rawSnippet.lastIndexOf(']');
    const cleanArrayStr = rawSnippet.substring(0, lastBracketIdx + 1).trim();
    const allCoreChapters: any[] = JSON.parse(cleanArrayStr);

    for (const ch of allCoreChapters) {
      const checksum = crypto.createHash('sha256').update(JSON.stringify(ch)).digest('hex');
      const key = `Core:${ch.id}`;
      this.entityMap.set(key, {
        sourceSystem: 'Core',
        sourceFile: 'index.html (rawBookData)',
        sourceId: ch.id,
        sourceTitle: ch.title,
        sourceDomain: ch.subject || 'economics',
        sourceType: 'chapter',
        sourceChecksum: checksum,
        rawPayload: ch
      });
    }

    // 2. CA Notes in ca_app/data.js (505 items)
    const caDataPath = path.join(legacyDir, 'ca_app', 'data.js');
    const caContent = fs.readFileSync(caDataPath, 'utf-8');
    const caMatch = caContent.match(/const\s+CA_NOTES_DATA\s*=\s*(\[[\s\S]*?\]);/);
    const allCANotes: any[] = caMatch ? eval(caMatch[1]) : [];

    for (const note of allCANotes) {
      const checksum = crypto.createHash('sha256').update(JSON.stringify(note)).digest('hex');
      const key = `CA:${note.id}`;
      this.entityMap.set(key, {
        sourceSystem: 'CA',
        sourceFile: 'ca_app/data.js',
        sourceId: note.id,
        sourceTitle: note.title,
        sourceDomain: 'current-affairs',
        sourceType: 'ca_note',
        sourceChecksum: checksum,
        rawPayload: note
      });
    }

    // 3. Schemes in ca_app/updated_schemes_data.js (171 items)
    const schemesPath = path.join(legacyDir, 'ca_app', 'updated_schemes_data.js');
    const schemesContent = fs.readFileSync(schemesPath, 'utf-8');
    const schemesMatch = schemesContent.match(/const\s+updatedSchemesData\s*=\s*(\[[\s\S]*?\]);/);
    const allSchemes: any[] = schemesMatch ? eval(schemesMatch[1]) : [];

    for (const s of allSchemes) {
      const checksum = crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex');
      const key = `Schemes:${s.id}`;
      this.entityMap.set(key, {
        sourceSystem: 'Schemes',
        sourceFile: 'ca_app/updated_schemes_data.js',
        sourceId: s.id,
        sourceTitle: s.title || s.schemeName || `Scheme ${s.id}`,
        sourceDomain: 'current-affairs',
        sourceType: 'ca_note',
        sourceChecksum: checksum,
        rawPayload: s
      });
    }

    // 4. Static GA Subsections in ca_app/static_ga_data.js (38 items)
    const staticPath = path.join(legacyDir, 'ca_app', 'static_ga_data.js');
    const staticContent = fs.readFileSync(staticPath, 'utf-8');
    const staticMatch = staticContent.match(/const\s+STATIC_GA_CHAPTERS\s*=\s*(\[[\s\S]*?\]);/);
    const allStaticChapters: any[] = staticMatch ? eval(staticMatch[1]) : [];

    for (const ch of allStaticChapters) {
      if (ch.subsections) {
        for (const sub of ch.subsections) {
          const checksum = crypto.createHash('sha256').update(JSON.stringify(sub)).digest('hex');
          const key = `StaticGA:${sub.subId}`;
          this.entityMap.set(key, {
            sourceSystem: 'StaticGA',
            sourceFile: 'ca_app/static_ga_data.js',
            sourceId: sub.subId,
            sourceTitle: sub.title,
            sourceDomain: 'static-ga',
            sourceType: 'static_note',
            sourceChecksum: checksum,
            rawPayload: sub
          });
        }
      }
    }

    // 5. Quant Subsections in ca_app/quant_data.js (26 items)
    const quantPath = path.join(legacyDir, 'ca_app', 'quant_data.js');
    const quantTxt = fs.readFileSync(quantPath, 'utf-8');
    const quantStartIdx = quantTxt.indexOf('const QUANT_CHAPTERS =');
    const quantEndIdx = quantTxt.lastIndexOf('];');
    const quantJsonStr = quantTxt.substring(quantStartIdx + 'const QUANT_CHAPTERS ='.length, quantEndIdx + 1);
    const allQuantChapters: any[] = Function(`"use strict"; return (${quantJsonStr});`)();

    for (const ch of allQuantChapters) {
      if (ch.subsections) {
        for (const sub of ch.subsections) {
          const checksum = crypto.createHash('sha256').update(JSON.stringify(sub)).digest('hex');
          const isPyq = sub.subId.startsWith('qsec8-');
          const system = isPyq ? 'PYQs' : 'Quant';
          const key = `${system}:${sub.subId}`;
          this.entityMap.set(key, {
            sourceSystem: system,
            sourceFile: 'ca_app/quant_data.js',
            sourceId: sub.subId,
            sourceTitle: sub.title,
            sourceDomain: isPyq ? 'pyqs' : 'quant',
            sourceType: isPyq ? 'pyq_item' : 'quant_topic',
            sourceChecksum: checksum,
            rawPayload: sub
          });
        }
      }
    }

    this.initialized = true;
    console.log(`✅ SOURCE INDEX READY: ${this.entityMap.size} ENTITIES INDEXED BY (System:ID).\n`);
  }

  public getEntity(system: string, id: string): SourceEntityRecord | undefined {
    this.initialize();
    return this.entityMap.get(`${system}:${id}`);
  }

  public getAllEntities(): SourceEntityRecord[] {
    this.initialize();
    return Array.from(this.entityMap.values());
  }

  public getCount(): number {
    this.initialize();
    return this.entityMap.size;
  }
}
