
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { ArrowRight, GitBranch, History, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Release Notes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight">
            Turn your <span className="text-primary italic">commits</span> <br />
            into context.
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ChangelogAI synchronizes with your Git history to automatically categorize and 
            synthesize technical changes into human-readable product updates.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 font-semibold rounded-full bg-primary hover:bg-primary/90" asChild>
              <Link href="/sync">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 font-semibold rounded-full border-muted-foreground/20" asChild>
              <Link href="/timeline">View Demo</Link>
            </Button>
          </div>
          
          <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={GitBranch} 
              title="Repo Sync" 
              description="Connect your GitHub repositories using a Personal Access Token."
            />
            <FeatureCard 
              icon={Sparkles} 
              title="AI Synthesis" 
              description="Group complex commits into meaningful feature summaries."
            />
            <FeatureCard 
              icon={History} 
              title="High-Fi Feed" 
              description="Beautiful, chronological timeline for your stakeholders."
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl border bg-card/50 text-left space-y-3 hover:border-primary/50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-2">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-headline font-bold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}
