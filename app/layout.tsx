import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

// Helper function to get the base URL
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Fallback to the production domain
  return "https://www.konzok.com"
}

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Thilo Konzok",
  description:
    "Thilo is Uncommon Founder, Partner and Sequoia Arc Advisor. He invested, advised or designed Mercor, Delphi, Squint, Dash0, CrewAI, GradientLabs, Build, Fleet, Medra, nsave, Ironbridge, DiligenceSquared, Lemni, Morphic, Compile, Lapel, Orbit, Sensmore, Nolla, Luo, Hero, Popcorn, Partykit, GuidedEnergy, CommerceSystems, Claim, Structify, Snaptrude, Superlinked, Tilebox, Amperecloud, Equipme, Documenso and Era, founded Home, worked at Airbnb in 2011 and studied architecture.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.konzok.com",
    siteName: "Thilo Konzok",
    title: "Thilo Konzok",
    description: "Thilo is Uncommon Founder, Partner and Sequoia Arc Advisor.",
    images: [
      {
        url: "https://www.konzok.com/og-image.png?v=2025",
        width: 1200,
        height: 630,
        alt: "Thilo Konzok",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thilo Konzok",
    description: "Thilo is Uncommon Founder, Partner and Sequoia Arc Advisor.",
    creator: "@thilokonzok",
    images: [
      {
        url: "https://www.konzok.com/og-image.png?v=2025",
        width: 1200,
        height: 630,
        alt: "Thilo Konzok",
      },
    ],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.konzok.com",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className="font-normal bg-white">
        <Suspense>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
