import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, CheckCircle2 } from "lucide-react";

interface SkillCardProps {
  skillName: string;
  category: "hard" | "soft" | "emerging";
  confidence: number;
  evidenceSnippet: string;
  source: string;
  sourceUrl?: string;
}

export const SkillCard = ({ 
  skillName, 
  category, 
  confidence, 
  evidenceSnippet, 
  source,
  sourceUrl 
}: SkillCardProps) => {
  const getCategoryColor = () => {
    switch(category) {
      case "hard": return "bg-accent text-accent-foreground";
      case "soft": return "bg-success text-success-foreground";
      case "emerging": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getConfidenceColor = () => {
    if (confidence >= 80) return "bg-success";
    if (confidence >= 60) return "bg-accent";
    return "bg-warning";
  };

  return (
    <Card className="p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1 group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                {skillName}
              </h3>
              <CheckCircle2 className="w-5 h-5 text-success opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <Badge className={getCategoryColor()}>
              {category.charAt(0).toUpperCase() + category.slice(1)} Skill
            </Badge>
          </div>
        </div>

        {/* Confidence Ribbon */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Confidence Score</span>
            <span className="text-foreground font-bold">{confidence}%</span>
          </div>
          <Progress 
            value={confidence} 
            className={`h-2 ${getConfidenceColor()}`}
          />
        </div>

        {/* Evidence Snippet */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Evidence</div>
          <p className="text-sm text-foreground/80 italic line-clamp-2 bg-muted/50 p-3 rounded-md">
            "{evidenceSnippet}"
          </p>
        </div>

        {/* Source Link */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">Source: {source}</span>
          {sourceUrl && (
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};
