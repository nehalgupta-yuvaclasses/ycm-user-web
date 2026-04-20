import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick?: () => void;
}

export function SidebarItem({ href, label, icon: Icon, active, onClick }: SidebarItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm transition-colors',
        active ? 'border-border bg-muted text-foreground' : 'text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground'
      )}
    >
      {active ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-foreground" /> : null}
      <Icon className={cn('size-4 shrink-0', active ? 'text-foreground' : 'text-muted-foreground')} />
      <span className={cn('truncate', active ? 'font-medium' : 'font-normal')}>{label}</span>
    </Link>
  );
}