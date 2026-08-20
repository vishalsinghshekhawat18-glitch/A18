const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'Claude', 'Q4 FY26_Jan to March.md');
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');

let currentSection = null;
let currentSectionCode = null;
const sections = [];
const items = [];

let currentItem = null;

const secHeaderRegex = /^##\s*([0-9🔟1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣]+)?\s*([^\n]+)/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('## ') && !line.startsWith('### ')) {
    const match = line.match(/^##\s*(?:[0-9🔟1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣]+\s*|\s*)(.*)/);
    const secTitle = line.replace(/^##\s*/, '').trim();
    
    // Determine section code SEC1..SEC10
    let secCode = 'SEC1';
    if (secTitle.includes('ESI') || secTitle.includes('FINANCE')) secCode = 'SEC1';
    else if (secTitle.includes('REGULATORY') || secTitle.includes('RBI')) secCode = 'SEC2';
    else if (secTitle.includes('BANKING') || secTitle.includes('SEBI') || secTitle.includes('IRDAI') || secTitle.includes('OTHER REGULATORS')) secCode = 'SEC3';
    else if (secTitle.includes('INDICES') || secTitle.includes('REPORTS') || secTitle.includes('COMMITTEES')) secCode = 'SEC4';
    else if (secTitle.includes('INTERNATIONAL') || secTitle.includes('SUMMITS') || secTitle.includes('MoUs') || secTitle.includes('CONFERENCES')) secCode = 'SEC5';
    else if (secTitle.includes('DEFENCE') || secTitle.includes('SECURITY')) secCode = 'SEC6';
    else if (secTitle.includes('SCIENCE') || secTitle.includes('TECH') || secTitle.includes('ENVIRONMENT')) secCode = 'SEC7';
    else if (secTitle.includes('AWARDS') || secTitle.includes('SPORTS') || secTitle.includes('APPOINTMENTS') || secTitle.includes('DAYS')) secCode = 'SEC8';
    else if (secTitle.includes('PIB') || secTitle.includes('CIRCULARS') || secTitle.includes('PRACTICE')) secCode = 'SEC9';
    else if (secTitle.includes('SCHEMES') || secTitle.includes('GOVERNMENT') || secTitle.includes('MISCELLANEOUS')) secCode = 'SEC10';
    else if (secTitle.includes('REVISION')) secCode = 'SEC11';

    currentSection = {
      title: secTitle,
      code: secCode
    };
    sections.push(currentSection);
    continue;
  }

  // Check for item header: ### 📰 Title or 📰 **Title**
  if (line.startsWith('### 📰 ') || line.startsWith('### ') || line.startsWith('📰 **')) {
    if (currentItem) {
      items.push(currentItem);
    }

    let title = line
      .replace(/^###\s*📰\s*/, '')
      .replace(/^###\s*/, '')
      .replace(/^📰\s*\*\*/, '')
      .replace(/\*\*\s*$/, '')
      .trim();

    // Clean markdown bold or trailing chars from title
    title = title.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();

    currentItem = {
      section: currentSection ? currentSection.code : 'SEC1',
      sectionTitle: currentSection ? currentSection.title : 'ESI & Finance',
      rawTitle: title,
      lines: []
    };
    continue;
  }

  if (currentItem) {
    currentItem.lines.push(line);
  }
}

if (currentItem) {
  items.push(currentItem);
}

console.log(`Found ${sections.length} sections and ${items.length} news items.`);
sections.forEach(s => console.log(`- ${s.code}: ${s.title}`));
console.log('\nSample items:');
items.slice(0, 10).forEach((it, idx) => {
  console.log(`${idx + 1}. [${it.section}] ${it.rawTitle}`);
});
