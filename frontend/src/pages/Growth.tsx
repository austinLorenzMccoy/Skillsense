import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BookOpen, Target, Award, Calendar } from "lucide-react";

const Growth = () => {
  // Mock growth path data
  const skillGaps = [
    { skill: "Cloud Architecture (AWS/Azure)", current: 65, target: 85, priority: "high" },
    { skill: "DevOps & CI/CD", current: 45, target: 80, priority: "high" },
    { skill: "Machine Learning Basics", current: 30, target: 70, priority: "medium" },
    { skill: "Leadership & Management", current: 60, target: 75, priority: "medium" }
  ];

  const learningPath = [
    {
      phase: "Foundation",
      duration: "2-3 months",
      courses: [
        "AWS Certified Cloud Practitioner",
        "Docker & Kubernetes Fundamentals",
        "Python for Data Science"
      ]
    },
    {
      phase: "Intermediate",
      duration: "3-4 months",
      courses: [
        "AWS Solutions Architect",
        "CI/CD with Jenkins/GitLab",
        "Machine Learning with scikit-learn"
      ]
    },
    {
      phase: "Advanced",
      duration: "4-6 months",
      courses: [
        "AWS DevOps Professional",
        "MLOps Best Practices",
        "Technical Leadership Program"
      ]
    }
  ];

  const milestones = [
    { title: "Complete Cloud Certification", date: "Q2 2024", status: "in_progress" },
    { title: "Lead First DevOps Project", date: "Q3 2024", status: "planned" },
    { title: "Mentor Junior Developer", date: "Q4 2024", status: "planned" },
    { title: "Achieve Tech Lead Position", date: "Q1 2025", status: "planned" }
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
              <h1 className="text-lg font-semibold">Growth Path</h1>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Growth Path</h1>
              <p className="text-muted-foreground">Personalized learning journey to bridge skill gaps and achieve your career goals</p>
            </div>

            {/* Skill Gaps */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Skill Gaps to Address</h2>
              </div>

              <div className="space-y-4">
                {skillGaps.map((gap, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{gap.skill}</span>
                        <Badge variant={gap.priority === 'high' ? 'destructive' : 'secondary'}>
                          {gap.priority}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {gap.current}% → {gap.target}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress value={gap.current} className="h-2" />
                      <div
                        className="absolute top-0 h-2 bg-green-500 rounded-full opacity-50"
                        style={{ width: `${gap.target}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Learning Path */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Recommended Learning Path</h2>
              </div>

              <div className="space-y-6">
                {learningPath.map((phase, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{phase.phase}</h3>
                      <Badge variant="outline">{phase.duration}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {phase.courses.map((course, courseIndex) => (
                        <div key={courseIndex} className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium">{course}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Learning Journey
                </Button>
              </div>
            </Card>

            {/* Career Milestones */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Career Milestones</h2>
              </div>

              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <p className="font-medium">{milestone.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {milestone.date}
                        </div>
                      </div>
                    </div>
                    <Badge variant={
                      milestone.status === 'completed' ? 'default' :
                      milestone.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {milestone.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Progress Overview */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-3">Overall Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Growth Path Completion</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-3" />
                  <p className="text-xs text-muted-foreground">1 of 4 milestones completed</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Growth;
