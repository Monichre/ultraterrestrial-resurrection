      // Skip poor quality testimonies
      if (!qualityResult.isValid && qualityResult.score < options.minQualityScore) {
        inResearchAnalysis = true;
        currentSection = '';
        sectionContent = [];
        continue;
      } else if (line.includes('=== ORIGINAL CONTENT ===')) {
        // Process the last section if needed
        if (currentSection && sectionContent.length > 0) {
          processSection(testimonyData, currentSection, sectionContent);
        }
        inResearchAnalysis = false;
        break;
      }
      
      if (isDuplicate && options.skipDuplicates && !options.forceImport) {
        // Check for section headers
        if (line.match(/^[A-Z]+:$/) || line.match(/^[A-Z\s]+:$/)) {
          // Process the previous section if there was one
          if (currentSection && sectionContent.length > 0) {
            processSection(testimonyData, currentSection, sectionContent);
          }
          
          // Start a new section
          currentSection = line.replace(/:\s*$/, '');
          sectionContent = [];
        } else if (currentSection) {
          // Add line to current section
          sectionContent.push(line);
        }
      } else if (isDuplicate && options.updateExisting && existingId) {
    }
    
    // Process the last section if needed
    if (inResearchAnalysis && currentSection && sectionContent.length > 0) {
      processSection(testimonyData, currentSection, sectionContent);
    }
    
    // Extract claims from the testimony
    const claimSection = content.match(/TESTIMONY HIGHLIGHTS:([\s\S]*?)(?:===|$)/);
    if (claimSection && claimSection[1]) {
      const claimLines = claimSection[1].split('\n').filter(line => 
        line.trim().startsWith('-') || 
        line.trim().startsWith('•') || 
        line.trim().match(/^\d+\.\s/)
      );
      testimonyData.claims = claimLines.map(line => 
        line.replace(/^[-•\d\.]\s*/, '').trim()
      ).filter(Boolean);
    }
  // If no bullet points found, try numbered items
  if (highlights.length === 0) {
    const numberedRegex = /(?:^|\n)\d+\.\s*(.*?)(?=\n\d+\.|\n\n|$)/g;
    
    while ((match = numberedRegex.exec(content)) !== null) {
      if (match[1] && match[1].trim()) {
        highlights.push(match[1].trim());
      }
    }
  }
  
  // If still no highlights found, try to split by newlines
  i  console.log(`\nDetailed reports written to:`);
  console.log(`- ${path.join(__dirname, 'testimony-quality-report.json')}`);
  console.log(`- ${path.join(__dirname, 'skipped-testimonies-report.json')}`);
}
f duplicates are detected" 
    : (options.skipDuplicates ? "Normal mode: Will skip duplicates" : "Will check duplicates but import anyway"));
sh(line);
      }
    }
  }
  
  return highlights;
}
  .then(() => console.log('Import completed successfully'))
  .catch(err => {
    console.error('Import failed:', err);
    process.exit(1);
  });
// Helper function to process each section in the research analysis
function processSection(testimonyData: TestimonyData, sectionName: string, content: string[]) {
  const sectionContent = content.join('\n');
  
  switch (sectionName.toUpperCase()) {
    case 'PERSONNEL':
      const personnel = parsePersonnelSection(sectionContent);
      if (personnel) {
        testimonyData.personnel.push(personnel);
      }
      break;
    case 'EVENTS':
      const events = parseEventsSection(sectionContent);
      testimonyData.events.push(...events);
      break;
    case 'ORGANIZATIONS':
      const organizations = parseOrganizationsSection(sectionContent);
      testimonyData.organizations.push(...organizations);
      break;
    case 'ARTIFACTS':
      const artifacts = parseArtifactsSection(sectionContent);
      testimonyData.artifacts.push(...artifacts);
      break;
    case 'TESTIMONY HIGHLIGHTS':
      const highlights = parseHighlightsSection(sectionContent);
      testimonyData.highlights.push(...highlights);
      break;
      const artifacts = parseArtifactsSection(sectionContent);
      testimonyData.artifacts.push(...artifacts);
      break;
    case 'TESTIMONY HIGHLIGHTS':
      const highlights = parseHighlightsSection(sectionContent);
      testimonyData.highlights.push(...highlights);
      break;
    case 'Key Personnel':
      const keyPersonnel = parseKeyPersonnelSection(sectionContent);
      if (keyPersonnel) {
        testimonyData.personnel.push(keyPersonnel);
      }
      break;
    // Add other sections as needed
    default:
      // Handle other sections or ignore
      break;
  }
}
}

// Parse command line arguments
  let duplicateCount = 0;
  let poorQualityCount = 0;
  let updatedCount = 0;
