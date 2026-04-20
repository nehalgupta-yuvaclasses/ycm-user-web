import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock3, FileText, Play, Target } from 'lucide-react';
import { useTestSeriesOverview } from '@/features/tests/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const { data, isLoading, isError } = useTestSeriesOverview();

  const test = data?.readyTests.find((entry) => entry.id === id) ?? data?.recentPerformance.find((entry) => entry.id === id) ?? null;

  if (isLoading) {
    return <div className="space-y-4"><div className="h-40 rounded-lg bg-muted/40" /></div>;
  }

  if (isError || !test) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-3 p-4">
          <p className="text-sm font-medium text-foreground">Test not found</p>
          <Button nativeButton={false} render={<Link to="/dashboard/tests" />} className="w-full sm:w-auto">
            Back to Tests
          </Button>
        </CardContent>
      </Card>
    );
  }

  const readyTest = data?.readyTests.find((entry) => entry.id === id) ?? null;

  return (
    <div className="space-y-4 pb-4">
      <Button nativeButton={false} render={<Link to="/dashboard/tests" />} variant="ghost" className="w-fit gap-2 px-0">
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{readyTest ? 'Ready to Attempt' : 'Analysis'}</Badge>
            {mode === 'attempt' ? <Badge>Attempt mode</Badge> : null}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{readyTest?.title ?? test.title}</h1>
            <p className="text-sm text-muted-foreground">{readyTest?.courseTitle ?? 'Recent performance review'}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {readyTest ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-3.5" />
                  {readyTest.durationLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="size-3.5" />
                  {readyTest.questionLabel}
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Target className="size-3.5" />
                Review your result and plan the next attempt
              </span>
            )}
          </div>

          {readyTest ? (
            <Button nativeButton={false} render={<Link to={readyTest.attemptHref} />} className="w-full sm:w-auto">
              <Play className="size-4" />
              Start Test
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}