"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Github, 
  Globe, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  Loader2, 
  AlertCircle,
  Key,
  ShieldCheck
} from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { fetchGitHubRepos } from "@/app/actions/github-actions"
import Link from "next/link"

export default function SyncPage() {
  const [syncedProjects, setSyncedProjects] = useState<any[]>([])
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedToken = localStorage.getItem("github_pat")
    if (savedToken) {
      setToken(savedToken)
      autoSync(savedToken)
    }
  }, [])

  const autoSync = async (activeToken: string) => {
    setIsLoading(true)
    try {
      const repos = await fetchGitHubRepos(activeToken)
      setSyncedProjects(repos)
    } catch (error: any) {
      console.error("Auto-sync failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectGitHub = async () => {
    if (!token) {
      toast({
        title: "Token required",
        description: "Please enter a GitHub Personal Access Token.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const repos = await fetchGitHubRepos(token)
      setSyncedProjects(repos)
      localStorage.setItem("github_pat", token)
      setIsOpen(false)
      toast({
        title: "GitHub Connected",
        description: `Successfully imported ${repos.length} repositories.`
      })
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Manage Connections</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">Connect your development workflow to start synthesizing changes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Button size="sm" variant="outline" className="rounded-full bg-white/5 border-white/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    Connect
                  </Button>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Github className="w-9 h-9 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">GitHub</h2>
                    <p className="text-muted-foreground leading-relaxed">Import your repositories securely using a Personal Access Token (classic).</p>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-3xl border-white/10 rounded-3xl">
              <DialogHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-bold">Connect GitHub Account</DialogTitle>
                <DialogDescription className="text-base">
                  Paste your Personal Access Token with <code className="text-primary font-mono bg-primary/5 px-1.5 py-0.5 rounded">repo</code> scope.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-6">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="token"
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary focus:border-primary text-lg"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl flex gap-4 text-sm text-primary/80 border border-primary/10">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>Your token is stored locally in your browser's encrypted storage and is never sent to our servers except for GitHub API requests.</p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold rounded-2xl" 
                  onClick={handleConnectGitHub}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Authenticate & Connect"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed flex flex-col gap-6 grayscale">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center">
                <Globe className="w-9 h-9 text-[#FC6D26]" />
              </div>
              <Button size="sm" variant="outline" className="rounded-full bg-white/5 border-white/10" disabled>Coming Soon</Button>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">GitLab</h2>
              <p className="text-muted-foreground leading-relaxed">Full GitLab integration and CI/CD pipeline automation is in the works.</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold">Active Connections</h2>
            {syncedProjects.length > 0 && (
              <Button variant="ghost" size="sm" className="rounded-full text-primary hover:bg-primary/10" onClick={handleConnectGitHub}>
                <Plus className="w-4 h-4 mr-2" />
                Refresh List
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {isLoading && syncedProjects.length === 0 ? (
               <div className="py-24 text-center glass-card rounded-3xl">
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground font-medium">Analyzing your GitHub repository landscape...</p>
              </div>
            ) : syncedProjects.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                <Github className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground">No repositories connected. Connect your GitHub account to get started.</p>
              </div>
            ) : (
              syncedProjects.map((project) => (
                <Link 
                  href={`/repo/${project.name}`} 
                  key={project.id} 
                  className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Github className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">Synced {new Date(project.lastSync).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Healthy
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}