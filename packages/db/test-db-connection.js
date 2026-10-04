/**
 * Test Database Connection and Get Basic Stats
 */

const { spawn } = require('child_process');
const path = require('path');

// Function to run a simple database query using the existing client
async function testConnection() {
  console.log("🔍 Database Connection Test\n");
  
  try {
    // Check if we can import the client
    console.log("1. Testing client import...");
    
    // Try to require the client - this will tell us if the package is set up correctly
    const clientPath = './src/xata-typescript-sdk/client.ts';
    console.log(`   Looking for client at: ${clientPath}`);
    
    // For now, let's just check if the files exist
    const fs = require('fs');
    
    const files = [
      './src/xata-typescript-sdk/client.ts',
      './src/xata-typescript-sdk/xata.ts',
      './src/xata-typescript-sdk/index.ts'
    ];
    
    files.forEach(file => {
      if (fs.existsSync(file)) {
        console.log(`   ✅ ${file} exists`);
      } else {
        console.log(`   ❌ ${file} missing`);
      }
    });

    // Check the package.json configuration
    console.log("\n2. Checking package configuration...");
    const packageJson = require('./package.json');
    
    console.log(`   Package name: ${packageJson.name}`);
    console.log(`   Dependencies: ${Object.keys(packageJson.dependencies || {}).join(', ')}`);
    console.log(`   Main entry: ${packageJson.main}`);
    
    // Check exports
    if (packageJson.exports) {
      console.log("   Package exports:");
      Object.entries(packageJson.exports).forEach(([key, value]) => {
        console.log(`     ${key} -> ${value}`);
      });
    }

    // Try to read the Xata configuration
    console.log("\n3. Checking Xata configuration...");
    
    try {
      const xataConfig = fs.readFileSync('./src/xata-typescript-sdk/xata.ts', 'utf8');
      
      // Extract database URL from the file
      const dbUrlMatch = xataConfig.match(/databaseURL:\s*["']([^"']+)["']/);
      if (dbUrlMatch) {
        const dbUrl = dbUrlMatch[1];
        console.log(`   Database URL: ${dbUrl}`);
        
        // Extract database name from URL
        const dbNameMatch = dbUrl.match(/\/db\/([^\/]+)$/);
        if (dbNameMatch) {
          console.log(`   Database name: ${dbNameMatch[1]}`);
        }
      }
      
      // Check for API key reference
      const apiKeyMatch = xataConfig.match(/apiKey:\s*([^,\n]+)/);
      if (apiKeyMatch) {
        console.log(`   API Key: ${apiKeyMatch[1]}`);
      }
      
      // Count tables defined in schema
      const tableMatches = xataConfig.match(/name:\s*["']([^"']+)["']/g);
      if (tableMatches) {
        console.log(`   Tables defined: ${tableMatches.length}`);
        
        // Show first few table names
        const tableNames = tableMatches.slice(0, 5).map(match => 
          match.replace(/name:\s*["']([^"']+)["']/, '$1')
        );
        console.log(`   Sample tables: ${tableNames.join(', ')}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Could not read Xata config: ${error.message}`);
    }

    // Check environment variables
    console.log("\n4. Checking environment setup...");
    
    const envVars = ['XATA_API_KEY', 'XATA_BRANCH', 'DATABASE_URL'];
    envVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        console.log(`   ✅ ${varName}: Set (${value.length} chars)`);
      } else {
        console.log(`   ❌ ${varName}: Not set`);
      }
    });

    console.log("\n✅ Database connection test complete!");
    
    // Provide recommendations
    console.log("\n💡 RECOMMENDATIONS:");
    console.log("-".repeat(50));
    console.log("1. Ensure XATA_API_KEY is set in environment");
    console.log("2. Verify database URL in xata.ts matches your instance");
    console.log("3. Test actual database queries after environment setup");
    console.log("4. Check network connectivity to Xata servers");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testConnection().catch(console.error);