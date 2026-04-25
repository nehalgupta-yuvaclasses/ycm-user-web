import { supabase } from "@/lib/supabaseClient";
import { auth } from "@/lib/firebase";
import { syncFirebaseUserToSupabase } from "@/services/authService";
import type {
  DashboardCourseItem,
  DashboardIdentity,
  DashboardOverview,
  DashboardPerformance,
  DashboardScheduleItem,
} from "./types";

// Helper: fast UUID v4 check (8-4-4-4-12 pattern)
function isPossibleUuid(value: string | null | undefined): value is string {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

type AuthUser = {
  id: string;
  email?: string;
  phoneNumber?: string | null;
};

type StudentRow = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  city: string | null;
  state: string | null;
};

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
};

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
};

type EnrollmentRow = {
  id: string;
  created_at: string;
  course_id: string | null;
  student_id: string | null;
  user_id: string | null;
};

type TestRow = {
  id: string;
  course_id: string | null;
  title: string;
  total_marks: number | null;
  created_at: string;
};

type AttemptRow = {
  id: string;
  score: number | null;
  submitted_at: string | null;
  test_id: string | null;
};

type CourseRow = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  students_count: number | null;
  selling_price: number | null;
  author: string | null;
  created_at: string;
};

type SubjectRow = {
  id: string;
  course_id: string | null;
  name: string;
};

type ModuleRow = {
  id: string;
  subject_id: string | null;
};

type LessonRow = {
  id: string;
  module_id: string | null;
  title: string;
  lesson_type: "live" | "recorded";
  scheduled_at: string | null;
  duration: string | null;
  created_at: string;
};

type StudentContext = {
  authUser: AuthUser | null;
  student: StudentRow | null;
  profile: ProfileRow | null;
  userRecord: UserRow | null;
};

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "S"
  );
}

function formatRelativeTime(dateIso: string) {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatScheduleLabel(dateIso: string) {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return "To be announced";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  if (target.getTime() === today.getTime()) {
    return `Today, ${time}`;
  }

  if (target.getTime() === tomorrow.getTime()) {
    return `Tomorrow, ${time}`;
  }

  const day = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);

  return `${day}, ${time}`;
}

function getIdentity(context: StudentContext): DashboardIdentity {
  const fallbackName =
    context.profile?.name ??
    context.student?.full_name ??
    context.userRecord?.name ??
    context.authUser?.email?.split("@")[0] ??
    context.authUser?.phoneNumber?.replace("+91", "") ??
    "Student";

  const email =
    context.profile?.email ??
    context.student?.email ??
    context.userRecord?.email ??
    context.authUser?.email ??
    "";

  const locationParts = [context.student?.city, context.student?.state].filter(
    Boolean,
  );

  return {
    id: context.student?.id ?? context.authUser?.id ?? "guest",
    name: fallbackName,
    email,
    avatarUrl: context.userRecord?.avatar_url ?? null,
    initials: getInitials(fallbackName),
    location: locationParts.length > 0 ? locationParts.join(", ") : null,
  };
}

async function resolveStudentContext(): Promise<StudentContext> {
  const firebaseUser = auth?.currentUser;

  if (!firebaseUser) {
    throw new Error("You must be signed in to view the dashboard.");
  }

  const [studentResponse, profileResponse, syncedUser] = await Promise.all([
    firebaseUser.email
      ? supabase
          .from("students")
          .select("id, user_id, full_name, email, city, state")
          .eq("email", firebaseUser.email)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    firebaseUser.email
      ? supabase
          .from("profiles")
          .select("id, name, email, role")
          .eq("email", firebaseUser.email)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    syncFirebaseUserToSupabase(firebaseUser),
  ]);

  return {
    authUser: {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? undefined,
      phoneNumber: firebaseUser.phoneNumber ?? null,
    },
    student: (studentResponse.data as StudentRow | null) ?? null,
    profile: (profileResponse.data as ProfileRow | null) ?? null,
    userRecord: {
      id: syncedUser.id,
      name: syncedUser.name,
      email: syncedUser.email,
      avatar_url: syncedUser.avatarUrl,
    },
  };
}

function aggregatePerformance(attempts: AttemptRow[]): DashboardPerformance {
  const scores = attempts
    .map((attempt) => attempt.score ?? 0)
    .filter((score) => Number.isFinite(score));

  const testsAttempted = attempts.length;
  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      : 0;

  const recentScores = scores.slice(0, 3);
  const previousScores = scores.slice(3, 6);
  const recentAverage =
    recentScores.length > 0
      ? recentScores.reduce((sum, score) => sum + score, 0) /
        recentScores.length
      : 0;
  const previousAverage =
    previousScores.length > 0
      ? previousScores.reduce((sum, score) => sum + score, 0) /
        previousScores.length
      : 0;

  const improvement =
    previousAverage > 0 ? Math.round(recentAverage - previousAverage) : 0;

  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  return {
    testsAttempted,
    averageScore,
    improvement,
    bestScore,
  };
}

export async function fetchDashboardIdentity(): Promise<DashboardIdentity> {
  const context = await resolveStudentContext();
  return getIdentity(context);
}

export async function fetchStudentDashboard(): Promise<DashboardOverview> {
  const context = await resolveStudentContext();
  const user = getIdentity(context);

  if (!context.student) {
    return {
      user,
      continueLearning: null,
      courses: [],
      performance: {
        testsAttempted: 0,
        averageScore: 0,
        improvement: 0,
        bestScore: 0,
      },
      schedule: [],
    };
  }

  function buildEnrollmentFilter(
    authUserId: string,
    studentId: string | null,
  ): string[] {
    const filters: string[] = [];

    // For Supabase email auth: authUserId is a UUID → query by user_id
    // For Firebase auth: authUserId is a Firebase UID → cannot query user_id (UUID column)
    if (isPossibleUuid(authUserId)) {
      filters.push(`user_id.eq.${authUserId}`);
    }

    // Always add student_id filter if available (works for both)
    if (studentId) {
      filters.push(`student_id.eq.${studentId}`);
    }

    return filters;
  }

  const enrollmentFilters = buildEnrollmentFilter(
    context.authUser?.id ?? null,
    context.student?.id ?? null,
  );

  const [enrollmentsResponse, attemptsResponse] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id, created_at, course_id, student_id, user_id")
      .or(enrollmentFilters.join(","))
      .order("created_at", { ascending: false }),
    supabase
      .from("attempts")
      .select("id, score, submitted_at, test_id")
      .eq("student_id", context.student.id)
      .eq("status", "completed")
      .order("submitted_at", { ascending: false }),
  ]);

  if (enrollmentsResponse.error) {
    throw enrollmentsResponse.error;
  }

  if (attemptsResponse.error) {
    throw attemptsResponse.error;
  }

  const enrollments =
    (enrollmentsResponse.data as EnrollmentRow[] | null) ?? [];
  const attempts = (attemptsResponse.data as AttemptRow[] | null) ?? [];

  const courseIds = enrollments
    .map((enrollment) => enrollment.course_id)
    .filter((courseId): courseId is string => Boolean(courseId));

  const [coursesResponse, testsResponse, subjectsResponse] =
    courseIds.length > 0
      ? await Promise.all([
          supabase
            .from("courses")
            .select(
              "id, title, description, thumbnail_url, students_count, selling_price, author, created_at",
            )
            .in("id", courseIds),
          supabase
            .from("tests")
            .select("id, course_id, title, total_marks, created_at")
            .in("course_id", courseIds)
            .eq("status", "published"),
          supabase
            .from("subjects")
            .select("id, course_id, name")
            .in("course_id", courseIds),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];

  if (coursesResponse.error) {
    throw coursesResponse.error;
  }

  if (testsResponse.error) {
    throw testsResponse.error;
  }

  if (subjectsResponse.error) {
    throw subjectsResponse.error;
  }

  const coursesById = new Map<string, CourseRow>();
  ((coursesResponse.data as CourseRow[] | null) ?? []).forEach((course) => {
    coursesById.set(course.id, course);
  });

  const tests = (testsResponse.data as TestRow[] | null) ?? [];
  const subjects = (subjectsResponse.data as SubjectRow[] | null) ?? [];
  const subjectIds = subjects.map((subject) => subject.id);

  const modulesResponse =
    subjectIds.length > 0
      ? await supabase
          .from("modules")
          .select("id, subject_id")
          .in("subject_id", subjectIds)
      : { data: [], error: null };

  if (modulesResponse.error) {
    throw modulesResponse.error;
  }

  const moduleRows = (modulesResponse.data as ModuleRow[] | null) ?? [];
  const moduleIds = moduleRows.map((module) => module.id);

  const lessonsResponse =
    moduleIds.length > 0
      ? await supabase
          .from("lessons")
          .select(
            "id, module_id, title, lesson_type, scheduled_at, duration, created_at",
          )
          .in("module_id", moduleIds)
          .order("created_at", { ascending: false })
      : { data: [], error: null };

  if (lessonsResponse.error) {
    throw lessonsResponse.error;
  }

  const lessons = (lessonsResponse.data as LessonRow[] | null) ?? [];

  const courseBySubjectId = new Map<string, string>();
  subjects.forEach((subject) => {
    if (subject.course_id) {
      courseBySubjectId.set(subject.id, subject.course_id);
    }
  });

  const courseByModuleId = new Map<string, string>();
  moduleRows.forEach((module) => {
    if (!module.subject_id) {
      return;
    }

    const courseId = courseBySubjectId.get(module.subject_id);
    if (courseId) {
      courseByModuleId.set(module.id, courseId);
    }
  });

  const latestLessonByCourse = new Map<string, { id: string; title: string }>();
  lessons.forEach((lesson) => {
    if (!lesson.module_id) {
      return;
    }

    const courseId = courseByModuleId.get(lesson.module_id);
    if (!courseId || latestLessonByCourse.has(courseId)) {
      return;
    }

    latestLessonByCourse.set(courseId, { id: lesson.id, title: lesson.title });
  });

  function buildCourseHref(courseId: string, lessonId: string | null) {
    return lessonId
      ? `/course/${courseId}?lecture=${lessonId}`
      : `/course/${courseId}`;
  }

  const testsByCourse = new Map<string, number>();
  tests.forEach((test) => {
    if (!test.course_id) {
      return;
    }

    testsByCourse.set(
      test.course_id,
      (testsByCourse.get(test.course_id) ?? 0) + 1,
    );
  });

  const attemptsByCourse = new Map<string, Set<string>>();
  const lastAccessedByCourse = new Map<string, string>();
  const testCourseMap = new Map<string, string>();

  tests.forEach((test) => {
    if (test.course_id) {
      testCourseMap.set(test.id, test.course_id);
    }
  });

  enrollments.forEach((enrollment) => {
    if (enrollment.course_id) {
      lastAccessedByCourse.set(enrollment.course_id, enrollment.created_at);
    }
  });

  attempts.forEach((attempt) => {
    const courseId = attempt.test_id
      ? testCourseMap.get(attempt.test_id)
      : null;
    if (!courseId) {
      return;
    }

    if (!attemptsByCourse.has(courseId)) {
      attemptsByCourse.set(courseId, new Set<string>());
    }

    if (attempt.test_id) {
      attemptsByCourse.get(courseId)?.add(attempt.test_id);
    }

    if (attempt.submitted_at) {
      const currentLatest = lastAccessedByCourse.get(courseId);
      if (
        !currentLatest ||
        new Date(attempt.submitted_at).getTime() >
          new Date(currentLatest).getTime()
      ) {
        lastAccessedByCourse.set(courseId, attempt.submitted_at);
      }
    }
  });

  const courses: DashboardCourseItem[] = enrollments
    .map((enrollment) => {
      const course = enrollment.course_id
        ? coursesById.get(enrollment.course_id)
        : null;

      if (!course) {
        return null;
      }

      const totalTests = testsByCourse.get(course.id) ?? 0;
      const attemptedTests = attemptsByCourse.get(course.id)?.size ?? 0;
      const progress =
        totalTests > 0
          ? Math.min(100, Math.round((attemptedTests / totalTests) * 100))
          : 0;
      const lastAccessedAt =
        lastAccessedByCourse.get(course.id) ?? enrollment.created_at;

      return {
        id: course.id,
        title: course.title,
        instructor: course.author ?? "Faculty",
        description: course.description,
        thumbnailUrl: course.thumbnail_url,
        progress,
        totalTests,
        attemptedTests,
        lastAccessedAt,
        lastAccessedLabel: formatRelativeTime(lastAccessedAt),
        lastLessonTitle: latestLessonByCourse.get(course.id)?.title ?? null,
        lastLessonId: latestLessonByCourse.get(course.id)?.id ?? null,
        href: buildCourseHref(
          course.id,
          latestLessonByCourse.get(course.id)?.id ?? null,
        ),
      } satisfies DashboardCourseItem;
    })
    .filter((course): course is DashboardCourseItem => Boolean(course))
    .sort((left, right) => {
      const leftTime = new Date(left.lastAccessedAt).getTime();
      const rightTime = new Date(right.lastAccessedAt).getTime();

      if (rightTime !== leftTime) {
        return rightTime - leftTime;
      }

      return right.progress - left.progress;
    });

  const continueLearning =
    courses.find((course) => course.progress < 100) ?? courses[0] ?? null;

  const schedule: DashboardScheduleItem[] = lessons
    .filter(
      (lesson) =>
        lesson.scheduled_at &&
        new Date(lesson.scheduled_at).getTime() >= Date.now(),
    )
    .sort(
      (left, right) =>
        new Date(left.scheduled_at ?? 0).getTime() -
        new Date(right.scheduled_at ?? 0).getTime(),
    )
    .map((lesson) => {
      if (!lesson.module_id || !lesson.scheduled_at) {
        return null;
      }

      const courseId = courseByModuleId.get(lesson.module_id);
      const course = courseId ? coursesById.get(courseId) : null;

      if (!course) {
        return null;
      }

      return {
        id: lesson.id,
        title: lesson.title,
        courseTitle: course.title,
        courseId: course.id,
        timeLabel: formatScheduleLabel(lesson.scheduled_at),
        type: lesson.lesson_type,
        href: `/course/${course.id}`,
      } satisfies DashboardScheduleItem;
    })
    .filter((item): item is DashboardScheduleItem => Boolean(item));

  const performance = aggregatePerformance(attempts);

  return {
    user,
    continueLearning,
    courses,
    performance,
    schedule,
  };
}
