import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChurnRadar AI | Precision Customer Retention Engine",
  description: "Enterprise-grade customer churn prediction and risk profiling dashboard. Analyze metrics, monitor revenue leakage, and trigger real-time ML-driven retention strategies.",
  authors: [{ name: "ChurnRadar AI team" }],
  keywords: ["customer churn", "telecom churn", "retention engine", "machine learning", "risk profiling"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        {/* Load Material Symbols Outlined for the futuristic UI icons */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} font-sans bg-background text-on-surface min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
