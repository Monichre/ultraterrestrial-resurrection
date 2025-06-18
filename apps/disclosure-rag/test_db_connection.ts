/**
 * TypeScript test script for Ultraterrestrial Database Connector
 * Demonstrates database operations and analytics
 */

import { createUltraterrestrialDB, demoUltraterrestrialDB, generateEmbedding } from './lib/connectors/ultraterrestrial_db';

async function testConnection() {
    console.log('🔌 Testing TypeScript database connection...');
    
    const db = createUltraterrestrialDB();
    
    try {
        const connected = await db.connect();
        
        if (connected) {
            console.log('✅ Database connection successful!');
            
            // Get database statistics
            console.log('\n📊 Database statistics:');
            const stats = await db.getDatabaseStats();
            Object.entries(stats).forEach(([key, value]) => {
                console.log(`  • ${key}: ${value}`);
            });
            
            // Test keyword search
            console.log('\n🔍 Testing keyword search...');
            const searchResults = await db.keywordSearch('navy pilots UFO encounter', 'events', 3);
            
            if (searchResults.length > 0) {
                console.log('Search results:');
                searchResults.forEach(result => {
                    console.log(`  • ${result.title} (score: ${result.similarityScore.toFixed(3)})`);
                });
            } else {
                console.log('No search results found');
            }
            
            // Test analytics
            console.log('\n📈 Testing analytics...');
            const influence = await db.getPersonnelInfluence(3);
            if (influence.length > 0) {
                console.log('Top influential personnel:');
                influence.forEach(person => {
                    console.log(`  • ${person.name}: ${person.influenceScore.toFixed(1)}`);
                });
            }
            
            const hotspots = await db.getUAPHotspots(3);
            if (hotspots.length > 0) {
                console.log('\nTop UAP hotspots:');
                hotspots.forEach(spot => {
                    console.log(`  • ${spot.location}: ${spot.sightingCount} sightings`);
                });
            }
            
        } else {
            console.log('❌ Database connection failed!');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.log('\nMake sure you have:');
        console.log('1. PostgreSQL running with pgvector extension');
        console.log('2. Database "ultraterrestrial" created');
        console.log('3. Schema loaded from schema_ultraterrestrial_pgvector.sql');
        console.log('4. Required npm packages: npm install pg @types/pg');
    } finally {
        await db.close();
    }
}

async function testEmbeddingGeneration() {
    console.log('\n🔤 Testing embedding generation...');
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.log('⚠️  OPENAI_API_KEY not found in environment');
        return;
    }
    
    try {
        const embedding = await generateEmbedding(
            'USS Nimitz UFO encounter with Tic Tac object',
            apiKey
        );
        
        if (embedding) {
            console.log(`✅ Generated embedding with ${embedding.length} dimensions`);
            console.log(`First 5 values: [${embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
        } else {
            console.log('❌ Failed to generate embedding');
        }
    } catch (error) {
        console.error('❌ Embedding generation failed:', error);
    }
}

async function runDemo() {
    console.log('\n🎬 Running full TypeScript demo...');
    
    try {
        await demoUltraterrestrialDB();
    } catch (error) {
        console.error('❌ Demo failed:', error);
    }
}

async function main() {
    console.log('🚀 Ultraterrestrial TypeScript Database Test');
    console.log('=' .repeat(50));
    
    // Test basic connection and operations
    await testConnection();
    
    // Test embedding generation if API key available
    await testEmbeddingGeneration();
    
    // Run full demo
    await runDemo();
    
    console.log('\n✅ TypeScript tests completed!');
}

// Run if this is the main module
if (require.main === module) {
    main().catch(console.error);
}

export { testConnection, testEmbeddingGeneration, runDemo };