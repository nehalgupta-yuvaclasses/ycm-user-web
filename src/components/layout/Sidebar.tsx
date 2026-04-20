import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ACCOUNT_NAV_ITEMS, MAIN_NAV_ITEMS, isActiveRoute } from './navigation';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  className?: string;
  onLogout: () => void;
}

export function Sidebar({ className, onLogout }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn('hidden h-screen w-[240px] shrink-0 flex-col border-r border-border bg-background lg:flex', className)}>
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted/40 text-foreground">
            <GraduationCap className="size-4" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-medium text-foreground">YUVA</p>
            <p className="text-xs text-muted-foreground">Classes</p>
          </div>
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
        <nav className="space-y-5">
          <div className="space-y-1">
            <p className="px-2 text-xs text-muted-foreground">Main</p>
            <div className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isActiveRoute(location.pathname, item.href)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="px-2 text-xs text-muted-foreground">Account</p>
            <div className="space-y-1">
              {ACCOUNT_NAV_ITEMS.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isActiveRoute(location.pathname, item.href)}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto pt-4">
          <Separator className="mb-4" />
          <Button variant="outline" onClick={onLogout} className="w-full justify-start gap-2">
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}