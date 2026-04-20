import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Download,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const PRIMARY_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Tests', href: '/dashboard/tests', icon: FileText },
  { name: 'Resources', href: '/dashboard/resources', icon: Download },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
];

const SECONDARY_NAV = [
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
  onLogout: () => void;
}

export function Sidebar({ className, onLogout }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const NavItem = ({ item, isActive }: { item: typeof PRIMARY_NAV[0], isActive: boolean }) => {
    const content = (
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 group relative',
          isActive 
            ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10' 
            : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
        )}
      >
        <item.icon className={cn('size-4 shrink-0', isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900')} />
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-semibold tracking-tight"
          >
            {item.name}
          </motion.span>
        )}
        {isActive && !isCollapsed && (
          <motion.div 
            layoutId="active-pill"
            className="ml-auto size-1.5 rounded-full bg-white/80" 
          />
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10} className="border-zinc-200 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
            {item.name}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative z-40 flex h-screen flex-col border-r border-zinc-100 bg-white transition-colors duration-300',
        className
      )}
    >
      {/* Sidebar Toggle Button - Improved Placement */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-50 flex size-6 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition-all hover:scale-110 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white group"
      >
        {isCollapsed ? (
          <ChevronRight className="size-3" />
        ) : (
          <ChevronLeft className="size-3" />
        )}
      </button>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-50 px-5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20">
              <GraduationCap className="size-5" />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col leading-none"
              >
                <span className="text-sm font-black tracking-tight text-zinc-900">YUVA</span>
                <span className="text-[10px] font-bold text-zinc-400">CLASSES</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-6">
          <div className="space-y-8">
            <div className="space-y-1.5">
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Main Menu</p>
              )}
              <div className="space-y-1">
                {PRIMARY_NAV.map((item) => (
                  <NavItem key={item.name} item={item} isActive={location.pathname === item.href} />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Account settings</p>
              )}
              <div className="space-y-1">
                {SECONDARY_NAV.map((item) => (
                  <NavItem key={item.name} item={item} isActive={location.pathname === item.href} />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="mt-auto border-t border-zinc-50 p-4">
          <Button 
            variant="ghost"
            onClick={onLogout}
            className={cn(
              'h-11 w-full gap-3 rounded-xl text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300',
              isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
            )}
          >
            <LogOut className="size-4 shrink-0" />
            {!isCollapsed && <span className="text-sm font-semibold tracking-tight">Logout</span>}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
