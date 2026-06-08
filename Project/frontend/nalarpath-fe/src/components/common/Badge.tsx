interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export default function Badge({ label, variant = 'primary' }: BadgeProps) {
  const styles = {
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary-container text-on-secondary-container',
    tertiary: 'bg-tertiary-container text-on-tertiary-container',
  };

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[variant]}`}>
      {label}
    </span>
  );
}