import { useStudentDashboard } from '@/features/dashboard/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ContinueLearning } from '@/features/dashboard/components/ContinueLearning';
import { QuickActions } from '@/features/dashboard/components/QuickActions';
import { ProgressStats } from '@/features/dashboard/components/ProgressStats';
import { UpcomingList } from '@/features/dashboard/components/UpcomingList';

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-44 w-full rounded-lg" />
      <div className="grid gap-2 sm:grid-cols-3">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
      <Skeleton className="h-36 w-full rounded-lg" />
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useStudentDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-foreground">Unable to load dashboard</p>
          <p className="text-sm text-muted-foreground">
            We could not fetch the dashboard data right now. Try again.
          </p>
          <Button onClick={() => refetch()} className="w-full sm:w-auto">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const quickActions = [
    {
      label: 'Join Live Class',
      href: data.schedule[0]?.href ?? data.continueLearning?.href ?? '/dashboard/courses',
    },
    { label: 'View Tests', href: '/dashboard/tests' },
    { label: 'Study Material', href: '/dashboard/resources' },
  ];

  return (
    <div className="space-y-4 pb-4">
      <ContinueLearning course={data.continueLearning} />
      <QuickActions actions={quickActions} />
      <ProgressStats performance={data.performance} />
      <UpcomingList items={data.schedule} />
    </div>
  );
}
