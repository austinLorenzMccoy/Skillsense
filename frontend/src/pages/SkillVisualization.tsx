import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Radar, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { SkillRadarChart } from "@/components/SkillRadarChart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SkillVisualization = () => {
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
      evidenceSnippet: "Developed REST APIs and microservices",
      source: "GitHub",
      sourceUrl: "https://github.com"
    },
    {
      skillName: "Leadership & Mentoring",
      category: "soft" as const,
      confidence: 85,
      evidenceSnippet: "Led team of 5 developers, conducted code reviews",
      source: "CV"
    },
    {
      skillName: "Problem Solving",
      category: "soft" as const,
      confidence: 90,
      evidenceSnippet: "Resolved complex technical challenges",
      source: "CV"
    },
    {
      skillName: "PostgreSQL & Databases",
      category: "hard" as const,
      confidence: 82,
      evidenceSnippet: "Designed and optimized database schemas",
      source: "GitHub",
      sourceUrl: "https://github.com"
    },
    {
      skillName: "Communication",
      category: "soft" as const,
      confidence: 88,
      evidenceSnippet: "Presented technical concepts to stakeholders",
      source: "CV"
    },
    {
      skillName: "Web3 & Blockchain",
      category: "emerging" as const,
      confidence: 65,
      evidenceSnippet: "Explored smart contract development",
      source: "Blog",
      sourceUrl: "https://medium.com"
    },
    {
      skillName: "AI & Machine Learning",
      category: "emerging" as const,
      confidence: 70,
      evidenceSnippet: "Implemented ML models for skill extraction",
      source: "GitHub",
      sourceUrl: "https://github.com"
    }
  ]);

  const skillsByCategory = {
    hard: skills.filter(s => s.category === 'hard'),
    soft: skills.filter(s => s.category === 'soft'),
    emerging: skills.filter(s => s.category === 'emerging')
  };

  const averageConfidence = Math.round(
    skills.reduce((acc, skill) => acc + skill.confidence, 0) / skills.length
  );

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
                <Radar className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-semibold">Skill Visualization</h1>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Hero Section */}
            <div className="mb-12 text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Visualize Your
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Skill Portfolio
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Interactive charts and graphs to understand your strengths, identify gaps, and track your growth over time.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Skills</span>
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <div className="text-3xl font-bold">{skills.length}</div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Avg Confidence</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold">{averageConfidence}%</div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Technical</span>
                  <PieChart className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">{skillsByCategory.hard.length}</div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Soft Skills</span>
                  <PieChart className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-3xl font-bold">{skillsByCategory.soft.length}</div>
              </Card>
            </div>

            {/* Visualization Tabs */}
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="radar" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="radar">
                    <Radar className="w-4 h-4 mr-2" />
                    Radar Chart
                  </TabsTrigger>
                  <TabsTrigger value="bars">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Bar Chart
                  </TabsTrigger>
                  <TabsTrigger value="breakdown">
                    <PieChart className="w-4 h-4 mr-2" />
                    Breakdown
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="radar" className="mt-6">
                  <Card className="p-8">
                    <div className="mb-6 text-center">
                      <h3 className="text-2xl font-bold mb-2">Skill Radar Chart</h3>
                      <p className="text-muted-foreground">
                        Interactive visualization of your top 8 skills and their confidence levels
                      </p>
                    </div>
                    <SkillRadarChart skills={skills.slice(0, 8)} />
                  </Card>
                </TabsContent>

                <TabsContent value="bars" className="mt-6">
                  <Card className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">Skills by Confidence</h3>
                      <p className="text-muted-foreground">All skills ranked by confidence level</p>
                    </div>
                    <div className="space-y-4">
                      {skills
                        .sort((a, b) => b.confidence - a.confidence)
                        .map((skill, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{skill.skillName}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {skill.category}
                                </Badge>
                              </div>
                              <span className="text-sm font-semibold text-primary">
                                {skill.confidence}%
                              </span>
                            </div>
                            <Progress value={skill.confidence} className="h-2" />
                          </div>
                        ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="breakdown" className="mt-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Technical Skills
                      </h3>
                      <div className="space-y-3">
                        {skillsByCategory.hard.map((skill, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{skill.skillName}</span>
                            <Badge variant="secondary">{skill.confidence}%</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        Soft Skills
                      </h3>
                      <div className="space-y-3">
                        {skillsByCategory.soft.map((skill, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{skill.skillName}</span>
                            <Badge variant="secondary">{skill.confidence}%</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Emerging Skills
                      </h3>
                      <div className="space-y-3">
                        {skillsByCategory.emerging.map((skill, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{skill.skillName}</span>
                            <Badge variant="secondary">{skill.confidence}%</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
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

export default SkillVisualization;
