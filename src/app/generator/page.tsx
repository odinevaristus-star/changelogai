"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { MOCK_COMMITS } from "@/lib/mock-data"
import { Sparkles, BrainCircuit, Check, CheckCircle, Loader2, Download, Terminal, Layers, Github } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { categorizeChangelogEntry } from "@/ai/flows/categorize-changelog-entry-flow"
import { generateFeatureSummary } from "@/ai/flows/generate-feature-summary-flow"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Entry = {
  id: string
  message: string
  category?: 'Features' | 'Improvements' | 'Bug Fixes' | 'Other'
  summary?: string
  selected: boolean
}

export default function GeneratorPage() {
  const { data: session } = useSession()
  const [entries, setEntries] = useState<Entry[]>(
    MOCK_COMMITS.map(c => ({ ...c, selected: false }))
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [finalOutput, setFinalOutput] = useState<string | null>(null)
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const router = useRouter();
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

    const usageRes = await fetch("/api/usage/check", { method: "POST" });
    const usageData = await usageRes.json();
    if (!usageData.allowed) {
      setShowLimitDialog(true);
      return;
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
        title: "Synthesis Complete",
        description: "AI has successfully analyzed your changes."
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
    if (!finalOutput) return;
    // @ts-ignore - session user interface extension
    if (!session?.user?.isPro) {
      setShowLimitDialog(true);
      return;
    }
    const blob = new Blob([finalOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `changelog-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Feed Column */}
          <div className="lg:col-span-7 space-y-8">
            <header className="flex items-center justify-between border-b border-border pb-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">Synthesis Feed</h1>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Select clusters to process</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-[10px] font-bold uppercase tracking-widest rounded border-border hover:bg-white/5 transition-all"
                onClick={() => setEntries(prev => prev.map(e => ({ ...e, selected: true })))}
              >
                Select All
              </Button>
            </header>

            <div className="space-y-2">
              {entries.map((entry) => (
                <div 
                  key={entry.id} 
                  onClick={() => toggleSelection(entry.id)}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-4 group",
                    entry.selected 
                      ? "bg-primary/5 border-primary shadow-sm" 
                      : "bg-white/[0.01] hover:bg-white/[0.03] border-border"
                  )}
                >
                  <div className={cn(
                    "mt-1 flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-all",
                    entry.selected 
                      ? "bg-primary border-primary" 
                      : "bg-secondary border-border group-hover:border-primary/50"
                  )}>
                    {entry.selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className={cn(
                      "text-sm leading-relaxed transition-colors tracking-tight",
                      entry.selected ? "text-white font-semibold" : "text-muted-foreground group-hover:text-white"
                    )}>
                      {entry.message}
                    </p>
                    <div className="mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                      SHA {entry.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Processor Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-lg border border-border bg-white/[0.01] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-4 relative">
                  <div className="w-10 h-10 rounded bg-primary flex items-center justify-center border border-white/10 shadow-lg shadow-primary/20">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg tracking-tight">AI Engine</h2>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Synthesis v2.1-stable</p>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between p-3 rounded bg-secondary border border-border">
                    <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <Layers className="w-3.5 h-3.5" />
                      Context
                    </div>
                    <span className="mono text-white text-base font-bold">{entries.filter(e => e.selected).length}</span>
                  </div>
                  
                  <Button 
                    className="w-full h-12 bg-white text-black hover:bg-white/90 text-xs font-bold uppercase tracking-[0.2em] rounded transition-all active:scale-[0.98] shadow-lg shadow-white/5"
                    disabled={isProcessing}
                    onClick={handleGenerate}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Run Synthesis</span>
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>

                {finalOutput && (
                  <div className="pt-6 border-t border-border space-y-5 animate-fade-in relative">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Output</h3>
                      <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="p-4 rounded bg-black/50 text-[13px] font-mono text-white/90 whitespace-pre-wrap leading-relaxed border border-border shadow-inner max-h-[300px] overflow-auto">
                      {finalOutput}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full h-10 rounded border-border hover:bg-white/5 text-[11px] font-bold uppercase tracking-widest"
                      onClick={exportMarkdown}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Markdown
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-4">
                <Sparkles className="w-4 h-4 text-primary mt-1 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  <strong className="text-white">Pro Tip:</strong> Grouping 3-5 related commits often yields the highest quality summaries for your public changelog.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Monthly limit reached</AlertDialogTitle>
            <AlertDialogDescription>
              You've used all 3 free changelog generations this month. Upgrade to Pro for unlimited generations, private repo sync, and Markdown export.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe later</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/pricing')}>
              Upgrade to Pro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
