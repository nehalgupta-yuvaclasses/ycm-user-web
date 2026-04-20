import { Link } from 'react-router-dom';
import { Clock3, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardScheduleItem } from '@/features/dashboard/types';

interface UpcomingListProps {
  items: DashboardScheduleItem[];
}

export function UpcomingList({ items }: UpcomingListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-foreground">Upcoming</p>
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {items.slice(0, 3).map((item) => (
              <Link key={item.id} to={item.href} className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/40">
                <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background">
                  <Video className="size-4 text-foreground" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.courseTitle}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    {item.timeLabel}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}