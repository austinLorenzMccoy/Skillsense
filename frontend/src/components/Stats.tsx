import { Card } from "@/components/ui/card";

const stats = [
  {
    value: "50-70%",
    label: "Skills Undocumented",
    description: "of workforce capabilities remain invisible in traditional systems"
  },
  {
    value: "10x",
    label: "Faster Matching",
    description: "than manual CV screening with AI-powered skill intelligence"
  },
  {
    value: "100%",
    label: "Evidence-Based",
    description: "every skill claim backed by verifiable source attribution"
  },
  {
    value: "24/7",
    label: "Always Learning",
    description: "continuous skill discovery as you grow professionally"
  }
];

export const Stats = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            The Future of
            <span className="block text-accent">
              Talent Intelligence
            </span>
          </h2>
          <p className="text-lg text-white/80">
            Powered by advanced AI, trusted by forward-thinking professionals and organizations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-3 text-center">
                <div className="text-5xl font-bold text-accent">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-white">
                  {stat.label}
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
