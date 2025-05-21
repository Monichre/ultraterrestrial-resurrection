import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Define root project directory
const projectRoot = path.resolve(__dirname, "../..");

// Data bucket directories configuration
const DEFAULT_DATA_ROOT = path.join(projectRoot, "scripts/data-import");

interface BucketConfig {
	processing: string;
	review: string;
	insertion: string;
	logs: string;
}

interface DataTypeConfig {
	testimonies: BucketConfig;
	events: BucketConfig;
	personnel: BucketConfig;
	organizations: BucketConfig;
	artifacts: BucketConfig;
	// Add more data types as needed
}

/**
 * Configuration for data buckets by data type
 */
const dataBuckets: DataTypeConfig = {
	testimonies: {
		processing: path.join(DEFAULT_DATA_ROOT, "processing/testimonies"),
		review: path.join(DEFAULT_DATA_ROOT, "review/testimonies"),
		insertion: path.join(DEFAULT_DATA_ROOT, "insertion/testimonies"),
		logs: path.join(DEFAULT_DATA_ROOT, "logs/testimonies"),
	},
	events: {
		processing: path.join(DEFAULT_DATA_ROOT, "processing/events"),
		review: path.join(DEFAULT_DATA_ROOT, "review/events"),
		insertion: path.join(DEFAULT_DATA_ROOT, "insertion/events"),
		logs: path.join(DEFAULT_DATA_ROOT, "logs/events"),
	},
	personnel: {
		processing: path.join(DEFAULT_DATA_ROOT, "processing/personnel"),
		review: path.join(DEFAULT_DATA_ROOT, "review/personnel"),
		insertion: path.join(DEFAULT_DATA_ROOT, "insertion/personnel"),
		logs: path.join(DEFAULT_DATA_ROOT, "logs/personnel"),
	},
	organizations: {
		processing: path.join(DEFAULT_DATA_ROOT, "processing/organizations"),
		review: path.join(DEFAULT_DATA_ROOT, "review/organizations"),
		insertion: path.join(DEFAULT_DATA_ROOT, "insertion/organizations"),
		logs: path.join(DEFAULT_DATA_ROOT, "logs/organizations"),
	},
	artifacts: {
		processing: path.join(DEFAULT_DATA_ROOT, "processing/artifacts"),
		review: path.join(DEFAULT_DATA_ROOT, "review/artifacts"),
		insertion: path.join(DEFAULT_DATA_ROOT, "insertion/artifacts"),
		logs: path.join(DEFAULT_DATA_ROOT, "logs/artifacts"),
	},
};

// Ensure directories exist
Object.values(dataBuckets).forEach((bucketConfig) => {
	Object.values(bucketConfig).forEach((dir) => {
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
	});
});

/**
 * Xata API configuration
 */
const xataConfig = {
	apiKey: process.env.XATA_API_KEY || "",
	databaseURL:
		process.env.XATA_DATABASE_URL ||
		"https://UltraTerrestrial-kgubvq.us-east-1.xata.sh/db/ultraterrestrial",
	branch: process.env.XATA_BRANCH || "main",
};

/**
 * AI assistant configuration
 */
const aiConfig = {
	apiKey: process.env.OPENAI_API_KEY || "",
	model: process.env.AI_MODEL || "gpt-4",
	endpoint:
		process.env.AI_ENDPOINT || "https://api.openai.com/v1/chat/completions",
	maxTokens: parseInt(process.env.AI_MAX_TOKENS || "1000", 10),
};

/**
 * CLI settings
 */
const cliConfig = {
	defaultQualityThreshold: 50, // Default data quality score threshold (0-100)
	batchSize: 100, // Default batch size for insertions
	logLevel: process.env.LOG_LEVEL || "info",
};

// Check if Xata API key is set
if (!xataConfig.apiKey) {
	console.warn(
		"⚠️  Warning: XATA_API_KEY environment variable is not set. Xata operations will fail.",
	);
}

/**
 * Helper function to get bucket path for a specific data type and stage
 */
function getBucketPath(
	dataType: keyof DataTypeConfig,
	stage: keyof BucketConfig,
): string {
	if (!dataBuckets[dataType]) {
		throw new Error(`Unknown data type: ${dataType}`);
	}
	if (!dataBuckets[dataType][stage]) {
		throw new Error(`Unknown stage: ${stage} for data type: ${dataType}`);
	}
	return dataBuckets[dataType][stage];
}

export {
	dataBuckets,
	xataConfig,
	aiConfig,
	cliConfig,
	getBucketPath,
	DataTypeConfig,
	BucketConfig,
};
