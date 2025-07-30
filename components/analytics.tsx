"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// This is a simplified Google Analytics (GA) example.
// In a real application, you'd use a more robust GA library or a custom solution
// that handles consent, events, etc.

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      // Load Google Analytics script
      const script = document.createElement("script")
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        window.gtag =
          window.gtag ||
          (() => {
            ;(window.gtag.q = window.gtag.q || []).push(arguments)
          })
        window.gtag("js", new Date())
        window.gtag("config", GA_MEASUREMENT_ID, {
          send_page_view: false, // Disable automatic page view to handle manually
        })
        // Initial page view
        window.gtag("event", "page_view", {
          page_path: pathname + searchParams.toString(),
        })
      }

      return () => {
        document.head.removeChild(script)
      }
    }
  }, [pathname, searchParams])

  useEffect(() => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      // Track page views on route changes
      window.gtag("event", "page_view", {
        page_path: pathname + searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  return null
}
