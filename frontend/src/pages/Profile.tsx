import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { User, Briefcase, Save } from 'lucide-react';

export default function Profile() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState<'private' | 'employers' | 'public'>('private');
  const [resumeUrl, setResumeUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    if (user?.role === 'employee') {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVisibility(data.visibility || 'private');
        setResumeUrl(data.resume_url || '');
        setGithubUrl(data.github_url || '');
        setLinkedinUrl(data.linkedin_url || '');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/profile/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visibility,
          resume_url: resumeUrl,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Profile Settings</h1>
          </header>

          <main className="flex-1 p-6 space-y-6 max-w-4xl">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {user?.role === 'employer' ? (
                    <Briefcase className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your account details and role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input value={user?.role || ''} disabled className="capitalize" />
                </div>
                <div>
                  <Label>Account Status</Label>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${user?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm">
                      {user?.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee Profile Settings */}
            {user?.role === 'employee' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Visibility</CardTitle>
                    <CardDescription>
                      Control who can see your skill profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="font-normal cursor-pointer">
                          <div>
                            <div className="font-semibold">🔒 Private</div>
                            <div className="text-sm text-muted-foreground">Only you can see your profile</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="employers" id="employers" />
                        <Label htmlFor="employers" className="font-normal cursor-pointer">
                          <div>
                            <div className="font-semibold">👔 Employers Only</div>
                            <div className="text-sm text-muted-foreground">Visible to verified employers</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="font-normal cursor-pointer">
                          <div>
                            <div className="font-semibold">🌐 Public</div>
                            <div className="text-sm text-muted-foreground">Anyone can view your profile</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Links</CardTitle>
                    <CardDescription>
                      Add links to your online profiles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="resumeUrl">Resume URL</Label>
                      <Input
                        id="resumeUrl"
                        type="url"
                        placeholder="https://example.com/resume.pdf"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="githubUrl">GitHub Profile</Label>
                      <Input
                        id="githubUrl"
                        type="url"
                        placeholder="https://github.com/username"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                      <Input
                        id="linkedinUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
