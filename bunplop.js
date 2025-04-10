#!/usr/bin/env bun
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Plop, run } from "plop";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Force the process to stay alive until explicitly exited
process.stdin.resume();

// Properly handle process termination
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

Plop.prepare(
	{
		cwd: process.cwd(),
		configPath: path.join(__dirname, "plopfile.js"),
		preload: [],
		completion: false,
	},
	(env) => {
		const options = {
			...env,
			dest: process.cwd(), // ensure correct destination path
		};
		return Plop.execute(env, (env) => run(options, undefined, true));
	},
);
