import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function inspectFixed() {
  const indexPath = path.join(legacyDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  const startIdx = content.indexOf('const rawBookData =');
  const endIdx = content.indexOf('let selectedSubject =', startIdx);

  if (startIdx !== -1 && endIdx !== -1) {
    const rawSnippet = content.substring(startIdx + 'const rawBookData ='.length, endIdx);
    const lastBracketIdx = rawSnippet.lastIndexOf(']');
    if (lastBracketIdx !== -1) {
      const cleanArrayStr = rawSnippet.substring(0, lastBracketIdx + 1).trim();

      try {
        const chapters: any[] = JSON.parse(cleanArrayStr);
        console.log(`\n✅ SUCCESSFULLY PARSED EXACTLY ${chapters.length} CORE CHAPTERS FROM index.html!`);

        const subjectBreakdown: Record<string, { count: number; sampleTitle: string }> = {};

        for (const ch of chapters) {
          const subj = ch.subject || 'unknown';
          if (!subjectBreakdown[subj]) {
            subjectBreakdown[subj] = { count: 0, sampleTitle: ch.title };
          }
          subjectBreakdown[subj].count++;
        }

        console.log('\nSubject Breakdown (Total: ' + chapters.length + ' chapters):');
        for (const [s, data] of Object.entries(subjectBreakdown)) {
          console.log(`   - ${s}: ${data.count} chapters (e.g. "${data.sampleTitle}")`);
        }

        // Sample chapter keys
        const sampleCh = chapters[0];
        console.log('\nSample Chapter Object Keys:', Object.keys(sampleCh));
        console.log('Sample Metadata Fields:', {
          id: sampleCh.id,
          chNum: sampleCh.chNum,
          subject: sampleCh.subject,
          subjectName: sampleCh.subjectName,
          book: sampleCh.book,
          title: sampleCh.title,
          readTime: sampleCh.readTime,
          examTags: sampleCh.examTags,
          truth: sampleCh.truth ? sampleCh.truth.substring(0, 80) + '...' : null
        });

        // Pattern Frequency Analysis across all 186 chapters
        let tables = 0, mindmaps = 0, mathjax = 0, inlineStyles = 0, traps = 0, lists = 0, quotes = 0, callouts = 0, boldItalic = 0;
        for (const ch of chapters) {
          const body = ch.body || '';
          if (/<table[\s\S]*?>/i.test(body)) tables++;
          if (/mindmap/i.test(body)) mindmaps++;
          if (/\\\\\(|\\\\\)|\\\\\[|\\\\\]|\$\$|MathJax/i.test(body)) mathjax++;
          if (/style=["'][^"']+["']/i.test(body)) inlineStyles++;
          if (/exam[-_]?trap|trap-box/i.test(body)) traps++;
          if (/<ul|<ol/i.test(body)) lists++;
          if (/<blockquote/i.test(body)) quotes++;
          if (/callout-box|note-box/i.test(body)) callouts++;
          if (/<b>|<strong>|<i>|<em>/i.test(body)) boldItalic++;
        }

        console.log('\n📊 Pattern Frequency Inventory across all ' + chapters.length + ' Core Chapters:');
        console.log(`   - HTML Tables (<table>): ${tables} chapters`);
        console.log(`   - Mindmaps (div.mindmap-container): ${mindmaps} chapters`);
        console.log(`   - MathJax Formulas: ${mathjax} chapters`);
        console.log(`   - Inline Styling (style="..."): ${inlineStyles} chapters`);
        console.log(`   - Exam Traps / Traps: ${traps} chapters`);
        console.log(`   - Callouts / Note Boxes: ${callouts} chapters`);
        console.log(`   - Lists (<ul>/<ol>): ${lists} chapters`);
        console.log(`   - Quotations (<blockquote>): ${quotes} chapters`);
        console.log(`   - Bold/Italic Formatting (<b>/<strong>/<i>/<em>): ${boldItalic} chapters`);

      } catch (e: any) {
        console.error('JSON Parse error:', e.message);
      }
    }
  }
}

inspectFixed();
