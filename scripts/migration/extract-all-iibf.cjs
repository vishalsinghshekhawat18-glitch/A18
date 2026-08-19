const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function extractAllIIBF() {
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
      const parser = new PDFParse(new Uint8Array(dataBuffer));
      await parser.load();
      const textResult = await parser.getText();
      const extractedText = textResult.text ? textResult.text.trim() : '';

      console.log(`================================================================`);
      console.log(`FILE: ${pdfFile}`);
      console.log(`Characters: ${extractedText.length}`);
      console.log(`Preview:\n${extractedText.slice(0, 350).replace(/\n+/g, ' ')}...\n`);
      
      extractedData[pdfFile] = {
        fileName: pdfFile,
        charCount: extractedText.length,
        text: extractedText
      };
    } catch (e) {
      console.log(`Error parsing ${pdfFile}:`, e.message);
    }
  }

  fs.writeFileSync('content/repairs/iibf_extracted_texts.json', JSON.stringify(extractedData, null, 2), 'utf-8');
  console.log('\n✅ Successfully saved extracted text to content/repairs/iibf_extracted_texts.json');
}

extractAllIIBF();
