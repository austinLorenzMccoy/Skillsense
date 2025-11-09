import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SkillCard } from "@/components/SkillCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Share2, Brain, Sparkles, Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { apiClient, JobStatus, ProfileResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration when no real data
const mockSkills = [
  {
    skillName: "React & TypeScript",
    category: "hard" as const,
    confidence: 92,
    evidenceSnippet: "Built multiple production applications using React 18 with TypeScript, implementing advanced patterns like custom hooks and context API.",
    source: "GitHub",
    sourceUrl: "https://github.com"
  },
  {
    skillName: "Leadership & Mentoring",
    category: "soft" as const,
    confidence: 85,
    evidenceSnippet: "Led team of 5 developers, conducted regular 1-on-1s, and improved team velocity by 40%.",
    source: "CV",
  },
  {
    skillName: "AI Integration",
    category: "emerging" as const,
    confidence: 78,
    evidenceSnippet: "Experimented with OpenAI API integration, built several AI-powered prototypes, and researched LLM fine-tuning.",
    source: "LinkedIn",
    sourceUrl: "https://linkedin.com"
  },
  {
    skillName: "System Architecture",
    category: "hard" as const,
    confidence: 88,
    evidenceSnippet: "Designed scalable microservices architecture handling 10M+ requests daily, with focus on resilience and observability.",
    source: "GitHub",
    sourceUrl: "https://github.com"
  },
  {
    skillName: "Strategic Thinking",
    category: "soft" as const,
    confidence: 82,
    evidenceSnippet: "Developed product roadmap aligning technical capabilities with business objectives, resulting in 3x revenue growth.",
    source: "CV"
  },
  {
    skillName: "Web3 & Blockchain",
    category: "emerging" as const,
    confidence: 65,
    evidenceSnippet: "Explored smart contract development with Solidity, participated in Web3 hackathons, and studied DeFi protocols.",
    source: "Blog",
    sourceUrl: "https://medium.com"
  }
];

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [skills, setSkills] = useState(mockSkills);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [dataSource, setDataSource] = useState<'mock' | 'api'>('mock');
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    const loadData = async () => {
      // If no jobId, use mock data
      if (!jobId) {
        setDataSource('mock');
        return;
      }

      setIsLoading(true);
      setIsPolling(true);

      try {
        // Try to fetch from backend
        const status = await apiClient.getJobStatus(jobId);
        
        if (status.status === 'done') {
          const profileData = await apiClient.getProfile(jobId);
          setProfile(profileData);
          
          // Convert API skills to component format
          const apiSkills = profileData.skills.map(skill => ({
            skillName: skill.name,
            category: skill.type,
            confidence: Math.round(skill.confidence * 100),
            evidenceSnippet: skill.evidence[0]?.snippet || '',
            source: skill.evidence[0]?.sourceType || 'Unknown',
            sourceUrl: skill.evidence[0]?.sourceUrl
          }));
          
          setSkills(apiSkills);
          setDataSource('api');
          setIsPolling(false);
          
          toast({
            title: "Profile loaded!",
            description: `Found ${apiSkills.length} skills from your data.`,
          });
        } else if (status.status === 'error') {
          throw new Error(status.message || 'Processing failed');
        } else {
          // Still processing, poll again
          setTimeout(loadData, 3000);
        }
      } catch (error) {
        console.warn('Backend unavailable, using mock data:', error);
        setDataSource('mock');
        setIsPolling(false);
        
        toast({
          title: "Demo Mode",
          description: "Showing sample data. Upload a CV to see real analysis.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [jobId, toast]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1">
          {/* Header with Sidebar Toggle */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-4 h-16 px-6">
              <SidebarTrigger className="text-muted-foreground" />
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>

          <div className="p-6">
          {/* Header Section */}
          <div className="mb-12 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">Your Skill Profile</h1>
                <p className="text-muted-foreground">
                  {dataSource === 'mock' ? '🎨 Demo Mode - Sample Data' : '✨ AI-discovered talents and evidence-based insights'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isPolling && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Processing...
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/upload'}>
                  <Upload className="w-4 h-4" />
                  Upload New CV
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

            {/* Profile Summary */}
            {profile && (
              <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                    <p className="text-muted-foreground mb-4">{profile.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.topSkills?.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill.name} ({Math.round(skill.confidence * 100)}%)
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </Card>
            )}

            {/* Skills Analysis */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Skills Analysis</h2>
                <div className="text-sm text-muted-foreground">
                  {skills.length} skills identified
                </div>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Skills</TabsTrigger>
                  <TabsTrigger value="hard">Technical</TabsTrigger>
                  <TabsTrigger value="soft">Soft Skills</TabsTrigger>
                  <TabsTrigger value="emerging">Emerging</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {skills.map((skill, index) => (
                      <SkillCard key={index} {...skill} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="hard" className="mt-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {skills
                      .filter(skill => skill.category === "hard")
                      .map((skill, index) => (
                        <SkillCard key={index} {...skill} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="soft" className="mt-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {skills
                      .filter(skill => skill.category === "soft")
                      .map((skill, index) => (
                        <SkillCard key={index} {...skill} />
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="emerging" className="mt-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {skills
                      .filter(skill => skill.category === "emerging")
                      .map((skill, index) => (
                        <SkillCard key={index} {...skill} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
