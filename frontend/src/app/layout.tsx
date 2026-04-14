import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mehdi Abbas Nathani — Agentic AI & Software Engineer",
  description:
    "Portfolio of Mehdi Abbas Nathani — transitioning from Senior Finance Executive to Agentic AI & Software Engineer. Explore projects, skills, and connect via AI chatbot.",
  keywords: [
    "Mehdi Nathani",
    "Software Engineer",
    "AI Engineer",
    "Flutter Developer",
    "Portfolio",
  ],
  authors: [{ name: "Mehdi Abbas Nathani" }],
  openGraph: {
    title: "Mehdi Abbas Nathani — Portfolio",
    description:
      "Agentic AI & Software Engineer — Finance-to-Tech transition story, projects, and skills.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
