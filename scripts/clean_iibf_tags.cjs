const fs = require('fs');
const path = require('path');

const corpusDir = path.join(__dirname, '..', 'content', 'corpus');
const iibfFiles = fs.readdirSync(corpusDir).filter(f => f.startsWith('iibf-'));

iibfFiles.forEach(file => {
  const filePath = path.join(corpusDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (data.metadata?.tags) {
    data.metadata.tags = data.metadata.tags.filter(t => t !== 'economics');
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Cleaned tags for ${file}`);
});
