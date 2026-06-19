
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GitCommit, ArrowLeft, Loader2, Sparkles, ExternalLink } from "lucide-react"
import { fetchGitHubCommits } from "@/app/actions/github-actions"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function RepoCommitsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session }: any = useSession()
  const { toast } = useToast()
  
  const [commits, setCommits] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const owner = params.owner as string
  const repo = params.name as string

  useEffect(() => {
    if (session?.accessToken) {
      loadCommits()
    } else if (session === null) {
      setError("Authentication required to view commits.")
      setIsLoading(false)
    }
  }, [session, owner, repo])

  const loadCommits = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchGitHubCommits(session.accessToken, owner, repo)
      setCommits(data)
    } catch (err: any) {
      setError(err.message || "Failed to load commits.")
      toast({
        title: "Error",
        description: err.message || "Could not fetch commits from GitHub.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-headline font-bold">{repo}</h1>
              <p className="text-sm text-muted-foreground">By {owner} • Showing recent commits</p>
            </div>
          </div>
          <Button className="rounded-full bg-primary hover:bg-primary/90" asChild>
            <Link href="/generator">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Changelog
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-destructive font-medium">{error}</p>
              <Button onClick={loadCommits} variant="outline" size="sm">Try Again</Button>
            </CardContent>
          </Card>
        ) : commits.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-2xl">
            <p className="text-muted-foreground">No commits found for this repository.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commits.map((commit) => (
              <div 
                key={commit.id} 
                className="group p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/30 transition-all flex items-start gap-4"
              >
                <div className="mt-1 p-2 rounded-lg bg-secondary flex-shrink-0">
                  <GitCommit className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-relaxed">{commit.message}</p>
                    <a 
                      href={commit.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="font-mono font-bold text-primary/70">{commit.id}</span>
                    <span>•</span>
                    <span className="font-medium text-foreground/70">{commit.author}</span>
                    <span>•</span>
                    <span>{new Date(commit.date).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
