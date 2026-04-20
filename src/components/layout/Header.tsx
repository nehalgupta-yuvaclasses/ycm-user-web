import * as React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DashboardIdentity } from '@/features/dashboard/types';
import { getDashboardTitle } from './navigation';
import { UserDropdown } from './UserDropdown';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  user: DashboardIdentity;
  onLogout: () => void;
  onMenuOpen: () => void;
  className?: string;
}

export function Header({ user, onLogout, onMenuOpen, className }: HeaderProps) {
  const location = useLocation();
  const title = getDashboardTitle(location.pathname);

  return (
    <header className={cn('sticky top-0 z-30 border-b border-border bg-background', className)}>
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={onMenuOpen}>
          <Menu className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>

        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-medium text-foreground md:flex-none md:text-left md:text-base">
          {title}
        </h1>

        <div className="hidden min-w-0 flex-1 md:block">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses, tests, resources..."
              className="h-10 pl-9"
              aria-label="Search dashboard"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" className="hidden md:inline-flex">
            <Bell className="size-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          <UserDropdown user={user} onLogout={onLogout} />
        </div>
      </div>

      <div className="border-t border-border px-4 pb-3 pt-0 md:hidden sm:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses, tests, resources..."
            className="h-10 pl-9"
            aria-label="Search dashboard"
          />
        </div>
      </div>
    </header>
  );
}