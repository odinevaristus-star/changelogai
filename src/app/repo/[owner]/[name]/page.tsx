"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GitCommit, ArrowLeft, Loader2, Sparkles, ExternalLink, RefreshCw } from "lucide-react"
import { fetchGitHubCommits } from "@/app/actions/github-actions"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function RepoCommitsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [commits, setCommits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const owner = params.owner as string
  const repo = params.name as string

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
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Syncing commit history...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-headline font-bold">{repo}</h1>
              <p className="text-sm text-muted-foreground">Source: github.com/{owner}/{repo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRetry} className="rounded-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" asChild>
              <Link href="/generator">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Changelog
              </Link>
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
            <CardContent className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="w-6 h-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-destructive font-bold text-lg">Authentication Failed</p>
                <p className="text-muted-foreground max-w-sm mx-auto">{error}</p>
              </div>
              <Button onClick={() => router.push("/sync")} variant="default" className="rounded-full px-8">
                Go to Sync Settings
              </Button>
            </CardContent>
          </Card>
        ) : commits.length === 0 ? (
          <div className="text-center py-24 border border-dashed rounded-3xl bg-secondary/10">
            <GitCommit className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">No recent commits found for this repository.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {commits.map((commit) => (
                <div 
                  key={commit.id} 
                  className="group p-4 rounded-2xl border border-border bg-card/30 hover:bg-card hover:border-primary/40 transition-all duration-300 flex items-start gap-4"
                >
                  <div className="mt-1 p-2.5 rounded-xl bg-secondary flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <GitCommit className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold leading-relaxed tracking-tight text-foreground/90">{commit.message}</p>
                      <a 
                        href={commit.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-all flex-shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-medium">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono">
                        <span className="text-primary/70">#</span>
                        {commit.id}
                      </div>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-foreground/70">{commit.author}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-muted-foreground">{new Date(commit.date).toLocaleDateString()} at {new Date(commit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 flex justify-center">
              <Button size="lg" className="rounded-full px-12 h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 group" asChild>
                <Link href="/generator">
                  Synthesize These Changes
                  <Sparkles className="ml-3 w-5 h-5 group-hover:animate-spin-slow" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
