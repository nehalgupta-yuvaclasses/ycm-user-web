export interface ReadyTestItem {
  id: string;
  title: string;
  courseTitle: string;
  subjectName: string;
  typeLabel: 'Full' | 'Sectional';
  durationLabel: string;
  questionLabel: string;
  attemptHref: string;
  analysisHref: string;
}

export interface PerformanceItem {
  id: string;
  title: string;
  scoreLabel: string;
  scorePercent: number;
  attemptedAtLabel: string;
  analysisHref: string;
}

export interface InsightItem {
  title: string;
  description: string;
  href: string;
}

export interface TestSeriesStats {
  testsAttempted: number;
  averageScore: number;
}

export interface TestSeriesOverview {
  readyTests: ReadyTestItem[];
  recentPerformance: PerformanceItem[];
  insight: InsightItem | null;
  stats: TestSeriesStats | null;
}