import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useProfileStore } from '../../../store/useProfileStore';

export default function StepExperience() {
  const { profile, addExperience, removeExperience } = useProfileStore();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() === '') return;
    addExperience(input.trim());
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-semibold text-xl text-on-surface mb-1">
          Pengalaman
        </h2>
        <p className="text-sm text-on-surface-variant">
          Tambahkan pengalaman organisasi, lomba, magang, atau proyek yang pernah kamu ikuti.
        </p>
      </div>

      {/* Input tambah pengalaman */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="contoh: Juara 2 Hackathon tingkat nasional..."
          className="flex-1 h-12 px-4 border border-outline-variant rounded-lg text-sm text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />
        <button
          onClick={handleAdd}
          className="h-12 px-4 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors flex items-center gap-1"
        >
          <Plus size={16} />
          <span className="text-sm font-semibold">Tambah</span>
        </button>
      </div>

      {/* Daftar pengalaman */}
      {profile.experiences.length === 0 ? (
        <p className="text-sm text-on-surface-variant italic">
          Belum ada pengalaman ditambahkan. Tidak apa-apa, tetap bisa dianalisis.
        </p>
      ) : (
        <ul className="space-y-2">
          {profile.experiences.map((exp, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-container rounded-lg border border-outline-variant"
            >
              <span className="text-sm text-on-surface">{exp}</span>
              <button
                onClick={() => removeExperience(index)}
                className="text-on-surface-variant hover:text-error transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}