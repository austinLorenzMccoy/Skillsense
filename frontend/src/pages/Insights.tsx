import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Award, Target } from "lucide-react";

const Insights = () => {
  // Mock insights data
  const skillInsights = [
    {
      category: "Technical Excellence",
      score: 88,
      insights: [
        "Strong foundation in modern web technologies",
        "Consistent code quality across projects",
        "Good adoption of best practices"
      ]
    },
    {
      category: "Leadership Potential",
      score: 75,
      insights: [
        "Demonstrated mentoring capabilities",
        "Team collaboration skills evident",
        "Project management experience"
      ]
    },
    {
      category: "Innovation Drive",
      score: 82,
      insights: [
        "Active exploration of emerging technologies",
        "Creative problem-solving approach",
        "Continuous learning attitude"
      ]
    }
  ];

  const recommendations = [
    {
      type: "skill_gap",
      title: "Consider developing DevOps skills",
      description: "Your profile shows strong development skills but limited infrastructure experience",
      priority: "medium"
    },
    {
      type: "career",
      title: "Leadership role opportunity",
      description: "Based on your mentoring experience, you may be ready for a tech lead position",
      priority: "high"
    },
    {
      type: "learning",
      title: "AI/ML fundamentals course recommended",
      description: "Your emerging tech exploration suggests interest in AI/ML fundamentals",
      priority: "low"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-4 h-16 px-6">
              <SidebarTrigger className="text-muted-foreground" />
              <h1 className="text-lg font-semibold">Skill Insights</h1>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">AI-Powered Skill Insights</h1>
              <p className="text-muted-foreground">Deep analysis of your talent profile with actionable recommendations</p>
            </div>

            {/* Skill Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {skillInsights.map((insight, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{insight.category}</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className="font-medium">{insight.score}%</span>
                    </div>
                    <Progress value={insight.score} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    {insight.insights.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Personalized Recommendations</h2>
              </div>

              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{rec.title}</h3>
                      <Badge
                        variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Career Trajectory */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Career Trajectory Analysis</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Current Position Fit</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Technical Skills Match</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />

                    <div className="flex justify-between text-sm">
                      <span>Leadership Skills Match</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />

                    <div className="flex justify-between text-sm">
                      <span>Industry Alignment</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Potential Career Paths</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Senior Developer</p>
                        <p className="text-sm text-muted-foreground">85% match</p>
                      </div>
                      <Award className="w-5 h-5 text-yellow-500" />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Tech Lead</p>
                        <p className="text-sm text-muted-foreground">76% match</p>
                      </div>
                      <Award className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium">Engineering Manager</p>
                        <p className="text-sm text-muted-foreground">68% match</p>
                      </div>
                      <Award className="w-5 h-5 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Insights;
