import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

const completedFeatures = [
  "Authentication & Authorization",
  "GitHub Skill Extraction",
  "AI Career Coach (Groq)",
  "Shareable Profile Cards",
  "Skill Radar Charts",
  "Profile Management",
  "Role-Based Dashboards",
  "Password Reset",
  "All Tests Passing"
];

const pendingFeatures = [
  "Email Verification (SMTP)",
  "Payment Integration (Stripe)"
];

export const ProductionStatus = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>98% Production Ready</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Built in 24 Hours.
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready for Production.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A fully functional AI-powered platform with authentication, real-time analysis, and viral features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Completed Features */}
          <Card className="p-8 border-green-500/20 bg-green-500/5">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Completed Features</h3>
                  <p className="text-sm text-muted-foreground">9 out of 11 features live</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {completedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground group-hover:text-accent transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Pending Features */}
          <Card className="p-8 border-amber-500/20 bg-amber-500/5">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">2 features in pipeline</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {pendingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <Clock className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Note:</span> All core features are functional. 
                  Pending features are nice-to-haves for enterprise deployment.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Built with modern tech stack</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["React", "TypeScript", "FastAPI", "PostgreSQL", "Groq AI", "Netlify", "Render"].map((tech) => (
              <span 
                key={tech}
                className="px-4 py-2 bg-muted/50 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
