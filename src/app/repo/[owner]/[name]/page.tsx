"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GitCommit, ArrowLeft, Loader2, Sparkles, ExternalLink, RefreshCw, Github } from "lucide-react"
import { fetchGitHubCommits } from "@/app/actions/github-actions"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function RepoCommitsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [commits, setCommits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const owner = params?.owner as string
  const repo = params?.name as string

  useEffect(() => {
    if (!owner || !repo) return

    const token = localStorage.getItem("github_pat")
    if (token) {
      loadCommits(token)
    } else {
      setError("Authentication required to view commits. Please provide a Personal Access Token.")
      setIsLoading(false)
    }
  }, [owner, repo])

  const loadCommits = async (token: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchGitHubCommits(token, owner, repo)
      setCommits(data)
    } catch (err: any) {
      setError(err.message || "Failed to load commits.")
      toast({
        title: "Fetch Error",
        description: err.message || "Could not fetch commits from GitHub.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    const token = localStorage.getItem("github_pat")
    if (token) {
      loadCommits(token)
    } else {
      router.push("/sync")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-background">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest animate-pulse">Syncing git log...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
          <div className="flex items-center gap-5">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded hover:bg-white/5 border border-transparent hover:border-border">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Github className="w-4 h-4 text-muted-foreground" />
                <h1 className="text-2xl font-bold text-white tracking-tight">{repo}</h1>
              </div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{owner} / {repo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRetry} className="rounded border-border h-9 text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Refresh
            </Button>
            <Button className="h-9 px-5 rounded text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-white/90" asChild>
              <Link href="/generator">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Synthesize
              </Link>
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="border-destructive/20 bg-destructive/5 rounded-lg">
            <CardContent className="py-10 text-center space-y-5">
              <div className="w-10 h-10 bg-destructive/10 rounded flex items-center justify-center mx-auto border border-destructive/20">
                <ExternalLink className="w-5 h-5 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase tracking-wider">Auth Failed</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">{error}</p>
              </div>
              <Button onClick={() => router.push("/sync")} variant="default" className="rounded px-8 h-10 text-xs font-bold uppercase tracking-widest">
                Update Token
              </Button>
            </CardContent>
          </Card>
        ) : commits.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg bg-white/[0.01]">
            <GitCommit className="w-8 h-8 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">No commits found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-0 border border-border rounded-lg overflow-hidden bg-white/[0.01]">
              {commits.map((commit, index) => (
                <div 
                  key={commit.id} 
                  className={cn(
                    "group p-4 flex items-start gap-4 hover:bg-white/[0.03] transition-colors",
                    index !== commits.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="mt-1 p-2 rounded bg-secondary border border-border flex-shrink-0 group-hover:border-primary/50 transition-colors">
                    <GitCommit className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-white/90 leading-snug tracking-tight">{commit.message}</p>
                      <a 
                        href={commit.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-white transition-all flex-shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="flex items-center gap-4 mono text-muted-foreground">
                      <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-secondary text-[11px] font-bold tracking-widest">
                        <span className="text-primary/70">#</span>
                        {commit.id}
                      </div>
                      <span className="opacity-30">•</span>
                      <span className="text-[11px] font-bold tracking-wider">{commit.author}</span>
                      <span className="opacity-30">•</span>
                      <span className="text-[11px] tracking-wider">{new Date(commit.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 flex justify-center">
              <Button size="lg" className="rounded h-12 px-10 text-xs font-bold uppercase tracking-[0.2em] bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5 active:scale-[0.98] transition-all group" asChild>
                <Link href="/generator">
                  Generate Release Notes
                  <Sparkles className="ml-3 w-4 h-4 transition-transform group-hover:rotate-12" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}