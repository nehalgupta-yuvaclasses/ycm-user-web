import { Link } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Search, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DashboardIdentity } from '@/features/dashboard/types';

interface TopBarProps {
  user: DashboardIdentity;
  onLogout: () => void;
}

export function TopBar({ user, onLogout }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="flex h-auto items-center gap-2 px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search lessons, tests, resources"
            className="h-10 pl-9"
            aria-label="Search dashboard"
          />
        </div>

        <Button variant="ghost" size="icon-sm" className="shrink-0">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex shrink-0 items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-muted/50">
                <Avatar className="size-8">
                  <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
                <div className="hidden items-start leading-tight sm:flex sm:flex-col">
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.location ?? 'Student'}</span>
                </div>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem render={<Link to="/dashboard/profile" className="flex w-full items-center gap-2" />}>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link to="/dashboard/settings" className="flex w-full items-center gap-2" />}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}