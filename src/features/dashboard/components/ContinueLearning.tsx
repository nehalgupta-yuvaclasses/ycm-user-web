import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { DashboardCourseItem } from '@/features/dashboard/types';

interface ContinueLearningProps {
  course: DashboardCourseItem | null;
}

export function ContinueLearning({ course }: ContinueLearningProps) {
  if (!course) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Continue learning</p>
            <h2 className="text-lg font-medium text-foreground">No active course</h2>
          </div>
          <Button nativeButton={false} render={<Link to="/courses" />} className="w-full sm:w-auto">
            Browse Courses
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="space-y-4 p-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Continue learning</p>
          <h2 className="text-lg font-medium text-foreground">{course.title}</h2>
        </div>

        {course.lastLessonTitle ? (
          <p className="text-sm text-foreground">
            Last lesson: <span className="font-medium">{course.lastLessonTitle}</span>
          </p>
        ) : null}

        <div className="space-y-2">
          <Progress
            value={course.progress}
            className="w-full flex-col gap-2 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-muted [&_[data-slot=progress-indicator]]:bg-foreground"
          />
          <p className="text-xs text-muted-foreground">{course.progress}% complete</p>
        </div>

        <Button nativeButton={false} render={<Link to={course.href} />} className="w-full sm:w-auto">
          <Play className="size-4" />
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}