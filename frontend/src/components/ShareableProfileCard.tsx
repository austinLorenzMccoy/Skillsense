import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Share2, Download, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';

interface Skill {
  skillName: string;
  category: 'hard' | 'soft' | 'emerging';
  confidence: number;
}

interface ShareableProfileCardProps {
  name: string;
  email: string;
  skills: Skill[];
  profileUrl?: string;
}

export const ShareableProfileCard: React.FC<ShareableProfileCardProps> = ({
  name,
  email,
  skills,
  profileUrl
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const topSkills = skills
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  const shareUrl = profileUrl || window.location.href;
  const shareText = `Check out my skill profile on SkillSense! 🚀\n\nTop Skills:\n${topSkills.map(s => `• ${s.skillName} (${s.confidence}%)`).join('\n')}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Profile link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleShareLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  const handleDownloadCard = () => {
    // TODO: Implement PDF download
    toast({
      title: 'Coming soon!',
      description: 'PDF download will be available soon',
    });
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{name || 'Your Profile'}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
          </div>

          {/* Top Skills */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Top Skills</h4>
            <div className="space-y-2">
              {topSkills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.skillName}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${skill.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {skill.confidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Actions */}
          <div className="pt-4 border-t space-y-2">
            <p className="text-xs text-muted-foreground mb-2">Share your profile:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareTwitter}
                className="gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareLinkedIn}
                className="gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCard}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Branding */}
          <div className="pt-2 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by <span className="font-semibold text-primary">SkillSense</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
