const fs = require('fs');
const path = require('path');

// Simple CSV parser
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const record = {};
    headers.forEach((header, index) => {
      if (values[index] && values[index] !== '' && values[index] !== 'NULL') {
        record[header] = values[index];
      }
    });
    if (Object.keys(record).length > 1) records.push(record);
  }
  
  return records;
}

// Test with users.csv
const csvPath = '/Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/app/scripts/xata-exports/exports/users.csv';
const content = fs.readFileSync(csvPath, 'utf-8');
const records = parseCSV(content);

console.log('📊 Users CSV Analysis:');
console.log(`Records found: ${records.length}`);
if (records[0]) {
  console.log('Sample record:', records[0]);
}

// Next: Add Xata import logic
console.log('\n🔄 Ready to import to Xata database');