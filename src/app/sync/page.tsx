
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
  Key
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
import { Project } from "@/lib/mock-data"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function SyncPage() {
  const { data: session }: any = useSession()
  const [syncedProjects, setSyncedProjects] = useState<Project[]>([])
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Auto-sync if session has a token
  useEffect(() => {
    if (session?.accessToken && syncedProjects.length === 0 && !isSyncing) {
      autoSync(session.accessToken)
    }
  }, [session, syncedProjects.length])

  const autoSync = async (accessToken: string) => {
    setIsSyncing(true)
    try {
      const repos = await fetchGitHubRepos(accessToken)
      setSyncedProjects(repos)
    } catch (error: any) {
      console.error("Auto-sync failed", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleConnectGitHub = async () => {
    const activeToken = token || session?.accessToken
    if (!activeToken) {
      toast({
        title: "Token required",
        description: "Please enter a GitHub Personal Access Token or sign in via GitHub.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const repos = await fetchGitHubRepos(activeToken)
      setSyncedProjects(repos)
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
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-bold">Synchronize Repositories</h1>
          <p className="text-muted-foreground">Connect your development workflow to import history and project metadata.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-secondary rounded-xl">
                      <Github className="w-8 h-8 text-[#fff]" />
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full">Connect</Button>
                  </div>
                  <CardTitle className="pt-4">GitHub</CardTitle>
                  <CardDescription>Import from public or private repositories using a PAT.</CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect GitHub Account</DialogTitle>
                <DialogDescription>
                  Enter a Personal Access Token (classic) with <code className="text-primary">repo</code> scope.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 py-4">
                <div className="grid flex-1 gap-2">
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="token"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="pl-10"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg flex gap-3 text-xs text-muted-foreground mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-primary" />
                <p>We only use this token to read repository metadata. This session token is stored temporarily in your browser.</p>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="w-full rounded-full" 
                  onClick={handleConnectGitHub}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify & Connect"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card className="bg-card border-border opacity-50 cursor-not-allowed">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="p-3 bg-secondary rounded-xl">
                  <Globe className="w-8 h-8 text-[#FC6D26]" />
                </div>
                <Button size="sm" variant="outline" className="rounded-full" disabled>Coming Soon</Button>
              </div>
              <CardTitle className="pt-4">GitLab</CardTitle>
              <CardDescription>GitLab integration is currently under development.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold">Active Connections</h2>
            {syncedProjects.length > 0 && (
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={handleConnectGitHub}>
                <Plus className="w-4 h-4 mr-2" />
                Refresh Repos
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {isSyncing ? (
               <div className="text-center py-12 border border-dashed rounded-2xl bg-card/20">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Syncing your GitHub repositories...</p>
              </div>
            ) : syncedProjects.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-2xl bg-card/20">
                <p className="text-sm text-muted-foreground">No repositories connected yet.</p>
              </div>
            ) : (
              syncedProjects.map((project) => (
                <Link 
                  href={`/repo/${project.name}`} 
                  key={project.id} 
                  className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">Last updated: {new Date(project.lastSync).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
