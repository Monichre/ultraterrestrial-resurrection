import fs from "node:fs";
import path from "node:path";

export async function GET(request: any) {
	try {
		// Use process.cwd() to get the current working directory
		const sightingsFilePath = path.join(
			process.cwd(),
			"public",
			"sightings.geojson",
		); // Adjust path if needed
		const sightingsFileContents = await fs.promises.readFile(
			sightingsFilePath,
			"utf8",
		);
		/* The code snippet you provided is attempting to read the contents of a file named
'ufo-posts-final.geojson' located in the 'public' directory within the current working directory
using Node.js file system module (fs) and path module. */
		const ufoPostsFilePath = path.join(
			process.cwd(),
			"public",
			"ufo-posts.geojson",
		);
		const ufoPostsFileContents = await fs.promises.readFile(
			ufoPostsFilePath,
			"utf8",
		);
		const militaryBasesFilePath = path.join(
			process.cwd(),
			"public",
			"military-bases.geojson",
		);
		const militaryBasesFileContents = await fs.promises.readFile(
			militaryBasesFilePath,
			"utf8",
		);

		// Parse the JSON content
		const sightings = JSON.parse(sightingsFileContents);
		const militaryBases = JSON.parse(militaryBasesFileContents);
		const ufoPosts = JSON.parse(ufoPostsFileContents);

		// Return the parsed GeoJSON content
		return new Response(
			JSON.stringify({
				data: {
					sightings,
					militaryBases,
					/* The line `// ufoPosts,` is a commented-out line of code in the TypeScript function. This
          line is not active in the code execution because it is preceded by double slashes `//`,
          which indicates a comment in TypeScript. */
					ufoPosts,
				},
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("Error reading GeoJSON file:", error);

		// Return an error response
		return new Response(
			JSON.stringify({ error: "Failed to read GeoJSON file" }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
}
