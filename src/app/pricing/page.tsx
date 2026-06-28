"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Shield, Zap, Users } from "lucide-react"

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For individual developers exploring AI synthesis.",
    features: [
      "3 generations per month",
      "Public repository sync",
      "Basic AI models",
      "Community support"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Pro",
    price: "$9",
    description: "For active builders shipping weekly updates.",
    features: [
      "Unlimited generations",
      "Export to Markdown",
      "Private repository sync",
      "Advanced AI synthesis",
      "Priority support"
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Team",
    price: "$29",
    description: "For engineering teams scaling their context.",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Organization workspace",
      "Custom branding",
      "Dedicated account manager"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (tierName: string) => {
    if (tierName === "Free") {
      window.location.href = "/sync";
      return;
    }
    if (tierName === "Team") {
      window.location.href = "mailto:odinevaristus@gmail.com?subject=ChangelogAI Team Plan";
      return;
    }
    setLoading(true);
    const email = prompt("Enter your email to continue:");
    if (!email) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: tierName.toLowerCase() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment failed to initialize. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Simple, transparent pricing.</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your workflow. From solo founders to growing engineering teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative flex flex-col border-border bg-white/[0.01] transition-all hover:bg-white/[0.02] ${tier.popular ? 'border-primary shadow-lg shadow-primary/10 scale-105 z-10' : ''}`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-white hover:bg-primary px-3 py-1 font-bold uppercase tracking-wider text-[10px]">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-bold text-white">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild={false}
                  variant={tier.buttonVariant} 
                  className={`w-full h-11 font-bold uppercase tracking-widest text-[11px] rounded transition-all active:scale-[0.98] ${tier.buttonVariant === 'default' ? 'bg-white text-black hover:bg-white/90' : 'border-border hover:bg-white/5'}`}
                  onClick={() => handleUpgrade(tier.name)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="pt-20 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Trusted by modern teams
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale transition-all duration-500 hover:grayscale-0">
             <div className="flex items-center justify-center gap-2 font-headline font-bold text-white text-xl">
               <Shield className="w-6 h-6" /> SecurityLog
             </div>
             <div className="flex items-center justify-center gap-2 font-headline font-bold text-white text-xl">
               <Zap className="w-6 h-6" /> FastShip
             </div>
             <div className="flex items-center justify-center gap-2 font-headline font-bold text-white text-xl">
               <Users className="w-6 h-6" /> DevSync
             </div>
             <div className="flex items-center justify-center gap-2 font-headline font-bold text-white text-xl">
               <Check className="w-6 h-6" /> ShipPro
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
