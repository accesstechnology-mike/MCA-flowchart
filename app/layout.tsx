import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { StructuredData } from "./components/StructuredData";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mca-flowchart.vercel.app"),
  title: {
    default: "MCA Decision Making Pathway | Mental Capacity Act Assessment Tool",
    template: "%s | MCA Decision Making Pathway",
  },
  description: "Professional decision-making tool for assessing mental capacity under the Mental Capacity Act (2005). Guide healthcare professionals, social workers, and legal practitioners through structured capacity assessments with step-by-step guidance.",
  keywords: [
    "Mental Capacity Act",
    "MCA 2005",
    "mental capacity assessment",
    "capacity assessment tool",
    "decision making pathway",
    "mental health assessment",
    "capacity evaluation",
    "best interests",
    "healthcare assessment",
    "social care assessment",
    "legal capacity",
    "deprivation of liberty",
    "DOLS",
    "safeguarding",
    "access technology",
  ],
  authors: [{ name: "access: technology" }],
  creator: "access: technology",
  publisher: "access: technology",
  applicationName: "MCA Decision Making Pathway",
  category: "Healthcare",
  classification: "Healthcare Tool",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "MCA Decision Making Pathway",
    title: "MCA Decision Making Pathway | Mental Capacity Act Assessment Tool",
    description: "Professional decision-making tool for assessing mental capacity under the Mental Capacity Act (2005). Guide healthcare professionals through structured capacity assessments.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "MCA Decision Making Pathway Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCA Decision Making Pathway | Mental Capacity Act Assessment Tool",
    description: "Professional decision-making tool for assessing mental capacity under the Mental Capacity Act (2005).",
    images: ["/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/android-chrome-192x192.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MCA Decision Pathway",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body
        className={`${dmSans.variable} antialiased`} 
      >
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
