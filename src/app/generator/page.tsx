"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { MOCK_COMMITS } from "@/lib/mock-data"
import { Sparkles, BrainCircuit, CheckCircle, ListChecks, ArrowRight, Loader2, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { categorizeChangelogEntry } from "@/ai/flows/categorize-changelog-entry-flow"
import { generateFeatureSummary } from "@/ai/flows/generate-feature-summary-flow"

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
      // 1. Summarize
      const { summary } = await generateFeatureSummary({
        commitMessages: selectedEntries.map(e => e.message)
      })

      // 2. Categorize the summary itself or pick a dominant category
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
    <div className="min-h-screen pt-24 pb-20 px-4">
      <Navbar />
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-headline font-bold">Commit Feed</h1>
              <p className="text-sm text-muted-foreground">Select clusters to synthesize into release notes.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
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
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                  entry.selected ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-card/50 hover:bg-card border-border'
                }`}
              >
                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  entry.selected ? 'bg-primary border-primary' : 'bg-transparent border-border'
                }`}>
                  {entry.selected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-relaxed">{entry.message}</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{entry.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="p-6 rounded-2xl border bg-card/50 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-headline font-bold text-xl">AI Processor</h2>
                  <p className="text-xs text-muted-foreground">Ready to reason about clusters.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Current Selection: <span className="text-foreground font-bold">{entries.filter(e => e.selected).length}</span> commits
                </div>
                
                <Button 
                  className="w-full h-12 bg-primary hover:bg-primary/90 rounded-full font-semibold"
                  disabled={isProcessing}
                  onClick={handleGenerate}
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Synthesize Changes
                      <Sparkles className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              {finalOutput && (
                <div className="pt-6 border-t space-y-4 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated Result</h3>
                  <div className="p-4 rounded-lg bg-secondary text-sm font-mono whitespace-pre-wrap leading-relaxed border border-border">
                    {finalOutput}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full"
                    onClick={exportMarkdown}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Markdown
                  </Button>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-4">
              <Sparkles className="w-5 h-5 text-primary mt-1" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Pro Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Group similar features or fixes together to get a more coherent summary from the AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}