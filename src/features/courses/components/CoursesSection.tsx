import { useFeaturedCourses } from '@/features/courses/hooks';
import { CourseCard } from './CourseCard';
import { Button } from '@/components/ui/button';
import { CourseSkeleton } from './CourseSkeleton';
import { ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CoursesSection() {
  const { data: courses, isLoading, isError } = useFeaturedCourses();

  return (
    <section id="courses" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
              Popular Courses
            </h2>
            <p className="text-zinc-600 max-w-xl text-lg">
              Choose from our wide range of specialized batches designed to help you crack government exams with confidence.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="outline" className="hidden md:flex gap-2 h-12 px-6">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <Info className="w-12 h-12 mb-4 text-zinc-300" />
            <p className="text-lg font-medium">Failed to load courses</p>
            <p className="text-sm">Please try again later</p>
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <p className="text-lg font-medium">No courses available at the moment</p>
          </div>
        )}

        <div className="mt-12 md:hidden">
          <Link to="/courses">
            <Button variant="outline" className="w-full h-12 text-lg gap-2">
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

