// scripts/data-import/testimonies/extract-single-testimony.ts
import fs from 'fs';

// Simple function to extract basic testimony data from a file
function extractTestimony(filePath: string): any {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Basic testimony data
    const testimony = {
      title: '',
      youtubeUrl: '',
      summary: '',
      personnel: [],
      events: [],
      organizations: []
    };

    // Extract title (first line)
    if (lines.length > 0) {
      testimony.title = lines[0].trim();
    }
    
    // Find YouTube URL
    const youtubeUrlLine = lines.find(line => 
      line.includes('youtube.com') || line.includes('youtu.be'));
    if (youtubeUrlLine) {
      testimony.youtubeUrl = youtubeUrlLine.trim();
    }

    // Extract personnel mentions
    const personnelSection = content.match(/PERSONNEL:([\s\S]*?)(?=\n\n[A-Z]|$)/i);
    if (personnelSection && personnelSection[1]) {
      const nameMatches = personnelSection[1].match(/Name:\s*([^\n]+)/g);
      if (nameMatches) {
        testimony.personnel = nameMatches.map(match => {
          const name = match.replace(/Name:\s*/, '').trim();
          return { name };
        });
      }
    }

    // Extract summary
    testimony.summary = testimony.title;
    
    return testimony;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

// Main function to extract testimony and save to output file
async function main() {
  // Check command line arguments
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: extract-single-testimony.ts <input-file> <output-file>');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1];

  // Extract testimony data
  console.log(`Processing: ${inputFile}`);
  const testimony = extractTestimony(inputFile);

  if (!testimony) {
    console.error('Failed to extract testimony data');
    process.exit(1);
  }

  // Write to output file
  try {
    fs.writeFileSync(outputFile, JSON.stringify(testimony, null, 2));
    console.log(`Successfully extracted testimony data to: ${outputFile}`);
  } catch (error) {
    console.error(`Error writing to output file ${outputFile}:`, error);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
