import { Link } from 'react-router-dom';
import { useStudentDashboard } from '@/features/dashboard/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ContinueLearningCard } from '@/features/courses/components/my-courses/ContinueLearningCard';
import { CourseList } from '@/features/courses/components/my-courses/CourseList';

function MyCoursesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36" />
      </div>

      <Skeleton className="h-36 w-full rounded-lg" />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function MyCourses() {
  const { data, isLoading, isError } = useStudentDashboard();

  if (isLoading) {
    return <MyCoursesSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-foreground">Unable to load courses</p>
          <p className="text-sm text-muted-foreground">Try again in a moment.</p>
          <Button nativeButton={false} render={<Link to="/courses" />} className="w-full sm:w-auto">
            Browse Courses
          </Button>
        </CardContent>
      </Card>
    );
  }

  const courses = data.courses;
  const continueCourse = data.continueLearning;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">My Courses</h1>
          <p className="text-sm text-muted-foreground">Continue where you left off</p>
        </div>
        <Button nativeButton={false} render={<Link to="/courses" />} className="w-full sm:w-auto">
          Browse Courses
        </Button>
      </div>

      <ContinueLearningCard course={continueCourse} />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">All courses</p>
          <p className="text-xs text-muted-foreground">{courses.length} enrolled</p>
        </div>
        <CourseList courses={courses} />
      </section>
    </div>
  );
}
