
"use client"

import Link from "next/link"
import { Zap, LayoutDashboard, GitBranch, History, Menu, X, DollarSign, LogIn, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Sync", href: "/sync", icon: GitBranch },
    { name: "Generator", href: "/generator", icon: Zap },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "Timeline", href: "/timeline", icon: History },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center transition-transform group-hover:scale-105">
            <Zap className="w-4 h-4 text-black fill-current" />
          </div>
          <span className="font-headline font-bold text-lg tracking-tight text-white">
            changelogai
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                    isActive 
                      ? "text-white bg-white/10 font-medium" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="h-4 w-px bg-border/50 mx-1" />

          {session ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-white h-8 text-xs font-bold uppercase tracking-wider"
              onClick={() => signOut()}
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border hover:bg-white/5 h-8 text-xs font-bold uppercase tracking-wider"
              onClick={() => signIn('github')}
            >
              <LogIn className="w-3.5 h-3.5 mr-2" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-1.5 text-muted-foreground hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-background border-b border-border p-3 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md text-sm transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
          <div className="p-3">
            {session ? (
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 text-xs font-bold uppercase"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 text-xs font-bold uppercase"
                onClick={() => signIn('github')}
              >
                <LogIn className="w-4 h-4 mr-3" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
