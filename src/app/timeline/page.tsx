"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, ExternalLink, Share2, Tag } from "lucide-react"

export default function TimelinePage() {
  const updates = [
    {
      id: "v2.4.0",
      date: "May 22, 2024",
      title: "Security & UI Enhancements",
      categories: [
        { name: "Features", color: "bg-primary" },
        { name: "Improvements", color: "bg-accent" }
      ],
      description: "This release focuses on strengthening our authentication infrastructure with Multi-Factor Authentication and optimizing performance for complex visual components.",
      points: [
        "Implemented secure MFA flows using time-based one-time passwords.",
        "Refreshed architectural documentation for better onboarding.",
        "Optimized image loading logic in the primary feed component."
      ]
    },
    {
      id: "v2.3.9",
      date: "May 21, 2024",
      title: "Stability Patch",
      categories: [
        { name: "Bug Fixes", color: "bg-destructive" }
      ],
      description: "Addressed critical performance bottlenecks in real-time communication protocols.",
      points: [
        "Fixed a memory leak in the WebSocket handler that affected long-running sessions.",
        "Improved error handling for failed search filter requests."
      ]
    }
  ]

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold">Release Timeline</h1>
            <p className="text-muted-foreground italic">Chronological feed of nebula-core updates.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        <div className="relative space-y-16">
          <div className="absolute left-0 md:left-4 top-0 bottom-0 w-[2px] timeline-line hidden md:block" />
          
          {updates.map((update) => (
            <div key={update.id} className="relative md:pl-16 space-y-6 group">
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-[13px] top-1 w-3 h-3 rounded-full bg-primary border-4 border-background ring-4 ring-primary/20 hidden md:block" />
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-bold font-mono">
                  <Tag className="w-3 h-3 text-primary" />
                  {update.id}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Calendar className="w-3 h-3" />
                  {update.date}
                </div>
              </div>

              <div className="p-8 rounded-3xl border border-border bg-card/40 backdrop-blur-sm shadow-xl space-y-6 hover:border-primary/30 transition-all">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {update.categories.map((cat) => (
                      <Badge key={cat.name} className={`${cat.color} text-primary-foreground font-bold uppercase tracking-wider text-[10px] rounded-sm`}>
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-headline font-bold leading-tight group-hover:text-primary transition-colors">
                    {update.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {update.description}
                  </p>
                </div>

                <ul className="space-y-3">
                  {update.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex items-center justify-between border-t border-border/50">
                  <Button variant="link" className="text-primary p-0 h-auto font-bold text-xs uppercase tracking-widest">
                    Read Full Notes
                    <ExternalLink className="ml-2 w-3 h-3" />
                  </Button>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Updated by @alex.rivera
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">You've reached the beginning of the story.</p>
        </div>
      </div>
    </div>
  )
}