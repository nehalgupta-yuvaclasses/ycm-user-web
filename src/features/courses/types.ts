export interface Course {
  id: string;
  title: string;
  description: string | null;
  status: 'Published' | 'Draft';
  thumbnail_url: string | null;
  students_count: number;
  created_at: string;
  buying_price: number;
  selling_price: number;
  author: string | null;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  lesson_type: 'recorded' | 'live';
  duration: string | null;
  scheduled_at: string | null;
  video_url: string | null;
  live_url: string | null;
  notes: string | null;
  order: number;
}

export interface CourseModule {
  id: string;
  subject_id: string;
  title: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseSubject {
  id: string;
  course_id: string;
  name: string;
  order: number;
  modules: CourseModule[];
}
