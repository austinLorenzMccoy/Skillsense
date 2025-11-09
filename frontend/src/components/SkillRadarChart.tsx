import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Skill {
  skillName: string;
  confidence: number;
}

interface SkillRadarChartProps {
  skills: Skill[];
  title?: string;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills, title = "Skill Overview" }) => {
  // Take top 6 skills for radar chart
  const topSkills = skills.slice(0, 6);
  
  // SVG dimensions
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 40;
  const levels = 5;

  // Calculate points for each skill
  const angleStep = (Math.PI * 2) / topSkills.length;
  
  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const distance = radius + 30;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance
    };
  };

  // Create path for skill polygon
  const skillPath = topSkills.map((skill, index) => {
    const point = getPoint(index, skill.confidence);
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ') + ' Z';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background circles */}
          {[...Array(levels)].map((_, i) => {
            const r = (radius / levels) * (i + 1);
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted opacity-20"
              />
            );
          })}

          {/* Axis lines */}
          {topSkills.map((_, index) => {
            const point = getPoint(index, 100);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={point.x}
                y2={point.y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted opacity-20"
              />
            );
          })}

          {/* Skill polygon */}
          <path
            d={skillPath}
            fill="url(#skillGradient)"
            fillOpacity="0.3"
            stroke="url(#skillGradient)"
            strokeWidth="2"
          />

          {/* Skill points */}
          {topSkills.map((skill, index) => {
            const point = getPoint(index, skill.confidence);
            return (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="url(#skillGradient)"
                  className="drop-shadow-lg"
                />
              </g>
            );
          })}

          {/* Labels */}
          {topSkills.map((skill, index) => {
            const labelPoint = getLabelPoint(index);
            return (
              <text
                key={index}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                className="text-xs font-medium fill-current"
                dominantBaseline="middle"
              >
                {skill.skillName}
              </text>
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </CardContent>
    </Card>
  );
};
