"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { MOCK_COMMITS } from "@/lib/mock-data"
import { Sparkles, BrainCircuit, CheckCircle, ListChecks, ArrowRight, Loader2, Download, Terminal, Layers } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { categorizeChangelogEntry } from "@/ai/flows/categorize-changelog-entry-flow"
import { generateFeatureSummary } from "@/ai/flows/generate-feature-summary-flow"
import { cn } from "@/lib/utils"

type Entry = {
  id: string
  message: string
  category?: 'Features' | 'Improvements' | 'Bug Fixes' | 'Other'
  summary?: string
  selected: boolean
}

export default function GeneratorPage() {
  const [entries, setEntries] = useState<Entry[]>(
    MOCK_COMMITS.map(c => ({ ...c, selected: false }))
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [finalOutput, setFinalOutput] = useState<string | null>(null)
  const { toast } = useToast()

  const toggleSelection = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e))
  }

  const handleGenerate = async () => {
    const selectedEntries = entries.filter(e => e.selected)
    if (selectedEntries.length === 0) {
      toast({
        title: "No commits selected",
        description: "Please select at least one commit message to process.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    try {
      const { summary } = await generateFeatureSummary({
        commitMessages: selectedEntries.map(e => e.message)
      })

      const { category } = await categorizeChangelogEntry({
        entry: summary
      })

      setFinalOutput(`### ${category}\n\n${summary}`)
      toast({
        title: "Changelog Generated",
        description: "AI has successfully synthesized your changes."
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "An error occurred while communicating with the AI.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const exportMarkdown = () => {
    if (!finalOutput) return
    const blob = new Blob([finalOutput], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `changelog-${new Date().toISOString().split('T')[0]}.md`
    a.click()
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Feed Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-4xl font-headline font-bold">Commit Feed</h1>
                <p className="text-muted-foreground">Select clusters to synthesize into release notes.</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full bg-white/5 border-white/10 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => setEntries(prev => prev.map(e => ({ ...e, selected: true })))}
              >
                <ListChecks className="w-4 h-4 mr-2" />
                Select All
              </Button>
            </div>

            <div className="space-y-3">
              {entries.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => toggleSelection(entry.id)}
                  className={cn(
                    "p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-6 group",
                    entry.selected 
                      ? "bg-primary/10 border-primary shadow-lg shadow-primary/5" 
                      : "bg-white/[0.02] hover:bg-white/[0.04] border-white/5"
                  )}
                >
                  <div className={cn(
                    "mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                    entry.selected 
                      ? "bg-primary border-primary" 
                      : "bg-transparent border-white/10 group-hover:border-primary/50"
                  )}>
                    {entry.selected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className={cn(
                      "text-base leading-relaxed transition-colors",
                      entry.selected ? "text-white font-semibold" : "text-foreground/80 group-hover:text-foreground"
                    )}>
                      {entry.message}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        SHA {entry.id}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Processor Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/20 blur-[60px] rounded-full" />
                
                <div className="flex items-center gap-4 relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center">
                    <BrainCircuit className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-2xl">AI Processor</h2>
                    <p className="text-sm text-muted-foreground">Ready to analyze changes.</p>
                  </div>
                </div>

                <div className="space-y-6 relative">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3 text-sm">
                      <Layers className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Context Size:</span>
                    </div>
                    <span className="text-foreground font-black text-xl">{entries.filter(e => e.selected).length}</span>
                  </div>
                  
                  <Button 
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 group disabled:opacity-50"
                    disabled={isProcessing}
                    onClick={handleGenerate}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Synthesizing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span>Synthesize Release Notes</span>
                        <Sparkles className="w-6 h-6 transition-transform group-hover:rotate-12" />
                      </div>
                    )}
                  </Button>
                </div>

                {finalOutput && (
                  <div className="pt-8 border-t border-white/10 space-y-6 animate-fade-in relative">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Preview Result</h3>
                      <Terminal className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="p-6 rounded-2xl bg-black/40 text-sm font-mono whitespace-pre-wrap leading-relaxed border border-white/10 shadow-inner max-h-[400px] overflow-auto">
                      {finalOutput}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 text-base font-bold"
                      onClick={exportMarkdown}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Export as Markdown
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Engine Optimization</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The AI performs best when you group related changes together. Try selecting 3-7 commits for a single summary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}