import type { CareerSummary } from '../../types';
import CareerCard from './CareerCard';

interface CareerGridProps {
  careers: CareerSummary[];
}

export default function CareerGrid({ careers }: CareerGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {careers.map((career, index) => (
        <div
          key={career.name}
          className={index === 0 ? 'lg:col-span-2' : ''}
        >
          <CareerCard career={career} featured={index === 0} />
        </div>
      ))}
    </div>
  );
}