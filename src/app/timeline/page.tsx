"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function TimelinePage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/timeline/entries?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setEntries(data.entries || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [session])

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold">Release Timeline</h1>
            <p className="text-muted-foreground italic">Your published changelogs will appear here.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Share2 className="w-4 h-4 mr-2" />Share
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="w-4 h-4 mr-2" />Export All
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground text-sm">No changelogs published yet.</p>
            <p className="text-muted-foreground text-xs mt-2">Generate a changelog and publish it to see it here.</p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="relative space-y-8">
            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-border hidden md:block" />
            {entries.map((entry) => (
              <div key={entry.id} className="relative md:pl-16 space-y-4">
                <div className="absolute left-[13px] top-1 w-3 h-3 rounded-full bg-primary border-4 border-background hidden md:block" />
                <div className="text-xs text-muted-foreground font-mono">
                  {new Date(entry.createdAt).toLocaleDateString()} · {entry.repoName}
                </div>
                <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary">
                    {entry.category}
                  </span>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap mt-3">
                    {entry.content}
                  </p>
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                    Published by {entry.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">You've reached the beginning of the story.</p>
        </div>
      </div>
    </div>
  )
}
