import { useQuery } from '@tanstack/react-query';
import { fetchCourses, fetchFeaturedCourses, fetchCourseById, fetchCourseCurriculum } from './api';

export function useCourses(sortBy: string = 'popular') {
  return useQuery({
    queryKey: ['courses', sortBy],
    queryFn: () => fetchCourses(sortBy),
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: fetchFeaturedCourses,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => fetchCourseById(id),
    enabled: !!id,
  });
}

export function useCourseCurriculum(courseId: string) {
  return useQuery({
    queryKey: ['courses', courseId, 'curriculum'],
    queryFn: () => fetchCourseCurriculum(courseId),
    enabled: !!courseId,
  });
}
