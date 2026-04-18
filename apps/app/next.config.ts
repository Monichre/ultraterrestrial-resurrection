const nextConfig = {
	reactStrictMode: true,

	transpilePackages: [
		"three",
		"@react-three/fiber",
		"@react-three/drei",
		"gsap",
		"@db",
	],
	crossOrigin: "anonymous",

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
};

module.exports = nextConfig;
