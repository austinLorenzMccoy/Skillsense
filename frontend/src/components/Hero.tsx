import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoLoginButton } from "./DemoLoginButton";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-background/95" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Talent Intelligence</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Unlock Your
            <span className="block bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              Hidden Talents
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            AI that discovers what humans don't know about themselves. 
            Transform your CV into a dynamic skill intelligence profile.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button variant="hero" size="lg" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="w-full sm:w-auto">
              <DemoLoginButton />
            </div>
          </div>
          
          {/* Demo Hint */}
          <p className="text-sm text-white/60 pt-2">
            ✨ Try our demo to explore AI career coaching, GitHub skill extraction, and viral sharing features
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-accent">50-70%</div>
              <div className="text-sm text-white/70">Undocumented Skills</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-accent">AI-Powered</div>
              <div className="text-sm text-white/70">Skill Extraction</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-bold text-accent">100%</div>
              <div className="text-sm text-white/70">Evidence-Based</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
