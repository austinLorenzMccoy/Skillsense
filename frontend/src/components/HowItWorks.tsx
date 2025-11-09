import { Upload, Brain, Sparkles, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Your Data",
    description: "Submit your CV and add LinkedIn, GitHub, or other professional URLs. Our secure system respects your privacy."
  },
  {
    icon: Brain,
    number: "02",
    title: "AI Analysis",
    description: "Advanced algorithms analyze your content, extracting explicit and implicit skills from multiple sources."
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Evidence Mapping",
    description: "Each discovered skill is validated with confidence scores and linked to specific evidence from your sources."
  },
  {
    icon: Download,
    number: "04",
    title: "Export & Share",
    description: "Generate AI-enhanced CVs, explore growth paths, or share your dynamic skill profile with recruiters."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How SkillSense
            <span className="block bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to unlock your hidden talents and transform your professional profile
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary -translate-y-1/2 opacity-20" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="bg-card p-6 rounded-xl border border-border hover:border-accent transition-all duration-300 hover:shadow-card group">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold shadow-glow">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                    <step.icon className="w-8 h-8 text-accent" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
