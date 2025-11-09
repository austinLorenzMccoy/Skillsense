import { SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { SidebarTrigger } from "../components/ui/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { Search, Users, TrendingUp, Briefcase } from "lucide-react";

export default function EmployerDashboard() {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Welcome back!</h2>
              <p className="text-muted-foreground">
                Find and hire the best talent for your organization
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Candidates
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    No candidates yet
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Jobs
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Post your first job
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Matches This Week
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Start searching
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Team Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">
                    Just you for now
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with finding the right talent
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Button className="h-24 flex flex-col gap-2">
                  <Search className="h-6 w-6" />
                  <span>Search Talent</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Briefcase className="h-6 w-6" />
                  <span>Post a Job</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Build Team</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Complete these steps to make the most of SkillSense
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Complete your company profile</h4>
                    <p className="text-sm text-muted-foreground">
                      Add company details, logo, and description
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Post your first job</h4>
                    <p className="text-sm text-muted-foreground">
                      Define the role and required skills
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Search for candidates</h4>
                    <p className="text-sm text-muted-foreground">
                      Use AI-powered matching to find the best fit
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
