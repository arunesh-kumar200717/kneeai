import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Header } from "@/components/Header";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Knee AI — Clinical Osteoarthritis Imaging & Segmentation Suite",
  description:
    "Clinical decision-support and quantitative research platform for knee osteoarthritis imaging, featuring 2D U-Net medial meniscus MRI segmentation and plain radiograph bone morphometry.",
  keywords: [
    "Knee Osteoarthritis",
    "Medial Meniscus Segmentation",
    "MRI U-Net",
    "Knee X-Ray Segmentation",
    "Morphometrics",
    "Orthopedic AI",
    "Research Decision Support",
  ],
  authors: [{ name: "Knee AI Clinical Research Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-canvas text-white antialiased flex flex-col font-sans italic tracking-wide">
        <AnimatedBackground />

        {/* Persistent, Non-Dismissible Clinical Safety Notice */}
        <DisclaimerBanner />

        {/* Global Navigation Header */}
        <Header />

        {/* Main Application Content Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Clinical Software Footer */}
        <footer className="w-full bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 border-t border-border py-4 mt-auto text-xs text-slate-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Knee AI Decision-Support Platform</span>
              <span className="text-slate-400">•</span>
              <span>Version 1.0.4-rc (Build 2026.08)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Research Use Only • Not for Primary Diagnostic Determination
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
