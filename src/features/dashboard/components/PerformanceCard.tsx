import { Trophy, Target, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardPerformance } from '@/features/dashboard/types';

interface PerformanceCardProps {
  performance: DashboardPerformance;
}

export function PerformanceCard({ performance }: PerformanceCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-sm font-medium text-foreground">Performance</CardTitle>
        <p className="text-sm text-muted-foreground">Recent test activity and accuracy</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background">
              <Trophy className="size-5 text-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{performance.testsAttempted}</p>
              <p className="text-xs text-muted-foreground">Tests attempted</p>
            </div>
          </div>
          <Badge variant={performance.improvement >= 0 ? 'default' : 'destructive'} className="gap-1">
            <TrendingUp className="size-3.5" />
            {performance.improvement >= 0 ? '+' : ''}{performance.improvement}%
          </Badge>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-border p-4">
          <div className="flex size-10 items-center justify-center rounded-md bg-foreground text-background">
            <Target className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold text-foreground">{performance.averageScore}%</p>
              <span className="text-xs text-muted-foreground">Average score</span>
            </div>
            <p className="text-xs text-muted-foreground">Best score: {performance.bestScore}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}