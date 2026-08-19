const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function inspectAllIIBF() {
  const iibfDir = path.resolve('IIBF');
  const files = fs.readdirSync(iibfDir);
  
  const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));
  const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));

  console.log(`Found ${pdfFiles.length} PDFs and ${pngFiles.length} PNGs in IIBF folder.\n`);

  const extractedData = {};

  for (const pdfFile of pdfFiles) {
    const filePath = path.join(iibfDir, pdfFile);
    const dataBuffer = fs.readFileSync(filePath);
    try {
      const data = await pdfParse(dataBuffer);
      console.log(`================================================================`);
      console.log(`FILE: ${pdfFile}`);
      console.log(`Pages: ${data.numpages} | Characters: ${data.text.length}`);
      console.log(`Snippet:\n${data.text.trim().slice(0, 400)}...\n`);
      
      extractedData[pdfFile] = {
        pages: data.numpages,
        charCount: data.text.length,
        text: data.text.trim()
      };
    } catch (e) {
      console.log(`Error parsing ${pdfFile}:`, e.message);
    }
  }

  fs.writeFileSync('content/repairs/iibf_extracted_texts.json', JSON.stringify(extractedData, null, 2), 'utf-8');
  console.log('\n✅ Successfully saved extracted text to content/repairs/iibf_extracted_texts.json');
}

inspectAllIIBF();
