import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, UserCheck, Target } from "lucide-react";

const Team = () => {
  // Mock team data for demonstration
  const teamMembers = [
    {
      name: "Alice Johnson",
      role: "Frontend Developer",
      skills: ["React", "TypeScript", "UI/UX"],
      status: "confirmed"
    },
    {
      name: "Bob Smith",
      role: "Backend Developer",
      skills: ["Node.js", "Python", "Database"],
      status: "pending"
    },
    {
      name: "Carol Davis",
      role: "Product Manager",
      skills: ["Strategy", "Agile", "Analytics"],
      status: "confirmed"
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
              <h1 className="text-lg font-semibold">Team Composer</h1>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Team Composer</h1>
              <p className="text-muted-foreground">Build the perfect team based on complementary skills and project requirements</p>
            </div>

            {/* Project Requirements */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Project Requirements</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>Node.js</Badge>
                    <Badge>UI/UX Design</Badge>
                    <Badge>Project Management</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Team Size</h3>
                  <p className="text-sm text-muted-foreground">4-6 members</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Timeline</h3>
                  <p className="text-sm text-muted-foreground">3 months</p>
                </div>
              </div>
            </Card>

            {/* Current Team */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Current Team
                </h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge variant={member.status === 'confirmed' ? 'default' : 'secondary'}>
                        {member.status === 'confirmed' ? <UserCheck className="w-3 h-3 mr-1" /> : null}
                        {member.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team Analysis */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Team Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Skill Coverage</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Frontend Development</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Backend Development</span>
                      <span>70%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Team Dynamics</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Strong collaboration potential</li>
                    <li>• Good skill diversity</li>
                    <li>• Consider adding QA expertise</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Team;
