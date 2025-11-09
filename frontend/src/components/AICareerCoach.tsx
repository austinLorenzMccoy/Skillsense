import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Brain, TrendingUp, BookOpen, DollarSign, Briefcase, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

interface AICareerCoachProps {
  skills: Array<{ name: string; confidence: number }>;
}

export const AICareerCoach: React.FC<AICareerCoachProps> = ({ skills }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [adviceType, setAdviceType] = useState<string>('');
  const { toast } = useToast();
  const { token } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const getAdvice = async (type: string, extraParams: any = {}) => {
    setLoading(true);
    setAdviceType(type);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/coach/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          skills: skills.map(s => ({ name: s.name, confidence: s.confidence })),
          advice_type: type,
          ...extraParams
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get advice');
      }

      const data = await response.json();
      setAdvice(data);
      
      toast({
        title: 'AI Coach Ready!',
        description: 'Your personalized advice is ready',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to get career advice',
        variant: 'destructive',
      });
      setAdvice(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Career Coach
          </CardTitle>
          <CardDescription>
            Get personalized career advice powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => getAdvice('gap_analysis', { target_role: 'Senior Developer' })}
              disabled={loading}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs">Skill Gaps</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => getAdvice('learning_path', { skill_name: skills[0]?.name || 'Python' })}
              disabled={loading}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Learning Path</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => getAdvice('salary', { location: 'United States' })}
              disabled={loading}
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-xs">Salary Insights</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => getAdvice('interview', { job_title: 'Software Engineer' })}
              disabled={loading}
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-xs">Interview Prep</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => getAdvice('daily')}
              disabled={loading}
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-xs">Daily Tip</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advice Display */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">AI Coach is thinking...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {advice && !loading && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {adviceType === 'gap_analysis' && 'Skill Gap Analysis'}
              {adviceType === 'learning_path' && 'Learning Path'}
              {adviceType === 'salary' && 'Salary Insights'}
              {adviceType === 'interview' && 'Interview Preparation'}
              {adviceType === 'daily' && 'Daily Career Tip'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {adviceType === 'daily' && advice.insight && (
                <p className="text-sm">{advice.insight}</p>
              )}
              {adviceType !== 'daily' && (
                <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                  {JSON.stringify(advice, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Upsell */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Unlock Premium AI Coach</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get unlimited AI advice, personalized learning paths, and priority support
              </p>
              <Button size="sm" variant="default">
                Upgrade to Premium - $9.99/month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
