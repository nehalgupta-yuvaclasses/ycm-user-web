import { Link } from 'react-router-dom';
import { Clock3, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DashboardCourseItem } from '@/features/dashboard/types';

interface ContinueLearningCardProps {
  course: DashboardCourseItem | null;
}

export function ContinueLearningCard({ course }: ContinueLearningCardProps) {
  if (!course) {
    return (
      <Card className="border-border bg-card p-6 sm:p-8 lg:p-10">
        <div className="space-y-4">
          <Badge variant="outline" className="w-fit">Continue learning</Badge>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">No active course yet</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Enroll in a course to track progress and resume lessons from this dashboard.
            </p>
          </div>
          <Button nativeButton={false} render={<Link to="/courses" />} className="w-fit">
            Browse Courses
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'border-border bg-zinc-950 p-6 text-zinc-50 shadow-sm sm:p-8 lg:p-10',
      'transition-colors duration-200 hover:border-zinc-700'
    )}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-5">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <Clock3 className="size-3.5" />
            Last accessed {course.lastAccessedLabel}
          </div>

          <div className="space-y-2">
            <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              {course.title}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-zinc-400">
              {course.description ?? 'Continue where you left off and keep the momentum going.'}
            </p>
          </div>

          <div className="space-y-3 max-w-xl">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
              <span>Course progress</span>
              <span className="text-zinc-50">{course.progress}%</span>
            </div>
            <Progress
              value={course.progress}
              className="w-full flex-col gap-2 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-white/10 [&_[data-slot=progress-indicator]]:bg-white"
            />
          </div>
        </div>

        <Button
          nativeButton={false}
          render={<Link to={course.href} />}
          className="h-11 w-fit bg-white px-5 text-zinc-950 hover:bg-zinc-100"
        >
          <Play className="size-4" />
          Continue
        </Button>
      </div>
    </Card>
  );
}