import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Share2, Twitter, Linkedin, Copy, Download, Sparkles } from "lucide-react";
import { ShareableProfileCard } from "@/components/ShareableProfileCard";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ShareProfile = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([
    {
      skillName: "React & TypeScript",
      category: "hard" as const,
      confidence: 92,
      evidenceSnippet: "Built multiple production applications",
      source: "GitHub",
      sourceUrl: "https://github.com"
    },
    {
      skillName: "Python & FastAPI",
      category: "hard" as const,
      confidence: 88,
      evidenceSnippet: "Developed REST APIs",
      source: "GitHub",
      sourceUrl: "https://github.com"
    },
    {
      skillName: "Leadership & Mentoring",
      category: "soft" as const,
      confidence: 85,
      evidenceSnippet: "Led team of 5 developers",
      source: "CV"
    },
    {
      skillName: "Problem Solving",
      category: "soft" as const,
      confidence: 90,
      evidenceSnippet: "Resolved complex challenges",
      source: "CV"
    },
    {
      skillName: "PostgreSQL & Databases",
      category: "hard" as const,
      confidence: 82,
      evidenceSnippet: "Designed database schemas",
      source: "GitHub",
      sourceUrl: "https://github.com"
    }
  ]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-4 h-16 px-6">
              <SidebarTrigger className="text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Share2 className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-semibold">Share Profile</h1>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Hero Section */}
            <div className="mb-12 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Viral Growth Feature</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Share Your
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Skill Profile
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Create beautiful, shareable profile cards for social media. Stand out on Twitter, LinkedIn, 
                and other platforms with your AI-discovered skills.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Twitter className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Twitter Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Optimized cards for maximum engagement on Twitter
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Linkedin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">LinkedIn Perfect</h3>
                <p className="text-sm text-muted-foreground">
                  Professional cards that shine on LinkedIn
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Download & Share</h3>
                <p className="text-sm text-muted-foreground">
                  Save as image or copy link to share anywhere
                </p>
              </Card>
            </div>

            {/* Shareable Profile Card */}
            <div className="max-w-3xl mx-auto">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">Your Shareable Profile Card</h3>
                  <p className="text-muted-foreground">
                    Customize and share your professional profile
                  </p>
                </div>
                
                <ShareableProfileCard 
                  name={user?.email?.split('@')[0] || 'Demo User'}
                  email={user?.email || 'demo@skillsense.ai'}
                  skills={skills}
                  profileUrl={window.location.origin + '/profile'}
                />
              </Card>
            </div>

            {/* Tips Section */}
            <div className="mt-12 max-w-3xl mx-auto">
              <Card className="p-6 bg-muted/50">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Sharing Tips for Maximum Impact
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">1</Badge>
                    <p>
                      <strong className="text-foreground">Best Time to Post:</strong> Tuesday-Thursday, 
                      9-11 AM or 1-3 PM for maximum engagement
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">2</Badge>
                    <p>
                      <strong className="text-foreground">Add Context:</strong> Include a brief story 
                      about your journey or a recent achievement
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">3</Badge>
                    <p>
                      <strong className="text-foreground">Use Hashtags:</strong> #TechSkills #CareerGrowth 
                      #AIDiscovered #SkillProfile
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">4</Badge>
                    <p>
                      <strong className="text-foreground">Tag Relevant People:</strong> Mention mentors, 
                      colleagues, or companies you'd like to connect with
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <h3 className="text-2xl font-bold mb-3">Turn Your Profile Into Your Best Marketing Tool</h3>
                <p className="text-muted-foreground mb-6">
                  Every share helps you build your personal brand and attract opportunities. 
                  Your skills deserve to be seen!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button size="lg" className="gap-2">
                    <Twitter className="w-4 h-4" />
                    Share on Twitter
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Linkedin className="w-4 h-4" />
                    Share on LinkedIn
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ShareProfile;
