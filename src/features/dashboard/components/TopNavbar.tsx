import { Link } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from 'lucide-react';
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { DashboardIdentity } from '@/features/dashboard/types';
import { Sidebar } from './Sidebar';

interface TopNavbarProps {
  user: DashboardIdentity;
  onLogout: () => void;
}

export function TopNavbar({ user, onLogout }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="shrink-0">
                  <Menu className="size-4" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-[280px] p-0" showCloseButton>
              <Sidebar className="w-full border-r-0" onLogout={onLogout} />
            </SheetContent>
          </Sheet>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">YUVA CLASSES</span>
            <span className="text-xs text-muted-foreground">Student dashboard</span>
          </div>
        </div>

        <div className="hidden w-full max-w-md items-center gap-2 md:flex">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses, tests, resources"
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-foreground" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-border hover:bg-muted/50">
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
      </div>
    </header>
  );
}