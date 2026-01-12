import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyWise - AI Travel Assistant",
  description:
    "Your intelligent travel companion that understands your schedule, reads your confirmation emails, and helps you book, manage, and protect your travel plans.",
  keywords: [
    "travel",
    "flights",
    "AI assistant",
    "booking",
    "calendar",
    "email integration",
  ],
  authors: [{ name: "SkyWise" }],
  openGraph: {
    title: "SkyWise - AI Travel Assistant",
    description: "Fly smarter, not harder.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased noise-overlay">
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
