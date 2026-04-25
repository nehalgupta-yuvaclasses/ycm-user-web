import * as React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { Header } from '@/components/layout/Header';
import { useDashboardIdentity } from '@/features/dashboard/hooks';
import { useAuthModal } from '@/contexts/AuthContext';

export function DashboardLayout() {
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const { loading, logout, user } = useAuthModal();
  const identityQuery = useDashboardIdentity({ enabled: Boolean(user?.onboardingComplete) });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.onboardingComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
            <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950">Completing onboarding</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            We are preparing your student profile. Finish the onboarding dialog to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  const identity = identityQuery.data ?? {
    id: 'guest',
    name: 'Student',
    email: '',
    avatarUrl: null,
    initials: 'S',
    location: null,
  };

  const handleLogout = async () => {
    setIsMobileSidebarOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar onLogout={handleLogout} />
      <MobileSidebar open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen} onLogout={handleLogout} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header user={identity} onLogout={handleLogout} onMenuOpen={() => setIsMobileSidebarOpen(true)} />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
