"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Github, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Key,
  ShieldCheck,
  Search,
  Check,
  Globe
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
    <div className="min-h-screen pt-24 pb-20 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        <header className="space-y-2 border-b border-border pb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Sources</h1>
          <p className="text-muted-foreground text-sm">Connect your providers to start syncing code history.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div className="group p-5 rounded-lg border border-border bg-white/[0.01] hover:bg-white/[0.03] hover:border-border/80 transition-all cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-bold text-white">GitHub</h2>
                    <p className="text-xs text-muted-foreground">Personal Access Token</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider rounded border-border group-hover:bg-primary group-hover:text-white transition-colors">
                  Connect
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background border-border">
              <DialogHeader>
                <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <DialogTitle className="text-xl font-bold">Connect GitHub</DialogTitle>
                <DialogDescription className="text-sm">
                  Provide a Personal Access Token (classic) with <code className="text-primary font-mono bg-primary/5 px-1 py-0.5 rounded">repo</code> scope.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="h-11 pl-10 rounded border-border bg-white/5 mono focus:ring-primary focus:border-primary"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
                <div className="bg-secondary p-3 rounded text-[11px] text-muted-foreground flex gap-3 border border-border">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>Tokens are stored only in your local browser session and never sent to our servers except for direct GitHub API requests.</p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  className="w-full h-11 text-sm font-bold rounded" 
                  onClick={handleConnectGitHub}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify Connection"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="p-5 rounded-lg border border-border bg-white/[0.01] opacity-40 grayscale flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center border border-border">
                <Globe className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-white">GitLab</h2>
                <p className="text-xs text-muted-foreground">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-lg font-bold text-white tracking-tight">Active Repositories</h2>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{syncedProjects.length} found</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {isLoading && syncedProjects.length === 0 ? (
               <div className="py-20 text-center border border-dashed border-border rounded-lg bg-white/[0.01]">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-primary" />
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Scanning GitHub landscape...</p>
              </div>
            ) : syncedProjects.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-border rounded-lg bg-white/[0.01]">
                <Github className="w-8 h-8 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No repositories found. Connect an account to start.</p>
              </div>
            ) : (
              syncedProjects.map((project) => (
                <Link 
                  href={`/repo/${project.name}`} 
                  key={project.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-white/[0.01] hover:bg-white/[0.03] hover:border-border/80 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded bg-secondary flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                      <Github className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{project.name}</h3>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Synced {new Date(project.lastSync).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[9px] font-bold uppercase tracking-widest">
                      <Check className="w-2.5 h-2.5" />
                      Live
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
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
