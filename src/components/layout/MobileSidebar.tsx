import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ACCOUNT_NAV_ITEMS, MAIN_NAV_ITEMS, isActiveRoute } from './navigation';
import { SidebarItem } from './SidebarItem';

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
}

export function MobileSidebar({ open, onOpenChange, onLogout }: MobileSidebarProps) {
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0 sm:w-[320px]">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border px-4 py-4">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted/40 text-foreground">
                <GraduationCap className="size-4" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-sm font-medium text-foreground">YUVA</p>
                <p className="text-xs text-muted-foreground">Classes</p>
              </div>
            </Link>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4">
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
                    onClick={() => onOpenChange(false)}
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
                    onClick={() => onOpenChange(false)}
                  />
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border">
            <Separator />
            <Button variant="outline" onClick={onLogout} className="w-full justify-start gap-2">
              <LogOut className="size-4" />
              Logout
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}