"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { ArrowRight, GitBranch, History, Sparkles, Github, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20 px-4">
        <section className="max-w-5xl mx-auto space-y-12 animate-fade-in">
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>v2.0 Now Live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tight text-white max-w-4xl mx-auto">
              Transform your code history into <span className="text-primary">human context.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Automate your release notes. Ship beautiful, synthesized updates 
              directly from your GitHub commits in seconds.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button size="lg" className="h-11 px-8 text-sm font-semibold rounded-md bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5 transition-all active:scale-[0.98]" asChild>
              <Link href="/sync">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-11 px-8 text-sm font-semibold rounded-md border-border bg-transparent hover:bg-white/5 transition-all" asChild>
              <Link href="/timeline">View Demo</Link>
            </Button>
          </div>
          
          {/* Visual Divider/Preview */}
          <div className="pt-20">
            <div className="relative p-px rounded-xl bg-gradient-to-b from-border to-transparent overflow-hidden">
              <div className="bg-black/40 rounded-[11px] overflow-hidden aspect-[21/9] border border-white/5 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #30363d 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div className="text-center space-y-3 z-10">
                  <div className="flex justify-center -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center">
                        <Github className="w-4 h-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">Engine connected: production-cluster-01</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={GitBranch} 
              title="Repo Sync" 
              description="Connect your GitHub repositories in seconds using secure Personal Access Tokens."
            />
            <FeatureCard 
              icon={Sparkles} 
              title="AI Synthesis" 
              description="Our specialized engine analyzes commit diffs to extract actual user value, not just diffs."
            />
            <FeatureCard 
              icon={History} 
              title="Public Timeline" 
              description="Publish high-fidelity changelogs to a beautiful timeline for your stakeholders."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-12 px-4 bg-background">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-white" />
            <span className="font-headline font-bold text-white">changelogai</span>
          </div>
          
          <div className="flex gap-8 text-xs font-medium">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">Docs</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
          
          <p className="text-[10px] uppercase tracking-widest font-mono">© 2024 ChangelogAI V2.1</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-lg border border-border bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group">
      <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center mb-5 group-hover:border-primary/50 transition-colors">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <h3 className="font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
