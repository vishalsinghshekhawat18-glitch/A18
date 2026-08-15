import fs from 'node:fs';
import path from 'node:path';

const legacyDir = 'C:\\Users\\visha\\OneDrive\\Documents\\aravalli hills';

export function inspectRawBookData() {
  console.log('🔍 Inspecting rawBookData structure in index.html...\n');

  const indexPath = path.join(legacyDir, 'index.html');
  const content = fs.readFileSync(indexPath, 'utf-8');

  // Match const rawBookData = ...
  const match = content.match(/const\s+rawBookData\s*=\s*(\{[\s\S]*?\});\s*(?:let|const|var|\/\/|\/\*)/);
  if (match) {
    console.log(`Found rawBookData match! Match length: ${match[1].length} chars`);
    try {
      // Parse object keys
      const dataObj = eval(`(${match[1]})`);
      const subjects = Object.keys(dataObj);
      console.log(`✅ Extracted ${subjects.length} Subjects from rawBookData: ${subjects.join(', ')}`);

      let totalChapters = 0;
      const subjectBreakdown: Record<string, { chapterCount: number; books: string[] }> = {};

      for (const subj of subjects) {
        const chapters = dataObj[subj];
        if (Array.isArray(chapters)) {
          totalChapters += chapters.length;

          const booksSet = new Set<string>();
          for (const ch of chapters) {
            if (ch.book) booksSet.add(ch.book);
          }

          subjectBreakdown[subj] = {
            chapterCount: chapters.length,
            books: Array.from(booksSet)
          };
        }
      }

      console.log(`\n📚 Total Core Chapters Extracted: ${totalChapters}`);
      console.log('\nSubject Breakdown:', JSON.stringify(subjectBreakdown, null, 2));

      // Inspect first chapter keys & content structure
      const firstSubj = subjects[0];
      const firstCh = dataObj[firstSubj][0];
      console.log('\nSample Chapter Object Keys:', Object.keys(firstCh));
      console.log('Sample Chapter Details:', {
        id: firstCh.id,
        chNum: firstCh.chNum,
        subject: firstCh.subject,
        subjectName: firstCh.subjectName,
        book: firstCh.book,
        title: firstCh.title,
        readTime: firstCh.readTime,
        examTags: firstCh.examTags,
        truthSummary: firstCh.truthSummary ? firstCh.truthSummary.substring(0, 100) + '...' : undefined,
        bodySnippet: firstCh.body ? firstCh.body.substring(0, 200) + '...' : undefined
      });

      // Analyze HTML patterns across all 186 chapter bodies!
      let tableCount = 0;
      let mindmapCount = 0;
      let mathjaxCount = 0;
      let inlineStyleCount = 0;
      let trapCount = 0;
      let listCount = 0;

      for (const subj of subjects) {
        for (const ch of dataObj[subj]) {
          const body = ch.body || '';
          if (/<table[\s\S]*?>/i.test(body)) tableCount++;
          if (/mindmap/i.test(body)) mindmapCount++;
          if (/\\\\\(|\\\\\)|\\\\\[|\\\\\]|\$\$/i.test(body)) mathjaxCount++;
          if (/style=["'][^"']+["']/i.test(body)) inlineStyleCount++;
          if (/trap|callout/i.test(body)) trapCount++;
          if (/<ul|<ol/i.test(body)) listCount++;
        }
      }

      console.log('\n📊 Chapter Body Content Pattern Frequencies across all ' + totalChapters + ' chapters:');
      console.log(`   - Chapters containing HTML tables: ${tableCount}`);
      console.log(`   - Chapters containing mindmaps: ${mindmapCount}`);
      console.log(`   - Chapters containing MathJax math: ${mathjaxCount}`);
      console.log(`   - Chapters containing inline styles: ${inlineStyleCount}`);
      console.log(`   - Chapters containing callouts/traps: ${trapCount}`);
      console.log(`   - Chapters containing lists (<ul>/<ol>): ${listCount}`);
    } catch (e: any) {
      console.error('Failed to parse rawBookData:', e.message);
    }
  } else {
    console.error('Could not find rawBookData regex match');
  }
}

inspectRawBookData();
