import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { DashboardCourseItem } from '@/features/dashboard/types';

interface CourseCardProps {
  course: DashboardCourseItem;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="relative overflow-hidden border-border bg-card transition-colors hover:border-foreground/20">
      <Link
        to={course.href}
        aria-label={`Open ${course.title}`}
        className="absolute inset-0 z-10 rounded-[inherit]"
      />

      <CardContent className="relative z-0 flex gap-3 p-4">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="size-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-muted-foreground">{course.title.slice(0, 1)}</span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <h3 className="line-clamp-2 text-sm font-medium text-foreground">{course.title}</h3>
            <p className="text-xs text-muted-foreground">{course.instructor}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress
              value={course.progress}
              className="w-full flex-col gap-2 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-muted [&_[data-slot=progress-indicator]]:bg-foreground"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="truncate text-xs text-muted-foreground">
              {course.lastLessonTitle ? `Last lesson: ${course.lastLessonTitle}` : 'Resume from your last lesson'}
            </p>
            <Button
              nativeButton={false}
              render={<Link to={course.href} />}
              variant="outline"
              size="sm"
              className="relative z-20 w-full gap-1.5 sm:w-auto"
            >
              Continue
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}