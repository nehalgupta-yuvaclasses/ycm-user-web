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
  youtube_live_url: string | null;
  youtube_recording_url: string | null;
  live_url: string | null;
  notes: string | null;
  is_live: boolean | null;
  is_recorded_ready: boolean | null;
  live_started_at: string | null;
  live_ended_at: string | null;
  live_by: string | null;
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
  const { data, error } = await supabase.rpc('get_course_curriculum', { course_uuid: courseId });

  if (error) throw error;

  return (Array.isArray(data) ? data : []) as CourseSubject[];
}
