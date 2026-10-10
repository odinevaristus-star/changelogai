"use client"

import Link from "next/link"
import { Zap, LayoutDashboard, GitBranch, History, Menu, X, DollarSign, LogIn, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
          <img src="data:image/png;base64,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" alt="ChangelogAI logo" className="w-7 h-7 object-contain transition-transform group-hover:scale-105" />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full overflow-hidden w-8 h-8 border border-white/20 mr-2 outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                    <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user?.name || session.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

        <div className="flex items-center">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="md:hidden rounded-full overflow-hidden w-8 h-8 border border-white/20 mr-2 outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                    <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{session.user?.name || session.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="md:hidden text-xs font-bold uppercase mr-2"
              onClick={() => signIn('github')}
            >
              Sign In
            </Button>
          )}

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-1.5 text-muted-foreground hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full overflow-hidden w-8 h-8 border border-white/20 mr-2 outline-none">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                      <AvatarFallback>{session.user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{session.user?.name || session.user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
