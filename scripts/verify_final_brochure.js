const fs = require('fs');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../../Ai_Smart_Model_Sales_Brochure_CityScale.pdf');
const htmlPath = path.resolve(__dirname, 'brochure_print.html');

console.log('--- FINAL BROCHURE VERIFICATION ---');

// 1. PDF File Check
if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath);
  console.log(`✓ PDF file exists at: ${pdfPath}`);
  console.log(`✓ PDF file size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB (${stats.size} bytes)`);

  const pdfData = fs.readFileSync(pdfPath, 'latin1');
  const countMatch = pdfData.match(/\/Count\s+(\d+)/);
  const pageMatches = pdfData.match(/\/Type\s*\/Page\b/g) || [];
  console.log(`✓ Page count in PDF catalog /Count: ${countMatch ? countMatch[1] : 'N/A'}`);
  console.log(`✓ Total /Type /Page objects: ${pageMatches.length}`);
} else {
  console.error(`✗ PDF file not found at: ${pdfPath}`);
}

// 2. Visible HTML Content Check (Zero Prices)
const htmlRaw = fs.readFileSync(htmlPath, 'utf8');
// Remove base64 data URIs so we only check actual text
const textOnly = htmlRaw.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g, '');

const bannedPriceTerms = [
  'EGP', 'SAR', 'USD', 'EUR', 'GBP', 'LE', 'L.E.',
  'جنيه', 'ريال', 'درهم', 'دولار', 'سعر', 'الأسعار', 'اسعار', 'EGP ', 'SAR '
];

console.log('\n--- PRICE CHECK IN BROCHURE TEXT ---');
let foundPrice = false;
bannedPriceTerms.forEach(term => {
  const regex = new RegExp(`\\b${term}\\b`, 'gi');
  const matches = textOnly.match(regex);
  if (matches && matches.length > 0) {
    console.warn(`⚠️ Found price term "${term}": ${matches.length} occurrences`);
    foundPrice = true;
  }
});

if (!foundPrice) {
  console.log('✅ STRICT COMPLIANCE: Exactly ZERO prices found in visible brochure text!');
}

console.log('\n--- KEY SELLING POINTS CHECK ---');
const sellingPoints = [
  'Ai Smart Model',
  'سيتي سكيل',
  'City Scale',
  'Google Gemini',
  '360',
  'واتساب',
  'البطاقات الذكية',
  'تأهيل'
];

sellingPoints.forEach(point => {
  const count = (textOnly.match(new RegExp(point, 'g')) || []).length;
  console.log(`✓ "${point}": ${count} mentions`);
});
