import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { CareerSummary } from '../../types';
import SkillChip from '../common/SkillChip';

interface CareerCardProps {
  career: CareerSummary;
  featured?: boolean;
}

const careerIcons: Record<string, string> = {
  'Data Scientist': '📊',
  'Software Developer': '💻',
  'UX Designer': '🎨',
  'Product Manager': '📋',
  'Data Analyst': '📈',
  'Business Analyst': '🏢',
  'Cybersecurity Analyst': '🔒',
  'Project Manager': '📌',
  'Marketing Specialist': '📣',
  'HR Manager': '👥',
};

export default function CareerCard({ career, featured = false }: CareerCardProps) {
  const navigate = useNavigate();
  const icon = careerIcons[career.name] ?? '💼';
  const topSkills = Object.keys(career.hard_skills).slice(0, 3);

  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex flex-col gap-4 hover:shadow-elevation-2 hover:border-primary transition-all duration-200 ${
        featured ? 'col-span-2' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-xl">
          {icon}
        </div>
        {featured && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-on-secondary">
            High Demand
          </span>
        )}
      </div>

      {/* Title & desc */}
      <div className="flex-1">
        <h3 className="font-heading font-semibold text-on-surface text-lg mb-1">
          {career.name}
        </h3>
        <p className="text-sm text-on-surface-variant line-clamp-2">
          {getCareerDescription(career.name)}
        </p>
      </div>

      {/* Skill chips */}
      <div className="flex flex-wrap gap-2">
        {topSkills.map((skill) => (
          <SkillChip key={skill} label={skill.replace(/_/g, ' ')} />
        ))}
      </div>

      {/* Button */}
      <button
        onClick={() => navigate(`/catalog/${encodeURIComponent(career.name)}`)}
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border text-sm font-semibold transition-colors ${
          featured
            ? 'bg-primary text-on-primary border-primary hover:bg-primary-container'
            : 'border-primary text-primary hover:bg-primary hover:text-on-primary'
        }`}
      >
        View Details
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function getCareerDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'Data Scientist': 'Extract actionable insights from complex datasets to drive strategic business decisions.',
    'Software Developer': 'Design, develop, and maintain software systems and applications.',
    'UX Designer': 'Create intuitive, meaningful, and aesthetically pleasing user experiences.',
    'Product Manager': 'Lead cross-functional teams to define and deliver successful products.',
    'Data Analyst': 'Analyze data to forecast trends and support data-driven decision making.',
    'Business Analyst': 'Bridge the gap between business needs and technical solutions.',
    'Cybersecurity Analyst': 'Protect IT networks and data from malicious attacks and breaches.',
    'Project Manager': 'Plan, execute, and oversee projects to ensure on-time delivery.',
    'Marketing Specialist': 'Develop and execute campaigns to promote brands and products.',
    'HR Manager': 'Oversee recruiting, employee relations, and organizational development.',
  };
  return descriptions[name] ?? 'Explore this exciting career path and its requirements.';
}