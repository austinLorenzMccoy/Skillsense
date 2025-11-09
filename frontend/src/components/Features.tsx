import { Card } from "@/components/ui/card";
import { Brain, Shield, Zap, TrendingUp, Users, FileCheck } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Discovery",
    description: "Advanced machine learning extracts hidden skills from your CV, LinkedIn, GitHub, and other sources that traditional methods miss."
  },
  {
    icon: Shield,
    title: "Evidence-Based Trust",
    description: "Every skill claim is backed by concrete evidence with confidence scores and source attribution for complete transparency."
  },
  {
    icon: Zap,
    title: "Real-Time Analysis",
    description: "Upload your CV and get instant insights. Our AI processes multiple data sources in seconds to build your comprehensive skill profile."
  },
  {
    icon: TrendingUp,
    title: "Growth Pathways",
    description: "Personalized learning recommendations and skill gap analysis to accelerate your professional development journey."
  },
  {
    icon: Users,
    title: "Team Intelligence",
    description: "Compose optimal teams by identifying complementary skills and highlighting coverage gaps with interactive visualizations."
  },
  {
    icon: FileCheck,
    title: "Smart Export",
    description: "Generate AI-enhanced CVs with discovered skills formatted as compelling bullet points, ready for your next opportunity."
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Discover What Makes You
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Exceptional
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            SkillSense uses cutting-edge AI to uncover 50-70% of undocumented skills that traditional hiring systems overlook.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 hover:shadow-card transition-all duration-300 hover:-translate-y-2 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
