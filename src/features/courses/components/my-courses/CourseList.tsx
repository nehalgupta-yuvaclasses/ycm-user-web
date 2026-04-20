import type { DashboardCourseItem } from '@/features/dashboard/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CourseCard } from './CourseCard';

interface CourseListProps {
  courses: DashboardCourseItem[];
}

export function CourseList({ courses }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">No courses yet</p>
            <h2 className="text-base font-medium text-foreground">Browse courses to get started</h2>
          </div>
          <Button nativeButton={false} render={<Link to="/courses" />} className="w-full sm:w-auto">
            Browse Courses
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}