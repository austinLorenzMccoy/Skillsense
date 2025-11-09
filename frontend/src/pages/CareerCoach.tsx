import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import { AICareerCoach } from "@/components/AICareerCoach";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "@/lib/api";

const CareerCoach = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Array<{ name: string; confidence: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserSkills = async () => {
      try {
        // Try to load user's actual skills from their profile
        // For now, use mock data
        const mockSkills = [
          { name: "React & TypeScript", confidence: 92 },
          { name: "Python & FastAPI", confidence: 88 },
          { name: "Leadership & Mentoring", confidence: 85 },
          { name: "Problem Solving", confidence: 90 },
          { name: "Web3 & Blockchain", confidence: 65 },
        ];
        setSkills(mockSkills);
      } catch (error) {
        console.error("Error loading skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSkills();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1">
          {/* Header with Sidebar Toggle */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-4 h-16 px-6">
              <SidebarTrigger className="text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-semibold">AI Career Coach</h1>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Hero Section */}
            <div className="mb-12 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Powered by Groq AI</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Personal
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Career Coach
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get personalized career advice, skill recommendations, salary insights, and interview preparation 
                tailored to your unique skill profile.
              </p>
            </div>

            {/* Features Overview */}
            <div className="grid md:grid-cols-5 gap-4 mb-12 max-w-5xl mx-auto">
              <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-sm">Skill Gap Analysis</h3>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-semibold text-sm">Learning Paths</h3>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold text-sm">Salary Insights</h3>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                <div className="text-2xl mb-2">💼</div>
                <h3 className="font-semibold text-sm">Interview Prep</h3>
              </Card>
              <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                <div className="text-2xl mb-2">💡</div>
                <h3 className="font-semibold text-sm">Daily Tips</h3>
              </Card>
            </div>

            {/* AI Career Coach Component */}
            <div className="max-w-5xl mx-auto">
              {isLoading ? (
                <Card className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your skills...</p>
                </Card>
              ) : (
                <AICareerCoach skills={skills} />
              )}
            </div>

            {/* Info Banner */}
            <Card className="mt-12 p-6 bg-muted/50 max-w-5xl mx-auto">
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">How It Works</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI Career Coach analyzes your skill profile and provides personalized recommendations 
                    using advanced language models. Click any button above to get instant, tailored advice 
                    for your career growth. All advice is generated in real-time based on your current skills 
                    and market trends.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CareerCoach;
