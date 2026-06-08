import { useProfileStore } from '../../../store/useProfileStore';
import { getSkillsByCategory } from '../../../utils/skillDictionary';
import { useState } from 'react';

const categories = getSkillsByCategory();
const categoryList = Object.keys(categories);

export default function StepSkills() {
  const { profile, setSkill } = useProfileStore();
  const [activeCategory, setActiveCategory] = useState(categoryList[0]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-xl text-on-surface mb-1">
          Level Keahlian
        </h2>
        <p className="text-sm text-on-surface-variant">
          Geser slider sesuai kemampuanmu saat ini. Nilai 0 = belum pernah, 100 = sangat mahir.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categoryList.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill sliders */}
      <div className="space-y-4">
        {categories[activeCategory].map((skill) => {
          const value = profile.skills[skill.key] ?? 0;
          return (
            <div key={skill.key}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-on-surface">
                  {skill.label}
                </label>
                <span className="text-sm font-semibold text-primary w-8 text-right">
                  {value}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={value}
                onChange={(e) => setSkill(skill.key, Number(e.target.value))}
                className="w-full h-2 accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-on-surface-variant mt-0.5">
                <span>Belum bisa</span>
                <span>Sangat mahir</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}