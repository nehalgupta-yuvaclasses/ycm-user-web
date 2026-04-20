import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DashboardCourseItem } from '@/features/dashboard/types';

interface CourseCardProps {
  course: DashboardCourseItem;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className={cn(
      'min-w-[280px] max-w-[320px] border-border bg-card shadow-sm transition-colors duration-200 hover:border-foreground/20',
      'sm:min-w-[300px]'
    )}>
      <CardHeader className="space-y-3 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h3 className="line-clamp-2 text-sm font-medium text-foreground">{course.title}</h3>
            <p className="text-xs text-muted-foreground">{course.instructor}</p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {course.progress}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{course.attemptedTests}/{course.totalTests || 0} tests</span>
          </div>
          <Progress
            value={course.progress}
            className="w-full flex-col gap-2 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-foreground"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Last accessed {course.lastAccessedLabel}</p>
          <Button nativeButton={false} render={<Link to={course.href} />} variant="outline" size="sm" className="gap-1.5">
            Open
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
