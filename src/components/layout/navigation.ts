import {
  BookOpen,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  User,
} from 'lucide-react';

export const MAIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
  { label: 'Tests', href: '/dashboard/tests', icon: FileText },
  { label: 'Resources', href: '/dashboard/resources', icon: BookOpen },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
] as const;

export const ACCOUNT_NAV_ITEMS = [
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
] as const;

export const DASHBOARD_TITLES: Array<{ path: string; title: string }> = [
  { path: '/dashboard', title: 'Dashboard' },
  { path: '/dashboard/courses', title: 'My Courses' },
  { path: '/dashboard/tests', title: 'Tests' },
  { path: '/dashboard/resources', title: 'Resources' },
  { path: '/dashboard/payments', title: 'Payments' },
  { path: '/dashboard/profile', title: 'Profile' },
  { path: '/dashboard/settings', title: 'Settings' },
];

export function getDashboardTitle(pathname: string) {
  if (pathname.startsWith('/dashboard/tests/')) {
    return 'Tests';
  }

  if (pathname.startsWith('/dashboard/payments/')) {
    return 'Payments';
  }

  return DASHBOARD_TITLES.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`))?.title ?? 'Dashboard';
}

export function isActiveRoute(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}