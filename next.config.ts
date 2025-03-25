import path from "node:path";

const nextConfig = {
	reactStrictMode: true,

	transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
	crossOrigin: "anonymous",

	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
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
		turbo: {
			treeShaking: true,
		},
	},
};

module.exports = nextConfig;
