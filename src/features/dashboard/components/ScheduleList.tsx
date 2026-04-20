import { Link } from 'react-router-dom';
import { ChevronRight, Clock3, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardScheduleItem } from '@/features/dashboard/types';
import { cn } from '@/lib/utils';

interface ScheduleListProps {
  items: DashboardScheduleItem[];
}

export function ScheduleList({ items }: ScheduleListProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-sm font-medium text-foreground">Upcoming schedule</CardTitle>
        <p className="text-sm text-muted-foreground">Live classes and upcoming sessions</p>
      </CardHeader>
      <CardContent className="p-0">
        {items.length > 0 ? (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  'flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-6'
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background">
                    <Video className="size-4 text-foreground" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <Badge variant="outline" className="shrink-0 capitalize">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{item.courseTitle}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 className="size-3.5" />
                      {item.timeLabel}
                    </div>
                  </div>
                </div>

                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center sm:px-6">
            <p className="text-sm font-medium text-foreground">No upcoming classes</p>
            <p className="mt-1 text-sm text-muted-foreground">Your schedule is clear for now.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}