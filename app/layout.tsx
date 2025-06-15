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
  title: "AGENT-M3c | AI-Enhanced Collaboration Platform",
  description:
    "Production-ready AI platform with real-time collaboration, multi-agent orchestration, and enterprise-grade security for healthcare, legal, and defense sectors.",
  keywords: [
    "AI platform",
    "real-time collaboration",
    "multi-agent AI",
    "enterprise security",
    "healthcare AI",
    "legal AI",
    "defense AI",
  ],
  authors: [{ name: "Agile Defense Systems" }],
  creator: "Agile Defense Systems",
  publisher: "Agile Defense Systems",
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
    url: "https://agent-m3c.com",
    title: "AGENT-M3c | AI-Enhanced Collaboration Platform",
    description: "Production-ready AI platform with real-time collaboration and enterprise-grade security.",
    siteName: "AGENT-M3c",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGENT-M3c | AI-Enhanced Collaboration Platform",
    description: "Production-ready AI platform with real-time collaboration and enterprise-grade security.",
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
