
"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitBranch, Plus, Zap, History, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <Navbar />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your repositories and synthesize your latest changes.</p>
          </div>
          <Button className="rounded-full" asChild>
            <Link href="/sync">
              <Plus className="w-4 h-4 mr-2" />
              Sync New Repo
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Commits" 
            value="124" 
            description="Synced this month" 
            icon={GitBranch}
          />
          <StatCard 
            title="AI Summaries" 
            value="12" 
            description="Generated notes" 
            icon={Zap}
          />
          <StatCard 
            title="Timeline Posts" 
            value="8" 
            description="Published updates" 
            icon={History}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription>Your latest repository synchronization tasks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed">
                <LayoutDashboard className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No recent activity. Start by syncing a repository.</p>
                <Button variant="link" className="text-primary" asChild>
                  <Link href="/sync">Connect your first repo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start rounded-xl h-12" asChild>
                <Link href="/generator">
                  <Zap className="w-4 h-4 mr-3 text-primary" />
                  Generate Release Notes
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl h-12" asChild>
                <Link href="/timeline">
                  <History className="w-4 h-4 mr-3 text-primary" />
                  View Public Timeline
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl h-12" asChild>
                <Link href="/sync">
                  <GitBranch className="w-4 h-4 mr-3 text-primary" />
                  Manage Connections
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, description, icon: Icon }: any) {
  return (
    <Card className="bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
