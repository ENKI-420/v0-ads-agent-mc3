import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { ErrorBoundary } from "@/components/error-boundary"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ADSTech | Next-Gen AI Platform - Zero-to-Deploy Blueprint",
  description:
    "Defense-grade AI platform with domain specialization in oncology, defense, legal, and enterprise. Real-time multi-modal interaction with military-standard security.",
  keywords: [
    "ADSTech",
    "AI platform",
    "defense-grade security",
    "oncology AI",
    "legal AI",
    "enterprise AI",
    "HIPAA compliant",
    "SOC2 compliant",
    "vector memory",
    "real-time collaboration",
  ],
  authors: [{ name: "Agile Defense Systems Technology" }],
  creator: "ADSTech",
  publisher: "ADSTech",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://adstech.ai",
    title: "ADSTech | Next-Gen AI Platform",
    description: "Defense-grade AI platform with domain specialization and military-standard security.",
    siteName: "ADSTech",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADSTech | Next-Gen AI Platform",
    description: "Defense-grade AI platform with domain specialization and military-standard security.",
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
              <Analytics />
            </ThemeProvider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
