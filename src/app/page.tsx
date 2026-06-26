"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { ArrowRight, GitBranch, History, Sparkles, Github, Globe, Cpu } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto text-center space-y-12 animate-fade-in relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Redefining Release Notes</span>
          </div>
          
          <div className="space-y-6 max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-headline font-bold leading-[1.1] tracking-tighter">
              Ship context, <br />
              not just <span className="gradient-text italic">code.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Automatically synthesize complex Git history into beautiful, human-readable 
              product updates that your team and customers will actually read.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 group" asChild>
              <Link href="/sync">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-full border-white/10 hover:bg-white/5" asChild>
              <Link href="/timeline">Explore Demo</Link>
            </Button>
          </div>
          
          {/* Dashboard Preview / Placeholder */}
          <div className="pt-24 max-w-6xl mx-auto px-4">
            <div className="relative p-2 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl">
              <div className="bg-background rounded-2xl overflow-hidden aspect-[16/9] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Cpu className="w-16 h-16 text-primary/40 mx-auto animate-pulse" />
                  <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">Intelligent Synthesis Engine V2.0</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="pt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={GitBranch} 
              title="Repo Synchronizer" 
              description="Seamlessly bridge your codebase. Import repos instantly with secure PAT-based authentication."
            />
            <FeatureCard 
              icon={Sparkles} 
              title="AI Semantic Engine" 
              description="We don't just list commits. We reason through them to find the underlying story of your features."
            />
            <FeatureCard 
              icon={History} 
              title="Interactive Timeline" 
              description="A polished public-facing feed designed for stakeholders who care about impact, not syntax."
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-headline font-bold text-lg text-white">changelogai</span>
          </div>
          
          <div className="flex gap-8 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Security</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
          
          <p className="text-xs">© 2024 ChangelogAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] text-left space-y-4 hover:border-primary/50 transition-all duration-500 group">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-inner">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-headline font-bold text-xl text-white">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}