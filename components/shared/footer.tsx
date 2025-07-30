import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="relative z-10 border-t bg-background py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center space-x-2">
          <Image src="/placeholder-logo.svg" alt="Logo" width={24} height={24} className="h-6 w-6" />
          <span className="font-bold">Executive Dashboard</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact Us
          </Link>
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Executive Dashboard. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
