import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

export const DemoLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    try {
      // Try demo employee account
      await login('demo@skillsense.ai', 'demo123456');
      toast({
        title: 'Demo Mode',
        description: 'Logged in as demo employee. Explore all features!',
      });
      navigate('/dashboard');
    } catch (error) {
      // If demo account doesn't exist, show message
      toast({
        title: 'Demo Account',
        description: 'Demo credentials: demo@skillsense.ai / demo123456',
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDemoLogin}
      className="gap-2 border-primary/50 hover:bg-primary/10"
    >
      <Sparkles className="h-4 w-4" />
      Try Demo Account
    </Button>
  );
};
