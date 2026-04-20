import { BarChart3, FileCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardPerformance } from '@/features/dashboard/types';

interface ProgressStatsProps {
  performance: DashboardPerformance;
}

export function ProgressStats({ performance }: ProgressStatsProps) {
  if (performance.testsAttempted === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-foreground">Progress snapshot</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background">
              <FileCheck className="size-4 text-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">{performance.testsAttempted}</p>
              <p className="text-xs text-muted-foreground">Tests attempted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background">
              <BarChart3 className="size-4 text-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">{performance.averageScore}%</p>
              <p className="text-xs text-muted-foreground">Average score</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}