 
 
 

// import "@/styles/flowith/flowith.css";
// import "@/styles/flowith/reactflow.css";

import "@xyflow/react/dist/style.css";
import "./globals.css";

import { ThemeProvider } from "@/contexts";

import { ClerkProvider } from "@clerk/nextjs";

import { FullSiteNav } from "@/components/navbar/full-site-nav";
import {
	lukasSans,
	monumentGrotesk,
	monumentGroteskMono,
	neueHaasGrotesk,
} from "./fonts";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Ultraterrestrial",
	description:
		"Tracking the state of Disclosure. A visually rich and collaborative effort that strives to document, explore and synthesize the past, present and future of the UFO phenomenon, not only in its own regard but particularly as it concerns the origins of humanity, the fundamental nature of reality and the relationship between the two.", // and the space between?
	// We must first understand what it is before we can understand what it means.  What tradeoffs known or unbeknownst to us may exist in attempting to answer the two questions in parallel? Is there really any other option?
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="en" suppressHydrationWarning className="dark">
				<body
					className={` ${neueHaasGrotesk.variable} ${monumentGrotesk.variable} ${monumentGroteskMono.variable} ${lukasSans.variable} dark`}
				>
					<ThemeProvider
						attribute="class"
						forcedTheme="dark"
						defaultTheme="dark"
						enableSystem={false}
						// enableSystem
						// disableTransitionOnChange
					>
						{/* <DataLayer> */}

						<FullSiteNav />

						<main className="min-h-[100vh] min-w-screen relative site dark">
							{children}
						</main>
					</ThemeProvider>
				</body>
				{/* </DataLayer> */}
			</html>
		</ClerkProvider>
	);
}
