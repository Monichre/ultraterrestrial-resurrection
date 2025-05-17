import Exa from "exa-js";

// Initialize Exa client with API key
export const exa = new Exa(process.env.EXA_API_KEY || "");

// Utility function to check if API key is set
export const isExaConfigured = (): boolean => {
	return Boolean(process.env.EXA_API_KEY);
};

// API key validation function
export const validateExaAPIKey = async (): Promise<boolean> => {
	if (!isExaConfigured()) {
		return false;
	}

	try {
		// Attempt a minimal API call to verify the key works
		await exa.search("test", { numResults: 1 });
		return true;
	} catch (error) {
		console.error("Exa API key validation failed:", error);
		return false;
	}
};
