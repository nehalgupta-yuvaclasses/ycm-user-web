import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { PerformanceItem } from '../types';

interface PerformanceCardProps {
  items: PerformanceItem[];
}

export function PerformanceCard({ items }: PerformanceCardProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-foreground">Recent performance</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className="border-border bg-card">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="line-clamp-2 text-sm font-medium text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.attemptedAtLabel}</p>
                </div>
                <div className="flex size-8 items-center justify-center rounded-md border border-border bg-muted/50">
                  <BarChart3 className="size-4 text-foreground" />
                </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-2xl font-medium text-foreground">{item.scoreLabel}</p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-medium text-foreground">{item.scorePercent}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>

              <Button nativeButton={false} render={<Link to={item.analysisHref} />} variant="outline" className="w-full">
                View Analysis
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}