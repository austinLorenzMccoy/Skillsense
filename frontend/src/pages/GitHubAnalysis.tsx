import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Github, Sparkles, Code, GitBranch, Star, TrendingUp, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const GitHubAnalysis = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const analyzeGitHub = async () => {
    if (!githubUrl) {
      toast({
        title: "GitHub URL Required",
        description: "Please enter your GitHub profile URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Mock analysis for demo (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        username: githubUrl.split('/').pop(),
        totalRepos: 42,
        languages: [
          { name: "TypeScript", percentage: 35, color: "#3178c6" },
          { name: "Python", percentage: 28, color: "#3776ab" },
          { name: "JavaScript", percentage: 20, color: "#f7df1e" },
          { name: "Go", percentage: 12, color: "#00add8" },
          { name: "Other", percentage: 5, color: "#gray" },
        ],
        topSkills: [
          { name: "React & Frontend", confidence: 92, repos: 15 },
          { name: "Python & Backend", confidence: 88, repos: 12 },
          { name: "DevOps & CI/CD", confidence: 75, repos: 8 },
          { name: "API Development", confidence: 85, repos: 10 },
          { name: "Database Design", confidence: 78, repos: 7 },
        ],
        activityScore: 87,
        contributions: 1247,
        stars: 234,
      };

      setAnalysis(mockAnalysis);
      toast({
        title: "Analysis Complete!",
        description: `Found ${mockAnalysis.topSkills.length} technical skills from your GitHub`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze GitHub profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
                <Github className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-semibold">GitHub Skill Extraction</h1>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Hero Section */}
            <div className="mb-12 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>🔥 Exclusive Feature</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Extract Skills From
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Your GitHub Profile
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                AI-powered analysis of your repositories, commits, and code patterns to discover technical skills 
                you didn't even list on your CV.
              </p>
            </div>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="p-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="github-url" className="text-lg font-semibold">
                      GitHub Profile URL
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter your GitHub username or full profile URL
                    </p>
                    <div className="flex gap-3">
                      <Input
                        id="github-url"
                        type="text"
                        placeholder="https://github.com/yourusername or just 'yourusername'"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="flex-1"
                        disabled={isAnalyzing}
                      />
                      <Button 
                        onClick={analyzeGitHub}
                        disabled={isAnalyzing}
                        size="lg"
                        className="gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Github className="w-4 h-4" />
                            Analyze
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      What We Analyze:
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Programming languages and frameworks used
                      </li>
                      <li className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        Repository structure and patterns
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Contribution frequency and quality
                      </li>
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Technical complexity and expertise level
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Repositories</span>
                      <Github className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{analysis.totalRepos}</div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Contributions</span>
                      <GitBranch className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold">{analysis.contributions}</div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Stars Earned</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold">{analysis.stars}</div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Activity Score</span>
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold">{analysis.activityScore}%</div>
                  </Card>
                </div>

                {/* Language Breakdown */}
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Language Distribution</h3>
                  <div className="space-y-4">
                    {analysis.languages.map((lang: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: lang.color }}
                            />
                            <span className="font-medium">{lang.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            {lang.percentage}%
                          </span>
                        </div>
                        <Progress value={lang.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Discovered Skills */}
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Discovered Technical Skills</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysis.topSkills.map((skill: any, index: number) => (
                      <Card key={index} className="p-6 bg-muted/50">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{skill.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Found in {skill.repos} repositories
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-lg">
                            {skill.confidence}%
                          </Badge>
                        </div>
                        <Progress value={skill.confidence} className="h-2" />
                      </Card>
                    ))}
                  </div>
                </Card>

                {/* CTA */}
                <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-center">
                  <h3 className="text-2xl font-bold mb-3">Add These Skills to Your Profile</h3>
                  <p className="text-muted-foreground mb-6">
                    These AI-discovered skills will be added to your skill profile and included in your CV exports.
                  </p>
                  <Button size="lg" className="gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Add All Skills to Profile
                  </Button>
                </Card>
              </div>
            )}

            {/* Benefits Section */}
            {!analysis && (
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Automatic Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    AI analyzes your code to find skills you use but haven't listed
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Confidence Scores</h3>
                  <p className="text-sm text-muted-foreground">
                    Each skill comes with evidence-based confidence ratings
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Discovered skills automatically added to your profile
                  </p>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default GitHubAnalysis;
