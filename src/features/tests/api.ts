import { supabase } from '@/lib/supabaseClient';
import { auth } from '@/lib/firebase';
import type { InsightItem, PerformanceItem, ReadyTestItem, TestSeriesOverview, TestSeriesStats } from './types';

type AuthUser = {
  id: string;
  email?: string;
};

type StudentRow = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
};

type CourseRow = {
  id: string;
  title: string;
};

type SubjectRow = {
  id: string;
  course_id: string | null;
  name: string;
};

type TestRow = {
  id: string;
  course_id: string | null;
  subject_id: string | null;
  title: string;
  duration: number | null;
  total_marks: number | null;
  status: string;
  created_at: string;
};

type QuestionRow = {
  id: string;
  test_id: string | null;
};

type AttemptRow = {
  id: string;
  test_id: string | null;
  score: number | null;
  status: string;
  submitted_at: string | null;
};

type StudentContext = {
  authUser: AuthUser | null;
  student: StudentRow | null;
};

function formatRelativeTime(dateIso: string) {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

async function resolveStudentContext(): Promise<StudentContext> {
  const firebaseUser = auth.currentUser;

  if (firebaseUser) {
    const { data: student } = await supabase
      .from('students')
      .select('id, user_id, full_name, email')
      .eq('email', firebaseUser.email ?? '')
      .maybeSingle();

    return {
      authUser: {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? undefined,
      },
      student: student as StudentRow | null,
    };
  }

  throw new Error('You must be signed in to view tests.');
}

function formatDuration(duration: number | null) {
  if (!duration) {
    return 'Self-paced';
  }

  return `${duration} mins`;
}

function formatQuestionLabel(count: number) {
  return `${count} questions`;
}

function scorePercent(score: number | null, totalMarks: number | null) {
  if (!totalMarks || totalMarks <= 0) {
    return Math.max(0, Math.min(100, score ?? 0));
  }

  return Math.max(0, Math.min(100, Math.round(((score ?? 0) / totalMarks) * 100)));
}

function detectTypeLabel(testTitle: string, questionCount: number) {
  const title = testTitle.toLowerCase();
  if (title.includes('sectional') || questionCount <= 30) {
    return 'Sectional';
  }

  return 'Full';
}

export async function fetchTestSeriesOverview(): Promise<TestSeriesOverview> {
  const context = await resolveStudentContext();

  if (!context.student) {
    return {
      readyTests: [],
      recentPerformance: [],
      insight: null,
      stats: null,
    };
  }

  const [enrollmentsResponse, attemptsResponse] = await Promise.all([
    supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', context.student.id),
    supabase
      .from('attempts')
      .select('id, test_id, score, status, submitted_at')
      .eq('student_id', context.student.id)
      .eq('status', 'completed')
      .order('submitted_at', { ascending: false }),
  ]);

  if (enrollmentsResponse.error) {
    throw enrollmentsResponse.error;
  }

  if (attemptsResponse.error) {
    throw attemptsResponse.error;
  }

  const courseIds = ((enrollmentsResponse.data ?? []) as Array<{ course_id: string | null }>)
    .map((enrollment) => enrollment.course_id)
    .filter((courseId): courseId is string => Boolean(courseId));

  if (courseIds.length === 0) {
    return {
      readyTests: [],
      recentPerformance: [],
      insight: null,
      stats: null,
    };
  }

  const [coursesResponse, testsResponse, subjectsResponse] = await Promise.all([
    supabase.from('courses').select('id, title').in('id', courseIds),
    supabase
      .from('tests')
      .select('id, course_id, subject_id, title, duration, total_marks, status, created_at')
      .in('course_id', courseIds)
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('subjects')
      .select('id, course_id, name')
      .in('course_id', courseIds),
  ]);

  if (coursesResponse.error) {
    throw coursesResponse.error;
  }

  if (testsResponse.error) {
    throw testsResponse.error;
  }

  if (subjectsResponse.error) {
    throw subjectsResponse.error;
  }

  const tests = (testsResponse.data as TestRow[] | null) ?? [];
  const courses = (coursesResponse.data as CourseRow[] | null) ?? [];
  const subjects = (subjectsResponse.data as SubjectRow[] | null) ?? [];
  const attempts = (attemptsResponse.data as AttemptRow[] | null) ?? [];

  const testIds = tests.map((test) => test.id);
  const questionsResponse = testIds.length > 0
    ? await supabase.from('questions').select('id, test_id').in('test_id', testIds)
    : { data: [], error: null };

  if (questionsResponse.error) {
    throw questionsResponse.error;
  }

  const questions = (questionsResponse.data as QuestionRow[] | null) ?? [];

  const questionsByTest = new Map<string, number>();
  questions.forEach((question) => {
    if (!question.test_id) {
      return;
    }

    questionsByTest.set(question.test_id, (questionsByTest.get(question.test_id) ?? 0) + 1);
  });

  const courseById = new Map(courses.map((course) => [course.id, course]));
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));

  const completedTestIds = new Set(
    attempts
      .map((attempt) => attempt.test_id)
      .filter((testId): testId is string => Boolean(testId))
  );

  const readyTests = tests.map((test) => {
    const course = test.course_id ? courseById.get(test.course_id) : null;
    const subject = test.subject_id ? subjectById.get(test.subject_id) : null;
    const resolvedSubject = subject && subject.course_id === test.course_id ? subject : null;
    const questionCount = questionsByTest.get(test.id) ?? 0;

    return {
      id: test.id,
      title: test.title,
      courseTitle: course?.title ?? 'Course',
      subjectName: resolvedSubject?.name ?? 'General',
      typeLabel: detectTypeLabel(test.title, questionCount),
      durationLabel: formatDuration(test.duration),
      questionLabel: formatQuestionLabel(questionCount),
      attemptHref: `/dashboard/tests/${test.id}?mode=attempt`,
      analysisHref: `/dashboard/tests/${test.id}`,
    } satisfies ReadyTestItem;
  });

  const recentPerformance = attempts
    .map((attempt) => {
      const test = attempt.test_id ? tests.find((entry) => entry.id === attempt.test_id) : null;
      if (!test) {
        return null;
      }

      const percent = scorePercent(attempt.score, test.total_marks);
      const scoreLabel = test.total_marks ? `${attempt.score ?? 0}/${test.total_marks}` : `${attempt.score ?? 0}`;

      return {
        id: attempt.id,
        title: test.title,
        scoreLabel,
        scorePercent: percent,
        attemptedAtLabel: attempt.submitted_at ? formatRelativeTime(attempt.submitted_at) : 'Recently',
        analysisHref: `/dashboard/tests/${test.id}`,
      } satisfies PerformanceItem;
    })
    .filter((item): item is PerformanceItem => Boolean(item))
    .slice(0, 4);

  const subjectAverages = new Map<string, { total: number; count: number }>();
  attempts.forEach((attempt) => {
    const test = attempt.test_id ? tests.find((entry) => entry.id === attempt.test_id) : null;
    const subject = test?.subject_id ? subjectById.get(test.subject_id) : null;
    if (!test?.subject_id || !subject || subject.course_id !== test.course_id) {
      return;
    }

    const percent = scorePercent(attempt.score, test.total_marks);
    const current = subjectAverages.get(test.subject_id) ?? { total: 0, count: 0 };
    subjectAverages.set(test.subject_id, {
      total: current.total + percent,
      count: current.count + 1,
    });
  });

  const subjectScores = [...subjectAverages.entries()]
    .map(([subjectId, entry]) => {
      const subject = subjectById.get(subjectId);
      if (!subject || entry.count === 0) {
        return null;
      }

      return {
        subjectId,
        subjectName: subject.name,
        average: Math.round(entry.total / entry.count),
      };
    })
    .filter((item): item is { subjectId: string; subjectName: string; average: number } => Boolean(item))
    .sort((left, right) => left.average - right.average);

  let insight: InsightItem | null = null;
  if (subjectScores.length > 0) {
    const weakest = subjectScores[0];
    const strongest = subjectScores[subjectScores.length - 1];

    if (weakest && weakest.average < 80) {
      const weakTest = tests.find((test) => test.subject_id === weakest.subjectId && subjectById.get(test.subject_id ?? '')?.course_id === test.course_id);
      insight = {
        title: `You are weak in ${weakest.subjectName}`,
        description: `Accuracy is ${weakest.average}%. Revisit ${weakest.subjectName} before your next attempt.${strongest && strongest.subjectId !== weakest.subjectId ? ` You are stronger in ${strongest.subjectName} (${strongest.average}%).` : ''}`,
        href: weakTest ? `/dashboard/tests/${weakTest.id}` : '/dashboard/tests',
      };
    } else if (strongest) {
      const strongTest = tests.find((test) => test.subject_id === strongest.subjectId && subjectById.get(test.subject_id ?? '')?.course_id === test.course_id);
      insight = {
        title: `Strong in ${strongest.subjectName}`,
        description: `Accuracy is ${strongest.average}%. Keep the momentum and target harder tests next.`,
        href: strongTest ? `/dashboard/tests/${strongTest.id}` : '/dashboard/tests',
      };
    }
  }

  const scores = attempts
    .map((attempt) => {
      const test = attempt.test_id ? tests.find((entry) => entry.id === attempt.test_id) : null;
      return scorePercent(attempt.score, test?.total_marks ?? null);
    })
    .filter((score) => Number.isFinite(score));

  const testsAttempted = attempts.length;
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  const stats: TestSeriesStats | null = testsAttempted > 0
    ? { testsAttempted, averageScore }
    : null;

  return {
    readyTests: readyTests.filter((test) => !completedTestIds.has(test.id)),
    recentPerformance,
    insight,
    stats,
  };
}

export async function fetchTestDetail(testId: string) {
  const overview = await fetchTestSeriesOverview();
  return overview.readyTests.find((test) => test.id === testId) ?? overview.recentPerformance.find((entry) => entry.id === testId) ?? null;
}