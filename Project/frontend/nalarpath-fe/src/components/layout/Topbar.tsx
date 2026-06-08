import { Bell, UserCircle } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-14 flex-shrink-0 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-6">
      <span className="font-heading font-semibold text-primary text-base tracking-wide">
        NalarPath AI
      </span>
      <div className="flex items-center gap-3">
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-on-surface-variant hover:text-on-surface transition-colors">
          <UserCircle size={20} />
        </button>
      </div>
    </header>
  );
}