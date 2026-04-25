import { supabase } from "@/lib/supabaseClient";
import { Course, CourseLesson, CourseModule, CourseSubject } from "./types";

// Helper: fast UUID v4 check (8-4-4-4-12 pattern)
function isPossibleUuid(value: string | null | undefined): value is string {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

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
  lesson_type: "recorded" | "live" | null;
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

type EnrollmentRow = {
  id: string;
  course_id: string | null;
  student_id: string | null;
  user_id: string | null;
  payment_status: string | null;
};

export async function fetchCourses(
  sortBy: string = "popular",
): Promise<Course[]> {
  let query = supabase.from("courses").select("*").eq("status", "Published");

  switch (sortBy) {
    case "price-low":
      query = query.order("selling_price", { ascending: true });
      break;
    case "price-high":
      query = query.order("selling_price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "popular":
    default:
      query = query.order("students_count", { ascending: false });
      break;
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchFeaturedCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "Published")
    .order("students_count", { ascending: false })
    .limit(3);

  if (error) throw error;
  return data || [];
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchCourseCurriculum(courseId: string) {
  const { data, error } = await supabase.rpc("get_course_curriculum", {
    course_uuid: courseId,
  });

  if (error) throw error;
  return (Array.isArray(data) ? data : []) as CourseSubject[];
}

export async function fetchCourseEnrollment(
  courseId: string,
  userId: string | null,
  studentId: string | null,
) {
  if (!courseId || (!userId && !studentId)) {
    return null;
  }

  const query = "id, course_id, student_id, user_id, payment_status";

  if (userId) {
    // For Firebase users, userId is a Firebase UID (not a UUID). Query by student_id instead.
    const filter = isPossibleUuid(userId) ? "user_id" : "student_id";
    const filterValue = isPossibleUuid(userId) ? userId : studentId;

    if (!filterValue) {
      return null;
    }

    const { data, error } = await supabase
      .from("enrollments")
      .select(query)
      .eq("course_id", courseId)
      .eq(filter, filterValue)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as EnrollmentRow;
  }

  if (studentId) {
    const { data, error } = await supabase
      .from("enrollments")
      .select(query)
      .eq("course_id", courseId)
      .eq("student_id", studentId)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as EnrollmentRow;
  }

  return null;
}
