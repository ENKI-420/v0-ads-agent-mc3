"use client"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/shared/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { useAidenStore } from "@/store/aidenStore"
import { MessageSquare } from "lucide-react"

export function Navbar() {
  const { setVisible } = useAidenStore()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-between space-x-2 sm:space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setVisible(true)} className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask Aiden
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
