"use client"

import Link from "next/link"
import { GitBranch, History, Settings, Zap } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Sync", href: "/sync", icon: GitBranch },
    { name: "Generator", href: "/generator", icon: Zap },
    { name: "Timeline", href: "/timeline", icon: History },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground fill-current" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter">changelogai</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            )
          })}
          <div className="h-4 w-[1px] bg-border mx-2" />
          <Link href="/settings" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}