// scripts/data-import/import-testimonies-to-xata.ts
import { getXataClient } from '../../src/db/xata/xata';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as glob from 'glob';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });

// Verify API Key is loaded
if (!process.env.XATA_API_KEY) {
  console.error('Error: XATA_API_KEY environment variable is not set');
  process.exit(1);
}

// ES Module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the testimonies directory
const TESTIMONIES_DIR = path.join(__dirname, '../../docs/testimonies');

// Define interfaces for data structures
interface PersonnelData {
  name: string;
  role?: string;
  bio?: string;
  authorityMetrics?: {
    rank?: number;
    credibility?: number;
    scientificAuthority?: number;
    publicRecognition?: number;
  };
}

interface EventData {
  title: string;
  location?: string;
  date?: string;
  description?: string;
  details?: string[];
}

interface ArtifactData {
  name: string;
  description?: string;
  origin?: string;
  currentLocation?: string;
}

interface OrganizationData {
  name: string;
  description?: string;
  details?: string[];
}

interface TestimonyData {
  title: string;
  youtubeUrl: string;
  personnel: PersonnelData[];
  events: EventData[];
  artifacts: ArtifactData[];
  organizations: OrganizationData[];
  highlights: string[];
  claims: string[];
  source?: string;
  context?: string;
  summary?: string;
}

// Parse the PERSONNEL section
function parsePersonnelSection(content: string): PersonnelData | null {
  const nameMatch = content.match(/Name:\s*([^\n]+)/);
  const roleMatch = content.match(/Role:\s*([^\n]+)/);
  const bioMatch = content.match(/Bio:\s*([\s\S]*?)(?:Authority Metrics:|$)/);
  
  const rankMatch = content.match(/Rank:\s*(\d+)/);
  const credibilityMatch = content.match(/Credibility:\s*(\d+)/);
  const scientificAuthorityMatch = content.match(/Scientific Authority:\s*(\d+)/);
  const publicRecognitionMatch = content.match(/Public Recognition:\s*(\d+)/);
  
  if (!nameMatch) return null;
  
  return {
    name: nameMatch[1].trim(),
    role: roleMatch ? roleMatch[1].trim() : undefined,
    bio: bioMatch ? bioMatch[1].trim() : undefined,
    authorityMetrics: {
      rank: rankMatch ? parseInt(rankMatch[1]) : undefined,
      credibility: credibilityMatch ? parseInt(credibilityMatch[1]) : undefined,
      scientificAuthority: scientificAuthorityMatch ? parseInt(scientificAuthorityMatch[1]) : undefined,
      publicRecognition: publicRecognitionMatch ? parseInt(publicRecognitionMatch[1]) : undefined
    }
  };
}

// Parse the Key Personnel section (alternative format)
function parseKeyPersonnelSection(content: string): PersonnelData | null {
  const nameMatch = content.match(/Name:\s*([^\n]+)/);
  const roleMatch = content.match(/Role:\s*([^\n]+)/);
  const bioMatch = content.match(/Bio:\s*([\s\S]*?)(?:Authority Metrics:|$)/);
  
  // Match authority metrics in different formats
  const authorityRegex = /(?:Authority Metrics:|Authority):\s*([\s\S]*?)(?:\n\n|\n[A-Z]|$)/;
  const authorityMatch = content.match(authorityRegex);
  
  if (!nameMatch) return null;
  
  const authority: PersonnelData['authorityMetrics'] = {};
  
  if (authorityMatch) {
    const authorityText = authorityMatch[1];
    
    const rankMatch = authorityText.match(/Rank:\s*(\d+)/);
    const credibilityMatch = authorityText.match(/Credibility:\s*(\d+)/);
    const scientificMatch = authorityText.match(/Scientific Authority:\s*(\d+)/);
    const publicMatch = authorityText.match(/Public Recognition:\s*(\d+)/);
    
    if (rankMatch) authority.rank = parseInt(rankMatch[1]);
    if (credibilityMatch) authority.credibility = parseInt(credibilityMatch[1]);
    if (scientificMatch) authority.scientificAuthority = parseInt(scientificMatch[1]);
    if (publicMatch) authority.publicRecognition = parseInt(publicMatch[1]);
  }
  
  return {
    name: nameMatch[1].trim(),
    role: roleMatch ? roleMatch[1].trim() : undefined,
    bio: bioMatch ? bioMatch[1].trim() : undefined,
    authorityMetrics: authority
  };
}

// Parse the EVENTS section
function parseEventsSection(content: string): EventData[] {
  const events: EventData[] = [];
  
  // Split the content into individual event entries
  // Events are typically numbered or have clear headers
  const eventRegex = /\d+\.\s+(.*?)(?:\n|$)([\s\S]*?)(?=\d+\.\s+|\n\n\d+\.|$)/g;
  let match;
  
  while ((match = eventRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const details = match[2].trim();
    
    const locationMatch = details.match(/Location:\s*([^\n]+)/);
    const dateMatch = details.match(/Date:\s*([^\n]+)/);
    const descriptionMatch = details.match(/Description:\s*([\s\S]*?)(?:Key Details:|$)/);
    
    const event: EventData = {
      title,
      location: locationMatch ? locationMatch[1].trim() : undefined,
      date: dateMatch ? dateMatch[1].trim() : undefined,
      description: descriptionMatch ? descriptionMatch[1].trim() : undefined,
      details: []
    };
    
    // Extract key details if present
    const keyDetailsMatch = details.match(/Key Details:([\s\S]*?)$/);
    if (keyDetailsMatch) {
      event.details = keyDetailsMatch[1]
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(Boolean);
    }
    
    events.push(event);
  }
  
  // If no events were found with the numbered pattern, try a more general approach
  if (events.length === 0) {
    // Split by blank lines and see if we can identify events
    const sections = content.split(/\n\n+/);
    
    for (const section of sections) {
      const lines = section.split('\n').filter(Boolean);
      
      if (lines.length > 0 && !lines[0].match(/^\d+\./)) {
        // Extract event title from the first line if it looks like a header
        const title = lines[0].replace(/:\s*$/, '').trim();
        if (title) {
          events.push({
            title,
            description: lines.slice(1).join('\n'),
            details: []
          });
        }
      }
    }
  }
  
  return events;
}

// Parse the ARTIFACTS section
function parseArtifactsSection(content: string): ArtifactData[] {
  const artifacts: ArtifactData[] = [];
  
  // Split the content into individual artifact entries
  const artifactRegex = /\d+\.\s+(.*?)(?:\n|$)([\s\S]*?)(?=\d+\.\s+|\n\n\d+\.|$)/g;
  let match;
  
  while ((match = artifactRegex.exec(content)) !== null) {
    const name = match[1].trim();
    const details = match[2].trim();
    
    const descriptionMatch = details.match(/Description:\s*([\s\S]*?)(?:\n\nOrigin:|$)/);
    const originMatch = details.match(/Origin:\s*([^\n]+)/);
    const locationMatch = details.match(/Current Location:\s*([^\n]+)/);
    
    artifacts.push({
      name,
      description: descriptionMatch ? descriptionMatch[1].trim() : undefined,
      origin: originMatch ? originMatch[1].trim() : undefined,
      currentLocation: locationMatch ? locationMatch[1].trim() : undefined
    });
  }
  
  return artifacts;
}

// Parse the ORGANIZATIONS section
function parseOrganizationsSection(content: string): OrganizationData[] {
  const organizations: OrganizationData[] = [];
  
  // Split the content into individual organization entries
  const orgRegex = /\d+\.\s+(.*?)(?:\n|$)([\s\S]*?)(?=\d+\.\s+|\n\n\d+\.|$)/g;
  let match;
  
  while ((match = orgRegex.exec(content)) !== null) {
    const name = match[1].trim();
    const details = match[2].trim();
    
    const descriptionMatch = details.match(/Description:\s*([\s\S]*?)(?:Role:|$)/);
    
    organizations.push({
      name,
      description: descriptionMatch ? descriptionMatch[1].trim() : details,
      details: []
    });
  }
  
  // If no organizations were found with the numbered pattern, try a more general approach
  if (organizations.length === 0) {
    // Split by blank lines and see if we can identify organizations
    const sections = content.split(/\n\n+/);
    
    for (const section of sections) {
      const lines = section.split('\n').filter(Boolean);
      
      if (lines.length > 0 && !lines[0].match(/^\d+\./)) {
        // Extract organization name from the first line if it looks like a header
        const name = lines[0].replace(/:\s*$/, '').trim();
        if (name) {
          organizations.push({
            name,
            description: lines.slice(1).join('\n'),
            details: []
          });
        }
      }
    }
  }
  
  return organizations;
}

// Parse the TESTIMONY HIGHLIGHTS section
function parseHighlightsSection(content: string): string[] {
  const highlights: string[] = [];
  
  // Extract bullet points or numbered items
  const bulletPointRegex = /(?:^|\n)[-•]\s*(.*?)(?=\n[-•]|\n\n|$)/g;
  let match;
  
  while ((match = bulletPointRegex.exec(content)) !== null) {
    if (match[1] && match[1].trim()) {
      highlights.push(match[1].trim());
    }
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
  if (highlights.length === 0) {
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    
    for (const line of lines) {
      // Exclude lines that are likely headers or metadata
      if (!line.includes(':') && line.length > 10) {
        highlights.push(line);
      }
    }
  }
  
  return highlights;
}

// Find all summary files in the testimonies directory
function findSummaryFiles(): string[] {
  // Use glob to find all summary.md files
  const filePattern = path.join(TESTIMONIES_DIR, '**/*Summary.md');
  const files = glob.sync(filePattern);
  return files;
}

// Process a section of the research analysis
function processSection(testimonyData: TestimonyData, sectionName: string, content: string[]): void {
  const sectionText = content.join('\n');
  
  switch (sectionName.toUpperCase()) {
    case 'PERSONNEL':
      const personnel = parsePersonnelSection(sectionText);
      if (personnel) {
        testimonyData.personnel.push(personnel);
      }
      break;
    
    case 'EVENTS':
      const events = parseEventsSection(sectionText);
      testimonyData.events.push(...events);
      break;
    
    case 'ARTIFACTS':
      const artifacts = parseArtifactsSection(sectionText);
      testimonyData.artifacts.push(...artifacts);
      break;
    
    case 'ORGANIZATIONS':
      const organizations = parseOrganizationsSection(sectionText);
      testimonyData.organizations.push(...organizations);
      break;
    
    case 'TESTIMONY HIGHLIGHTS':
      const highlights = parseHighlightsSection(sectionText);
      testimonyData.highlights.push(...highlights);
      break;
      
    case 'KEY PERSONNEL':
      const keyPersonnel = parseKeyPersonnelSection(sectionText);
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

// Parse a testimony summary file
function parseSummaryFile(filePath: string): TestimonyData | null {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Initialize the testimony data structure
    const testimonyData: TestimonyData = {
      title: '',
      youtubeUrl: '',
      personnel: [],
      events: [],
      artifacts: [],
      organizations: [],
      highlights: [],
      claims: []
    };

    // Extract title and YouTube URL
    if (lines.length > 0) {
      testimonyData.title = lines[0].trim();
    }
    
    // Find the YouTube URL if present
    const youtubeUrlLine = lines.find(line => line.includes('youtube.com') || line.includes('youtu.be'));
    if (youtubeUrlLine) {
      testimonyData.youtubeUrl = youtubeUrlLine.trim();
    }

    // Parse the research analysis sections
    let currentSection = '';
    let sectionContent: string[] = [];
    let inResearchAnalysis = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if we're entering or exiting the research analysis section
      if (line.includes('=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===')) {
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
      
      if (inResearchAnalysis) {
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
      }
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
    
    return testimonyData;
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
    return null;
  }
}

// Data quality validation function
function validateDataQuality(testimony: TestimonyData): {
  isValid: boolean;
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 100; // Start with a perfect score
  
  // Check for required fields
  if (!testimony.title || testimony.title.length < 5) {
    issues.push('Missing or too short title');
    score -= 20;
  }
  
  if (!testimony.youtubeUrl || !testimony.youtubeUrl.includes('youtube')) {
    issues.push('Missing or invalid YouTube URL');
    score -= 10;
  }
  
  // Check for personnel
  if (testimony.personnel.length === 0) {
    issues.push('No personnel data extracted');
    score -= 15;
  } else {
    // Check if personnel data is complete
    const incompletePersonnel = testimony.personnel.filter(p => !p.role || !p.bio);
    if (incompletePersonnel.length > 0) {
      issues.push('Some personnel have incomplete data');
      score -= 5;
    }
  }
  
  // Check for events
  if (testimony.events.length === 0) {
    issues.push('No events data extracted');
    score -= 15;
  } else {
    // Check if events data is complete
    const incompleteEvents = testimony.events.filter(e => !e.description);
    if (incompleteEvents.length > 0) {
      issues.push('Some events have incomplete data');
      score -= 5;
    }
  }
  
  // Check for organizations
  if (testimony.organizations.length === 0) {
    issues.push('No organizations data extracted');
    score -= 10;
  }
  
  // Check for highlights
  if (testimony.highlights.length === 0 && testimony.claims.length === 0) {
    issues.push('No highlights or claims data extracted');
    score -= 10;
  }
  
  return {
    isValid: score >= 50, // Consider valid if at least 50% quality
    score,
    issues
  };
}

// Check for duplicate testimonies in the database
async function checkForDuplicates(
  xata: ReturnType<typeof getXataClient>, 
  testimony: TestimonyData
): Promise<{ isDuplicate: boolean; method: string; existingId?: string }> {
  // Try to find exact match by title
  if (testimony.title) {
    try {
      const titleMatch = await xata.db.testimonies
        .filter({ title: testimony.title })
        .getFirst();
      
      if (titleMatch) {
        return { 
          isDuplicate: true, 
          method: 'exact title match',
          existingId: titleMatch.id
        };
      }
    } catch (error) {
      console.error('Error checking for title duplicate:', error);
    }
  }
  
  // Try to find by YouTube URL
  if (testimony.youtubeUrl) {
    try {
      const urlMatch = await xata.db.testimonies
        .filter({ source: testimony.youtubeUrl })
        .getFirst();
      
      if (urlMatch) {
        return { 
          isDuplicate: true, 
          method: 'URL match',
          existingId: urlMatch.id
        };
      }
    } catch (error) {
      console.error('Error checking for URL duplicate:', error);
    }
  }
  
  // Try to find by similarity in key fields
  try {
    // Extract a significant phrase from the title
    const titleFragment = testimony.title.split(' ').slice(0, 3).join(' ');
    
    if (titleFragment.length > 10) {
      const fragmentMatches = await xata.db.testimonies
        .search(titleFragment, { fuzziness: 1 })
        .getMany();
      
      if (fragmentMatches.length > 0) {
        return { 
          isDuplicate: true, 
          method: 'fuzzy title match',
          existingId: fragmentMatches[0].id
        };
      }
    }
  } catch (error) {
    console.error('Error checking for similar testimony:', error);
  }
  
  return { isDuplicate: false, method: 'none' };
}

// Create or get a personnel record by name
async function createOrGetPersonnel(
  xata: ReturnType<typeof getXataClient>, 
  personnel: PersonnelData
): Promise<string | null> {
  try {
    // Try to find existing personnel by name
    const existingPersonnel = await xata.db.personnel
      .filter({ name: personnel.name })
      .getFirst();
    
    if (existingPersonnel) {
      return existingPersonnel.id;
    }
    
    // Create new personnel record
    const newPersonnel = await xata.db.personnel.create({
      name: personnel.name,
      role: personnel.role,
      bio: personnel.bio,
      rank: personnel.authorityMetrics?.rank,
      credibility: personnel.authorityMetrics?.credibility,
    });
    
    return newPersonnel.id;
  } catch (error) {
    console.error(`Error creating/getting personnel record for ${personnel.name}:`, error);
    return null;
  }
}

// Create or get an event record by title
async function createOrGetEvent(
  xata: ReturnType<typeof getXataClient>, 
  event: EventData
): Promise<string | null> {
  try {
    // Try to find existing event by title
    const existingEvent = await xata.db.events
      .filter({ title: event.title })
      .getFirst();
    
    if (existingEvent) {
      return existingEvent.id;
    }
    
    // Parse date if available
    let eventDate: Date | undefined = undefined;
    if (event.date) {
      try {
        // Handle various date formats
        eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) {
          eventDate = undefined;
        }
      } catch (e) {
        // Invalid date format, ignore
      }
    }
    
    // Create new event record
    const newEvent = await xata.db.events.create({
      title: event.title,
      name: event.title,
      description: event.description,
      location: event.location,
      date: eventDate,
      metadata: { details: event.details }
    });
    
    return newEvent.id;
  } catch (error) {
    console.error(`Error creating/getting event record for ${event.title}:`, error);
    return null;
  }
}

// Create or get an organization record by name
async function createOrGetOrganization(
  xata: ReturnType<typeof getXataClient>, 
  organization: OrganizationData
): Promise<string | null> {
  try {
    // Try to find existing organization by name
    const existingOrg = await xata.db.organizations
      .filter({ name: organization.name })
      .getFirst();
    
    if (existingOrg) {
      return existingOrg.id;
    }
    
    // Create new organization record
    const newOrg = await xata.db.organizations.create({
      name: organization.name,
      title: organization.name,
      description: organization.description
    });
    
    return newOrg.id;
  } catch (error) {
    console.error(`Error creating/getting organization record for ${organization.name}:`, error);
    return null;
  }
}

// Main function to import testimonies to Xata
async function importTestimoniesToXata(options: { 
  forceImport: boolean;
  minQualityScore: number;
  skipDuplicates: boolean;
  updateExisting: boolean;
}) {
  console.log('Initializing Xata client...');
  const xata = getXataClient();
  console.log('Xata client initialized successfully.');
  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;
  let poorQualityCount = 0;
  let updatedCount = 0;
  
  // Find all testimony summary files
  const summaryFiles = findSummaryFiles();
  const skippedTestimonies: Array<{ title: string; reason: string }> = [];
  const qualityReport: Array<{ title: string; score: number; issues: string[] }> = [];
  
  console.log(`Found ${summaryFiles.length} testimony summary files`);
  console.log(`Minimum quality score: ${options.minQualityScore}/100`);
  console.log(options.forceImport 
    ? "FORCE IMPORT MODE: Will import even if duplicates are detected" 
    : (options.skipDuplicates ? "Normal mode: Will skip duplicates" : "Will check duplicates but import anyway"));

  // Process each summary file
  for (const file of summaryFiles) {
    const fileName = path.basename(file);
    console.log(`Processing ${fileName}...`);
    
    // Parse the summary file
    const testimony = parseSummaryFile(file);
    if (!testimony) {
      console.error(`Failed to parse ${fileName}`);
      errorCount++;
      continue;
    }
    
    // Validate the testimony data quality
    const qualityResult = validateDataQuality(testimony);
    qualityReport.push({
      title: testimony.title,
      score: qualityResult.score,
      issues: qualityResult.issues
    });
    
    // Skip poor quality testimonies
    if (!qualityResult.isValid && qualityResult.score < options.minQualityScore) {
      console.log(`Skipping poor quality testimony: ${testimony.title} (quality score: ${qualityResult.score}/100)`);
      skippedTestimonies.push({
        title: testimony.title,
        reason: `Poor quality score: ${qualityResult.score}/100. Issues: ${qualityResult.issues.join(', ')}`
      });
      poorQualityCount++;
      continue;
    }
    
    // Set source to YouTube URL if available
    if (testimony.youtubeUrl) {
      testimony.source = testimony.youtubeUrl;
    }
    
    // Check for duplicates
    const { isDuplicate, method, existingId } = await checkForDuplicates(xata, testimony);
    
    if (isDuplicate && options.skipDuplicates && !options.forceImport) {
      console.log(`Skipping duplicate testimony: ${testimony.title} (detected by: ${method})`);
      skippedTestimonies.push({
        title: testimony.title,
        reason: `Duplicate (detected by: ${method})`
      });
      duplicateCount++;
      continue;
    } else if (isDuplicate && options.updateExisting && existingId) {
      console.log(`Updating existing testimony: ${testimony.title}`);
      
      // Update the existing testimony record
      await xata.db.testimonies.update(existingId, {
        summary: testimony.summary || testimony.title,
        context: testimony.context || '',
        claim: testimony.claims.join('\n'),
        source: testimony.source || '',
      });
      
      updatedCount++;
      continue;
    }
    
    try {
      // Create main testimony record
      const testimonyRecord = await xata.db.testimonies.create({
        title: testimony.title,
        summary: testimony.summary || testimony.title,
        context: testimony.context || '',
        claim: testimony.claims.join('\n'),
        source: testimony.source || '',
      });
      
      if (!testimonyRecord || !testimonyRecord.id) {
        throw new Error('Failed to create testimony record');
      }
      
      // Process personnel records
      for (const personnel of testimony.personnel) {
        const personnelId = await createOrGetPersonnel(xata, personnel);
        if (personnelId) {
          // Set as witness
          await xata.db.testimonies.update(testimonyRecord.id, {
            witness: {
              id: personnelId
            }
          });
        }
      }
      
      // Process event records
      for (const event of testimony.events) {
        const eventId = await createOrGetEvent(xata, event);
        if (eventId) {
          // Set as event
          await xata.db.testimonies.update(testimonyRecord.id, {
            event: {
              id: eventId
            }
          });
          
          // Connect with personnel if available
          if (testimony.personnel.length > 0) {
            for (const personnel of testimony.personnel) {
              const personnelId = await createOrGetPersonnel(xata, personnel);
              if (personnelId) {
                // Create event-subject-matter-experts record
                await xata.db["event-subject-matter-experts"].create({
                  event: { id: eventId },
                  "subject-matter-expert": { id: personnelId }
                });
              }
            }
          }
        }
      }
      
      // Process organization records
      for (const organization of testimony.organizations) {
        const orgId = await createOrGetOrganization(xata, organization);
        if (orgId) {
          // Set as organization
          await xata.db.testimonies.update(testimonyRecord.id, {
            organization: {
              id: orgId
            }
          });
          
          // Connect with personnel if available
          if (testimony.personnel.length > 0) {
            for (const personnel of testimony.personnel) {
              const personnelId = await createOrGetPersonnel(xata, personnel);
              if (personnelId) {
                // Create organization-members record
                await xata.db["organization-members"].create({
                  member: { id: personnelId },
                  organization: { id: orgId }
                });
              }
            }
          }
        }
      }
      
      successCount++;
      console.log(`Successfully imported: ${testimony.title}`);
    } catch (error) {
      console.error(`Error importing testimony ${testimony.title}:`, error);
      errorCount++;
    }
  }
  
  // Write reports
  fs.writeFileSync(
    path.join(__dirname, 'testimony-quality-report.json'),
    JSON.stringify(qualityReport, null, 2)
  );
  
  fs.writeFileSync(
    path.join(__dirname, 'skipped-testimonies-report.json'),
    JSON.stringify(skippedTestimonies, null, 2)
  );
  
  // Print summary
  console.log('\nImport Summary:');
  console.log(`Total testimony files: ${summaryFiles.length}`);
  console.log(`Successfully imported: ${successCount}`);
  console.log(`Failed to import: ${errorCount}`);
  console.log(`Duplicates skipped: ${duplicateCount}`);
  console.log(`Poor quality skipped: ${poorQualityCount}`);
  console.log(`Records updated: ${updatedCount}`);
  
  console.log(`\nDetailed reports written to:`);
  console.log(`- ${path.join(__dirname, 'testimony-quality-report.json')}`);
  console.log(`- ${path.join(__dirname, 'skipped-testimonies-report.json')}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const forceImport = args.includes('--force') || args.includes('-f');
const minQualityScore = args.includes('--min-quality') ? 
  parseInt(args[args.indexOf('--min-quality') + 1] || '50', 10) : 50;
const updateExisting = args.includes('--update') || args.includes('-u');
const skipDuplicates = !args.includes('--no-skip-duplicates');

// Display help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: npm run import-testimonies [options]

Options:
  --force, -f                 Force import even if duplicates are detected
  --min-quality <score>       Set minimum quality threshold (default: 50)
  --update, -u                Update existing records if duplicates are found
  --no-skip-duplicates        Check duplicates but import anyway
  --help, -h                  Show this help message
`);
  process.exit(0);
}

// Run the import with options
importTestimoniesToXata({ 
  forceImport,
  minQualityScore,
  skipDuplicates,
  updateExisting
})
  .then(() => console.log('Import completed successfully'))
  .catch(err => {
    console.error('Import failed:', err);
    process.exit(1);
  });
