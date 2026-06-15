"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Globe, CheckCircle2, ChevronRight, Plus } from "lucide-react"
import { MOCK_PROJECTS } from "@/lib/mock-data"

export default function SyncPage() {
  const [syncedProjects, setSyncedProjects] = useState(MOCK_PROJECTS)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-bold">Synchronize Repositories</h1>
          <p className="text-muted-foreground">Connect your development workflow to import history and project metadata.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="p-3 bg-secondary rounded-xl">
                  <Github className="w-8 h-8 text-[#fff]" />
                </div>
                <Button size="sm" variant="outline" className="rounded-full">Connect</Button>
              </div>
              <CardTitle className="pt-4">GitHub</CardTitle>
              <CardDescription>Import from public or private repositories.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="p-3 bg-secondary rounded-xl">
                  <Globe className="w-8 h-8 text-[#FC6D26]" />
                </div>
                <Button size="sm" variant="outline" className="rounded-full">Connect</Button>
              </div>
              <CardTitle className="pt-4">GitLab</CardTitle>
              <CardDescription>Support for GitLab.com and Self-Managed instances.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-bold">Active Connections</h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
          
          <div className="space-y-3">
            {syncedProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    {project.provider === 'github' ? <Github className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">Last synced: {new Date(project.lastSync).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    Synced
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}