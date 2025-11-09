import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Link, Github, Linkedin, Globe, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const addUrl = () => {
    if (currentUrl.trim() && !urls.includes(currentUrl.trim())) {
      setUrls([...urls, currentUrl.trim()]);
      setCurrentUrl("");
    }
  };

  const removeUrl = (urlToRemove: string) => {
    setUrls(urls.filter(url => url !== urlToRemove));
  };

  const handleSubmit = async () => {
    if (!file && urls.length === 0) {
      toast({
        title: "Missing Input",
        description: "Please upload a CV file or add at least one URL.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await apiClient.ingestCV(file || undefined, urls.length > 0 ? urls : undefined);
      setJobId(result.jobId);

      toast({
        title: "Upload Successful",
        description: `Analysis started. Job ID: ${result.jobId}`,
      });

      // Redirect to dashboard with job ID
      navigate(`/dashboard?jobId=${result.jobId}`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
              <h1 className="text-lg font-semibold">Upload CV</h1>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your CV</h1>
              <p className="text-muted-foreground">Upload your CV and connect additional data sources to unlock your hidden talents</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* CV Upload */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <h2 className="text-xl font-semibold">CV Document</h2>
                  </div>

                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    {file ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">Drag and drop your CV here, or click to browse</p>
                        <Button variant="outline" asChild>
                          <label htmlFor="cv-upload">
                            Choose File
                            <input
                              id="cv-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={handleFileChange}
                            />
                          </label>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">Supported formats: PDF, DOC, DOCX, TXT</p>
                      </>
                    )}
                  </div>
                </div>
              </Card>

              {/* URL Inputs */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Link className="w-5 h-5" />
                    <h2 className="text-xl font-semibold">Additional Data Sources</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="url-input">Add GitHub, LinkedIn, or portfolio URLs</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="url-input"
                            placeholder="https://github.com/yourusername"
                            value={currentUrl}
                            onChange={(e) => setCurrentUrl(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addUrl()}
                          />
                          <Button onClick={addUrl} disabled={!currentUrl.trim()}>
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    {urls.length > 0 && (
                      <div className="space-y-2">
                        <Label>Added URLs:</Label>
                        {urls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            {url.includes('github.com') && <Github className="w-4 h-4" />}
                            {url.includes('linkedin.com') && <Linkedin className="w-4 h-4" />}
                            {!url.includes('github.com') && !url.includes('linkedin.com') && <Globe className="w-4 h-4" />}
                            <span className="flex-1 text-sm">{url}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeUrl(url)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={isUploading || (!file && urls.length === 0)}
                  size="lg"
                  className="px-8"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </div>

              {jobId && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Analysis Started!</p>
                      <p className="text-sm">Job ID: {jobId}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UploadPage;
