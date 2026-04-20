import { supabase } from '@/lib/supabaseClient';
import { Course, CourseLesson, CourseModule, CourseSubject } from './types';

type SubjectRow = {
  id: string;
  course_id: string;
  name: string;
  order?: number | null;
};

type ModuleRow = {
  id: string;
  subject_id: string;
  title: string;
  order?: number | null;
};

type LessonRow = {
  id: string;
  module_id: string;
  title: string;
  lesson_type: 'recorded' | 'live' | null;
  duration: string | null;
  scheduled_at: string | null;
  video_url: string | null;
  live_url: string | null;
  notes: string | null;
  order?: number | null;
};

export async function fetchCourses(sortBy: string = 'popular'): Promise<Course[]> {
  let query = supabase
    .from('courses')
    .select('*')
    .eq('status', 'Published');

  switch (sortBy) {
    case 'price-low':
      query = query.order('selling_price', { ascending: true });
      break;
    case 'price-high':
      query = query.order('selling_price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'popular':
    default:
      query = query.order('students_count', { ascending: false });
      break;
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchFeaturedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'Published')
    .order('students_count', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data || [];
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchCourseCurriculum(courseId: string) {
  const [subjectsResponse, modulesResponse, lessonsResponse] = await Promise.all([
    supabase
      .from('subjects')
      .select('id, course_id, name, "order"')
      .eq('course_id', courseId)
      .order('order', { ascending: true }),
    supabase
      .from('modules')
      .select('id, subject_id, title, "order"')
      .eq('course_id', courseId)
      .order('order', { ascending: true }),
    supabase
      .from('lessons')
      .select('id, module_id, title, lesson_type, duration, scheduled_at, video_url, live_url, notes, "order"')
      .order('order', { ascending: true }),
  ]);

  if (subjectsResponse.error) throw subjectsResponse.error;
  if (modulesResponse.error) throw modulesResponse.error;
  if (lessonsResponse.error) throw lessonsResponse.error;

  const subjectRows = (subjectsResponse.data as SubjectRow[] | null) ?? [];
  const moduleRows = (modulesResponse.data as ModuleRow[] | null) ?? [];
  const lessonRows = (lessonsResponse.data as LessonRow[] | null) ?? [];

  const lessonsByModule = new Map<string, CourseLesson[]>();
  lessonRows.forEach((lessonRow) => {
    const current = lessonsByModule.get(lessonRow.module_id) ?? [];
    current.push({
      id: lessonRow.id,
      module_id: lessonRow.module_id,
      title: lessonRow.title,
      lesson_type: lessonRow.lesson_type ?? 'recorded',
      duration: lessonRow.duration,
      scheduled_at: lessonRow.scheduled_at,
      video_url: lessonRow.video_url,
      live_url: lessonRow.live_url,
      notes: lessonRow.notes,
      order: lessonRow.order ?? 0,
    });
    lessonsByModule.set(lessonRow.module_id, current);
  });

  const modulesBySubject = new Map<string, CourseModule[]>();
  moduleRows.forEach((moduleRow) => {
    const current = modulesBySubject.get(moduleRow.subject_id) ?? [];
    current.push({
      id: moduleRow.id,
      subject_id: moduleRow.subject_id,
      title: moduleRow.title,
      order: moduleRow.order ?? 0,
      lessons: (lessonsByModule.get(moduleRow.id) ?? []).sort((left, right) => left.order - right.order),
    });
    modulesBySubject.set(moduleRow.subject_id, current);
  });

  return subjectRows.map((subjectRow) => ({
    id: subjectRow.id,
    course_id: subjectRow.course_id,
    name: subjectRow.name,
    order: subjectRow.order ?? 0,
    modules: (modulesBySubject.get(subjectRow.id) ?? []).sort((left, right) => left.order - right.order),
  })) satisfies CourseSubject[];
}
