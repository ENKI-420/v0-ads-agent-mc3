"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views
    if (typeof window !== "undefined") {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
          page_path: pathname,
        })
      }

      // Custom analytics
      trackPageView(pathname)
    }
  }, [pathname, searchParams])

  return null
}

function trackPageView(path: string) {
  // Custom analytics implementation
  try {
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error)
  } catch (error) {
    console.error("Analytics tracking error:", error)
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
