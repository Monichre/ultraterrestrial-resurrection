import { 
  askXata, 
  askXataWithAi, 
  askFollowUp, 
  askStream,
  ufoResearch,
  type AskResponseWithRecords 
} from "@db/src/xata-typescript-sdk/api";

/**
 * Example 1: Basic UFO Credibility Research
 */
export const credibilityResearchExample = async () => {
  console.log("🔬 Starting UFO Credibility Research");
  
  try {
    const result = await ufoResearch.askCredibilityAnalysis(
      'events',
      'What are the most scientifically documented UFO cases with multiple independent witnesses?',
      {
        includeDebunked: false,
        minCredibilityScore: 7
      }
    );

    console.log("📋 Analysis Result:");
    console.log("Answer:", result.answer);
    console.log(`Found ${result.records.length} high-credibility cases`);
    
    // Display top 3 cases
    result.records.slice(0, 3).forEach((record, index) => {
      console.log(`\n🛸 Case ${index + 1}: ${record.name}`);
      console.log(`📍 Location: ${record.location}`);
      console.log(`📅 Date: ${record.date}`);
      console.log(`🎯 Credibility: ${record.credibility_score || 'N/A'}`);
    });

    return result;
  } catch (error) {
    console.error("❌ Error in credibility research:", error);
  }
};

/**
 * Example 2: Government Disclosure Investigation
 */
export const governmentDisclosureExample = async () => {
  console.log("🏛️ Starting Government Disclosure Investigation");
  
  try {
    const result = await ufoResearch.askGovernmentDisclosure(
      'events',
      'Which UFO cases led to official government acknowledgment or policy changes?',
      {
        includeClassified: false,
        officialOnly: true
      }
    );

    console.log("📄 Disclosure Analysis:");
    console.log("Answer:", result.answer);
    
    // Focus on officially acknowledged cases
    const officialCases = result.records.filter(record => 
      record.government_involvement === 'confirmed'
    );
    
    console.log(`\n🏢 Found ${officialCases.length} officially acknowledged cases:`);
    officialCases.forEach(record => {
      console.log(`• ${record.name} (${record.date})`);
      console.log(`  Status: ${record.classification_status || 'Unknown'}`);
    });

    return result;
  } catch (error) {
    console.error("❌ Error in government disclosure research:", error);
  }
};

/**
 * Example 3: Historical Timeline Analysis
 */
export const historicalTimelineExample = async () => {
  console.log("📈 Starting Historical Timeline Analysis");
  
  try {
    const result = await ufoResearch.askHistoricalTimeline(
      'events',
      'How have UFO incident characteristics evolved from the 1940s to present day?',
      {
        startYear: 1940,
        endYear: 2024,
        includeAncient: false
      }
    );

    console.log("⏰ Historical Analysis:");
    console.log("Answer:", result.answer);
    
    // Group records by decade
    const recordsByDecade = result.records.reduce((acc, record) => {
      const year = new Date(record.date).getFullYear();
      const decade = Math.floor(year / 10) * 10;
      if (!acc[decade]) acc[decade] = [];
      acc[decade].push(record);
      return acc;
    }, {} as Record<number, typeof result.records>);

    console.log("\n📊 Distribution by Decade:");
    Object.entries(recordsByDecade)
      .sort(([a], [b]) => Number(a) - Number(b))
      .forEach(([decade, records]) => {
        console.log(`${decade}s: ${records.length} incidents`);
      });

    return result;
  } catch (error) {
    console.error("❌ Error in historical timeline analysis:", error);
  }
};

/**
 * Example 4: Geographic Pattern Analysis
 */
export const geographicPatternsExample = async () => {
  console.log("🗺️ Starting Geographic Pattern Analysis");
  
  try {
    const result = await ufoResearch.askGeographicPatterns(
      'events',
      'Are there UFO hotspots in the southwestern United States?',
      {
        region: 'United States',
        centerLat: 35.0,
        centerLng: -106.0,
        radius: 500 // 500km radius
      }
    );

    console.log("🎯 Geographic Analysis:");
    console.log("Answer:", result.answer);
    
    // Analyze location distribution
    const locationCounts = result.records.reduce((acc, record) => {
      const location = record.location?.split(',')[0]?.trim() || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\n📍 Top Hotspots:");
    Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([location, count]) => {
        console.log(`${location}: ${count} incidents`);
      });

    return result;
  } catch (error) {
    console.error("❌ Error in geographic pattern analysis:", error);
  }
};

/**
 * Example 5: Advanced Research Conversation
 */
export const researchConversationExample = async () => {
  console.log("💬 Starting Advanced Research Conversation");
  
  try {
    const investigation = new ufoResearch.UFOResearchConversation('events');
    
    // Start with broad investigation
    console.log("\n🚀 Initial Investigation:");
    const initial = await investigation.startInvestigation(
      'What are the most credible military UFO encounters with radar confirmation?',
      'SCIENTIFIC_ANALYSIS'
    );
    console.log("Answer:", initial.answer);
    
    // Follow up with specific questions
    console.log("\n🎯 Follow-up 1: Physical Evidence");
    const followUp1 = await investigation.askFollowUp(
      'Which of these cases involved physical evidence or trace materials?',
      'CREDIBLE_SIGHTINGS'
    );
    console.log("Answer:", followUp1.answer);
    
    // Ask about government response
    console.log("\n🏛️ Follow-up 2: Government Response");
    const followUp2 = await investigation.askFollowUp(
      'How did the government officially respond to these incidents?',
      'GOVERNMENT_DISCLOSURE'
    );
    console.log("Answer:", followUp2.answer);
    
    // Generate comprehensive report
    console.log("\n📄 Generating Investigation Report...");
    const report = await investigation.generateInvestigationReport();
    console.log("Final Report:", report);
    
    // Show conversation summary
    const summary = investigation.getConversationSummary();
    console.log(`\n📊 Investigation Summary:`);
    console.log(`- Questions Asked: ${summary.totalQuestions}`);
    console.log(`- Session ID: ${summary.sessionId}`);
    console.log(`- Duration: ${summary.history.length > 0 ? 
      new Date().getTime() - summary.history[0].timestamp.getTime() : 0}ms`);

    return { investigation, report, summary };
  } catch (error) {
    console.error("❌ Error in research conversation:", error);
  }
};

/**
 * Example 6: Multi-table Cross-reference Research
 */
export const multiTableResearchExample = async () => {
  console.log("🔗 Starting Multi-table Cross-reference Research");
  
  try {
    const result = await ufoResearch.askMultiTableResearch(
      'What evidence exists for UFO technology reverse engineering programs?',
      {
        tables: ['events', 'personnel', 'testimonies'],
        researchType: 'SCIENTIFIC_ANALYSIS'
      }
    );

    console.log("🔬 Cross-reference Analysis:");
    console.log("Combined Answer:", result.combinedAnswer);
    
    // Analyze each table's contribution
    console.log("\n📊 Breakdown by Data Source:");
    Object.entries(result.tableResults).forEach(([table, tableResult]) => {
      console.log(`\n📋 ${table.toUpperCase()}:`);
      console.log(`- Records found: ${tableResult.records.length}`);
      console.log(`- Key insight: ${tableResult.answer.substring(0, 200)}...`);
    });

    return result;
  } catch (error) {
    console.error("❌ Error in multi-table research:", error);
  }
};

/**
 * Example 7: Real-time Streaming Analysis
 */
export const streamingAnalysisExample = async () => {
  console.log("🌊 Starting Real-time Streaming Analysis");
  
  try {
    const stream = await askStream(
      'events', 
      'Provide a comprehensive analysis of UFO incident patterns, including technological descriptions and witness credibility factors',
      {
        rules: ufoResearch.RULES.PATTERN_ANALYSIS,
        searchType: 'keyword',
        search: {
          fuzziness: 1,
          prefix: 'phrase',
          target: [
            'description',
            { column: 'name', weight: 3 },
            { column: 'technology_description', weight: 2 },
            'witness_credibility'
          ]
        }
      }
    );

    const reader = stream.getReader();
    let fullResponse = '';
    let recordCount = 0;

    console.log("📡 Streaming response:");
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log("\n✅ Streaming complete");
          break;
        }
        
        if (value.answer) {
          process.stdout.write(value.answer);
          fullResponse += value.answer;
        }
        
        if (value.records) {
          recordCount += value.records.length;
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log(`\n\n📊 Streaming Summary:`);
    console.log(`- Total response length: ${fullResponse.length} characters`);
    console.log(`- Records processed: ${recordCount}`);
    
    return { fullResponse, recordCount };
  } catch (error) {
    console.error("❌ Error in streaming analysis:", error);
  }
};

/**
 * Example 8: Custom Search Configuration
 */
export const customSearchConfigExample = async () => {
  console.log("⚙️ Starting Custom Search Configuration Example");
  
  try {
    // Create a highly specific search for military encounters
    const result = await askXata('events', 'Find UFO encounters involving military aircraft with electromagnetic effects', {
      rules: [
        'Prioritize incidents involving military aircraft or personnel',
        'Focus on cases with documented electromagnetic effects',
        'Include details about radar signatures and instrument malfunctions',
        'Assess witness credibility based on military training and experience'
      ],
      searchType: 'keyword',
      search: {
        fuzziness: 1,
        prefix: 'phrase',
        target: [
          { column: 'description', weight: 2 },
          { column: 'name', weight: 3 },
          { column: 'military_involvement', weight: 2.5 },
          { column: 'electromagnetic_effects', weight: 2 },
          'witness_type'
        ],
        boosters: [
          {
            valueBooster: {
              column: 'witness_type',
              value: 'military',
              factor: 2.0
            }
          },
          {
            valueBooster: {
              column: 'electromagnetic_effects',
              value: 'confirmed',
              factor: 1.8
            }
          },
          {
            numericBooster: {
              column: 'credibility_score',
              factor: 1.5
            }
          }
        ],
        filter: {
          military_involvement: { $ne: null },
          debunked: { $ne: true }
        }
      }
    });

    console.log("🛸 Military Encounter Analysis:");
    console.log("Answer:", result.answer);
    console.log(`Session ID: ${result.sessionId}`);
    console.log(`Records found: ${result.records.length}`);

    return result;
  } catch (error) {
    console.error("❌ Error in custom search configuration:", error);
  }
};

/**
 * Example 9: Comparative Analysis Using Pre-configured Templates
 */
export const comparativeAnalysisExample = async () => {
  console.log("⚖️ Starting Comparative Analysis");
  
  try {
    const question = 'What are the most significant UFO cases from the 1950s?';
    
    // Run the same question with different search configurations
    const credibleResults = await askXataWithAi({
      table: 'events',
      question,
      rules: ufoResearch.RULES.SCIENTIFIC_ANALYSIS,
      searchType: ufoResearch.CONFIGS.CREDIBLE_SIGHTINGS.searchType,
      search: {
        ...ufoResearch.CONFIGS.CREDIBLE_SIGHTINGS.search,
        filter: {
          date: {
            $gte: new Date('1950-01-01'),
            $lte: new Date('1959-12-31')
          }
        }
      }
    });

    const disclosureResults = await askXataWithAi({
      table: 'events',
      question,
      rules: ufoResearch.RULES.DISCLOSURE_FOCUSED,
      searchType: ufoResearch.CONFIGS.GOVERNMENT_DISCLOSURE.searchType,
      search: {
        ...ufoResearch.CONFIGS.GOVERNMENT_DISCLOSURE.search,
        filter: {
          date: {
            $gte: new Date('1950-01-01'),
            $lte: new Date('1959-12-31')
          }
        }
      }
    });

    console.log("🔬 Scientific Credibility Perspective:");
    console.log(credibleResults.answer);
    console.log(`Records: ${credibleResults.records.length}`);
    
    console.log("\n🏛️ Government Disclosure Perspective:");
    console.log(disclosureResults.answer);
    console.log(`Records: ${disclosureResults.records.length}`);
    
    // Find common cases between both approaches
    const credibleIds = new Set(credibleResults.records.map(r => r.id));
    const commonCases = disclosureResults.records.filter(r => credibleIds.has(r.id));
    
    console.log(`\n🎯 Cases found in both analyses: ${commonCases.length}`);
    commonCases.forEach(record => {
      console.log(`• ${record.name} (${record.date})`);
    });

    return { credibleResults, disclosureResults, commonCases };
  } catch (error) {
    console.error("❌ Error in comparative analysis:", error);
  }
};

/**
 * Example 10: Error Handling and Fallback Strategies
 */
export const errorHandlingExample = async () => {
  console.log("🛡️ Demonstrating Error Handling and Fallback Strategies");
  
  const question = 'Analyze the most complex UFO cases with multiple phenomena';
  
  try {
    // Try with complex configuration first
    console.log("🎯 Attempting complex search...");
    
    const complexResult = await askXata('events', question, {
      rules: ufoResearch.RULES.SCIENTIFIC_ANALYSIS,
      searchType: 'keyword',
      search: {
        fuzziness: 0, // Very strict
        prefix: 'phrase',
        target: [
          { column: 'complex_phenomena', weight: 3 },
          { column: 'multiple_witnesses', weight: 2 },
          'scientific_analysis'
        ],
        boosters: [
          {
            numericBooster: {
              column: 'phenomenon_count',
              factor: 2.0
            }
          }
        ],
        filter: {
          complexity_score: { $gte: 8 }
        }
      }
    });
    
    console.log("✅ Complex search successful");
    return complexResult;
    
  } catch (error) {
    console.warn("⚠️ Complex search failed, trying simplified approach...", error.message);
    
    try {
      // Fallback to simpler configuration
      const simpleResult = await askXata('events', question, {
        rules: ['Focus on well-documented cases with multiple phenomena'],
        searchType: 'keyword',
        search: {
          fuzziness: 2, // More tolerant
          target: ['description', 'name']
        }
      });
      
      console.log("✅ Simplified search successful");
      return simpleResult;
      
    } catch (fallbackError) {
      console.warn("⚠️ Simplified search failed, using basic approach...", fallbackError.message);
      
      try {
        // Final fallback - most basic configuration
        const basicResult = await askXata('events', 'What are notable UFO cases?');
        
        console.log("✅ Basic search successful");
        return basicResult;
        
      } catch (finalError) {
        console.error("❌ All search strategies failed:", finalError);
        return null;
      }
    }
  }
};

/**
 * Main demo function to run all examples
 */
export const runAllExamples = async () => {
  console.log("🚀 Starting Comprehensive Xata Ask SDK Demo for UFO/UAP Research");
  console.log("=" .repeat(80));
  
  const examples = [
    { name: "Credibility Research", fn: credibilityResearchExample },
    { name: "Government Disclosure", fn: governmentDisclosureExample },
    { name: "Historical Timeline", fn: historicalTimelineExample },
    { name: "Geographic Patterns", fn: geographicPatternsExample },
    { name: "Research Conversation", fn: researchConversationExample },
    { name: "Multi-table Research", fn: multiTableResearchExample },
    { name: "Streaming Analysis", fn: streamingAnalysisExample },
    { name: "Custom Search Config", fn: customSearchConfigExample },
    { name: "Comparative Analysis", fn: comparativeAnalysisExample },
    { name: "Error Handling", fn: errorHandlingExample }
  ];
  
  const results = {};
  
  for (const example of examples) {
    console.log(`\n${"=".repeat(40)}`);
    console.log(`Running: ${example.name}`);
    console.log(`${"=".repeat(40)}`);
    
    try {
      const result = await example.fn();
      results[example.name] = result;
      console.log(`✅ ${example.name} completed successfully`);
    } catch (error) {
      console.error(`❌ ${example.name} failed:`, error.message);
      results[example.name] = { error: error.message };
    }
    
    // Add delay between examples to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("\n" + "=".repeat(80));
  console.log("🎉 Demo Complete! Summary:");
  console.log("=".repeat(80));
  
  Object.entries(results).forEach(([name, result]) => {
    const status = result && !result.error ? "✅ Success" : "❌ Failed";
    console.log(`${status} - ${name}`);
  });
  
  return results;
};

// Export all examples for individual use
export {
  credibilityResearchExample,
  governmentDisclosureExample,
  historicalTimelineExample,
  geographicPatternsExample,
  researchConversationExample,
  multiTableResearchExample,
  streamingAnalysisExample,
  customSearchConfigExample,
  comparativeAnalysisExample,
  errorHandlingExample
}; 