import { Link } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { InsightItem } from '../types';

interface InsightsCardProps {
  insight: InsightItem | null;
}

export function InsightsCard({ insight }: InsightsCardProps) {
  if (!insight) {
    return null;
  }

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-foreground">Smart insights</p>
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50">
              <Lightbulb className="size-4 text-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground">{insight.title}</h3>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>

          <Button nativeButton={false} render={<Link to={insight.href} />} className="w-full sm:w-auto">
            View Weak Topics
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}