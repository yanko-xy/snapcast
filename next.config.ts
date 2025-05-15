import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */

	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				hostname: "xy-snapcast.b-cdn.net",
				protocol: "https",
				port: "",
				pathname: "/**",
			},
			{
				hostname: "lh3.googleusercontent.com",
				protocol: "https",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
