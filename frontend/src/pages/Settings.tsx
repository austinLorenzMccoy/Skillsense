import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Moon, Sun, Trash2, Download, Shield, Bell } from "lucide-react";

const SettingsPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-4 h-16 px-6">
              <SidebarTrigger className="text-muted-foreground" />
              <h1 className="text-lg font-semibold">Settings</h1>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and data</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Appearance */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Appearance</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      <Label htmlFor="theme">Theme</Label>
                    </div>
                    <Select defaultValue="system">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <Label htmlFor="notifications">Email Notifications</Label>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </div>
              </Card>

              {/* Data & Privacy */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Data & Privacy</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Retention</Label>
                    <p className="text-sm text-muted-foreground">
                      Your skill profile and analysis data is stored securely and used only for providing insights.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Analytics Tracking</Label>
                        <p className="text-sm text-muted-foreground">Help improve our service with anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Skill Sharing</Label>
                        <p className="text-sm text-muted-foreground">Allow sharing anonymized skill insights for research</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Export & Backup */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Download className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Export & Backup</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export Skill Profile</Label>
                      <p className="text-sm text-muted-foreground">Download your complete skill analysis as PDF</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export Raw Data</Label>
                      <p className="text-sm text-muted-foreground">Download your data in JSON format</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border-red-200">
                <div className="flex items-center gap-2 mb-6">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <h2 className="text-xl font-semibold text-red-700">Danger Zone</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-red-700">Delete All Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your skill profile and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Data
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Save Changes */}
              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;
