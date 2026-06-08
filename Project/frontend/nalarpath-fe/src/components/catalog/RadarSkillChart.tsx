import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarSkillChartProps {
  skills: Record<string, number>;
  userSkills?: Record<string, number>;
}

export default function RadarSkillChart({ skills, userSkills }: RadarSkillChartProps) {
  const data = Object.entries(skills).map(([key, value]) => ({
    skill: key.replace(/_/g, ' '),
    required: value,
    current: userSkills?.[key] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#c3c6d5" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fontSize: 11, fill: '#434653' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #c3c6d5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Radar
          name="Required"
          dataKey="required"
          stroke="#003c90"
          fill="#003c90"
          fillOpacity={0.2}
        />
        {userSkills && (
          <Radar
            name="Your Level"
            dataKey="current"
            stroke="#006c49"
            fill="#006c49"
            fillOpacity={0.3}
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
}