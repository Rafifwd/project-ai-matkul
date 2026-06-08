import { NavLink } from 'react-router-dom';
import { BookOpen, Compass, CheckCircle, Sparkles } from 'lucide-react';

const navItems = [
  { to: '/catalog', icon: BookOpen, label: 'Career Catalog' },
  { to: '/discovery', icon: Compass, label: 'Discovery' },
  { to: '/validation', icon: CheckCircle, label: 'Validation' },
];

export default function Sidebar() {
  return (
    <aside className="w-[200px] flex-shrink-0 bg-surface-container-low flex flex-col border-r border-outline-variant">
      {/* Logo */}
      <div className="p-6 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-primary" />
          <span className="font-heading font-bold text-primary text-lg">NalarPath</span>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">Student Account</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* CTA */}
      <div className="p-4 border-t border-outline-variant">
        <button className="w-full bg-primary text-on-primary text-sm font-semibold py-2 rounded-lg hover:bg-primary-container transition-colors">
          Get Pro Advice
        </button>
      </div>
    </aside>
  );
}