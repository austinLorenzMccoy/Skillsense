import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const DemoLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async (role: 'employee' | 'employer') => {
    setIsLoading(true);
    try {
      const credentials = {
        employee: {
          email: 'demo@skillsense.ai',
          password: 'demo123456',
          label: 'Employee (Job Seeker)',
        },
        employer: {
          email: 'employer@skillsense.ai',
          password: 'demo123456',
          label: 'Employer (Recruiter)',
        },
      };

      const { email, password, label } = credentials[role];
      
      await login(email, password);
      toast({
        title: 'Demo Mode',
        description: `Logged in as ${label}. Explore all features!`,
      });
      navigate('/dashboard');
    } catch (error: any) {
      // Fallback: Create mock offline session
      const mockUser = {
        id: role === 'employee' ? 'demo-employee-offline' : 'demo-employer-offline',
        email: role === 'employee' ? 'demo@skillsense.ai' : 'employer@skillsense.ai',
        role: role,
        is_verified: true,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      
      // Store mock session
      localStorage.setItem('token', 'offline-demo-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: '🎭 Offline Demo Mode',
        description: `Viewing ${role === 'employee' ? 'Employee' : 'Employer'} demo (Backend deploying - limited features)`,
        duration: 5000,
      });
      
      // Reload to trigger auth context update
      window.location.href = '/dashboard';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2 border-primary/50 hover:bg-primary/10"
          disabled={isLoading}
        >
          <Sparkles className="h-4 w-4" />
          {isLoading ? 'Logging in...' : 'Try Demo Account'}
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={() => handleDemoLogin('employee')}
          className="cursor-pointer"
        >
          <div className="flex flex-col gap-1">
            <div className="font-medium">👤 Employee Demo</div>
            <div className="text-xs text-muted-foreground">
              Job seeker experience
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDemoLogin('employer')}
          className="cursor-pointer"
        >
          <div className="flex flex-col gap-1">
            <div className="font-medium">💼 Employer Demo</div>
            <div className="text-xs text-muted-foreground">
              Recruiter experience
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
