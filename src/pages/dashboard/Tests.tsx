import { Link } from 'react-router-dom';
import { useTestSeriesOverview } from '@/features/tests/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TestList } from '@/features/tests/components/TestList';
import { PerformanceCard } from '@/features/tests/components/PerformanceCard';
import { InsightsCard } from '@/features/tests/components/InsightsCard';

export default function Tests() {
  const { data, isLoading, isError, refetch } = useTestSeriesOverview();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-52" />
          </div>
          <Skeleton className="h-10 w-full sm:w-44" />
        </div>
        <Skeleton className="h-56 w-full rounded-lg" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        <Skeleton className="h-36 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-foreground">Unable to load tests</p>
          <p className="text-sm text-muted-foreground">Try again in a moment.</p>
          <Button onClick={() => refetch()} className="w-full sm:w-auto">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { readyTests, recentPerformance, insight, stats } = data;

  return (
    <div className="space-y-4 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Test Series</h1>
          <p className="text-sm text-muted-foreground">Practice, analyze, improve</p>
        </div>
        <Button nativeButton={false} render={<Link to="/courses" />} className="w-full sm:w-auto">
          Explore Test Packs
        </Button>
      </div>

      {stats ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-border bg-card">
            <CardContent className="space-y-1 p-4">
              <p className="text-lg font-medium text-foreground">{stats.testsAttempted}</p>
              <p className="text-xs text-muted-foreground">Tests attempted</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="space-y-1 p-4">
              <p className="text-lg font-medium text-foreground">{stats.averageScore}%</p>
              <p className="text-xs text-muted-foreground">Average score</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <section className="space-y-3">
        <p className="text-sm font-medium text-foreground">Ready to Attempt</p>
        <TestList tests={readyTests} />
      </section>

      <PerformanceCard items={recentPerformance} />
      <InsightsCard insight={insight} />
    </div>
  );
}
