/**
 * GKToday Ingestion Pipeline for Jan - Aug 2026
 * Filters high-yield Bank PO Mains topics into 11 Locked Sections.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseArticles(html) {
  const articles = [];
  const postRegex = /<div class="home-post-item">([\s\S]*?)<\/div>\s*<\/div>/gi;
  let match;
  while ((match = postRegex.exec(html)) !== null) {
    const block = match[1];
    const titleMatch = block.match(/<h3>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h3>/i);
    const dateMatch = block.match(/<i class="fa fa-calendar"[^>]*><\/i>\s*([A-Za-z0-9, ]+)/i);
    const catMatch = block.match(/<i class="fa-regular fa-folder"><\/i>\s*<a[^>]*>([\s\S]*?)<\/a>/i);
    
    if (titleMatch && dateMatch) {
      const url = titleMatch[1];
      const title = titleMatch[2].replace(/<[^>]+>/g, '').trim();
      const dateStr = dateMatch[1].trim();
      const category = catMatch ? catMatch[1].replace(/<[^>]+>/g, '').trim() : 'General';
      articles.push({ url, title, dateStr, category });
    }
  }
  return articles;
}

async function main() {
  console.log('Fetching GKToday category feeds...');
  const categories = [
    'economy-current-affairs',
    'government-schemes',
    'reports-indices-current-affairs',
    'appointments-current-affairs',
    'national-current-affairs',
    'international-current-affairs',
    'science-technology-current-affairs',
    'defence-current-affairs',
    'awards-honours-current-affairs',
    'environment-current-affairs'
  ];

  const allArticles = [];
  for (const cat of categories) {
    for (let page = 1; page <= 3; page++) {
      const url = page === 1 
        ? `https://www.gktoday.in/current-affairs/category/${cat}/`
        : `https://www.gktoday.in/current-affairs/category/${cat}/page/${page}/`;
      try {
        console.log(`Fetching ${url}...`);
        const html = await fetchUrl(url);
        const arts = parseArticles(html);
        arts.forEach(a => {
          if (!allArticles.some(existing => existing.url === a.url)) {
            allArticles.push({ ...a, categoryType: cat });
          }
        });
      } catch (err) {
        console.warn(`Could not fetch ${url}:`, err.message);
      }
    }
  }

  console.log(`Total unique articles fetched: ${allArticles.length}`);
  fs.writeFileSync('content/repairs/gktoday_raw_articles.json', JSON.stringify(allArticles, null, 2), 'utf-8');
}

main().catch(console.error);
