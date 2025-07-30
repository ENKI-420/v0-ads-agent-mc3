"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import Image from "next/image"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Image src="/placeholder-logo.svg" alt="Logo" width={24} height={24} className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Executive Dashboard</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/demo"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/demo") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Demo
        </Link>
        <Link
          href="/pricing"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/pricing") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Pricing
        </Link>
        <Link
          href="/blog"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/blog") ? "text-foreground" : "text-foreground/60",
          )}
        >
          Blog
        </Link>
      </nav>
    </div>
  )
}
