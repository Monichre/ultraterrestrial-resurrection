const nextConfig = {
	reactStrictMode: true,

	transpilePackages: [
		"three",
		"@react-three/fiber",
		"@react-three/drei",
		"gsap",
		"@db",
		"@repo/disclosure-ui",
	],
	crossOrigin: "anonymous",

	// pdfjs-dist must not be bundled for the server. The PDF text extraction on
	// POST /api/processing/drop imports pdfjs-dist/legacy/build/pdf.mjs, and
	// webpack's transform of that file breaks it at runtime with
	// "Object.defineProperty called on non-object" (verified 2026-08-13 — the
	// same PDF extracts fine when the module is loaded natively).
	serverExternalPackages: ["pdfjs-dist"],

	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "us-east-1.xata.sh",
				port: "",
				pathname: "*",
			},
			{
				protocol: "https",
				hostname: "**.xata.sh",
				port: "",
				pathname: "*",
			},
			{
				protocol: "https",
				hostname: "us-east-1.xata.sh",
				port: "",
				pathname: "*",
			},
			{
				protocol: "https",
				hostname: "us-east-1.storage.xata.sh",
				port: "",
				pathname: "*",
			},
		],
		domains: ["us-east-1.storage.xata.sh", "us-east-1.xata.sh", "xata.sh"],
	},
	experimental: {
		taint: true,

		optimizePackageImports: [
			"three",
			"@react-three/drei",
			"@react-three/fiber",
		],
	},
}

module.exports = nextConfig
