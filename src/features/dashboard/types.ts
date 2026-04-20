export interface DashboardIdentity {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
  location: string | null;
}

export interface DashboardCourseItem {
  id: string;
  title: string;
  instructor: string;
  description: string | null;
  thumbnailUrl: string | null;
  progress: number;
  totalTests: number;
  attemptedTests: number;
  lastAccessedAt: string;
  lastAccessedLabel: string;
  lastLessonTitle: string | null;
  lastLessonId: string | null;
  href: string;
}

export interface DashboardPerformance {
  testsAttempted: number;
  averageScore: number;
  improvement: number;
  bestScore: number;
}

export interface DashboardScheduleItem {
  id: string;
  title: string;
  courseTitle: string;
  courseId: string;
  timeLabel: string;
  type: 'live' | 'recorded';
  href: string;
}

export interface DashboardOverview {
  user: DashboardIdentity;
  continueLearning: DashboardCourseItem | null;
  courses: DashboardCourseItem[];
  performance: DashboardPerformance;
  schedule: DashboardScheduleItem[];
}