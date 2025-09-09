import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agents Parallel Processing",
  description:
    "A comprehensive demo showcasing parallel processing with AI agents for concurrent content analysis from multiple perspectives.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-white  dark:bg-gray-950">{children}</main>
      </body>
    </html>
  );
}
