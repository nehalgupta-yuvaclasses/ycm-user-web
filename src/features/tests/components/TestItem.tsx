import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ReadyTestItem } from '../types';

interface TestItemProps {
  test: ReadyTestItem;
}

export function TestItem({ test }: TestItemProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50">
            <FileText className="size-4 text-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium text-foreground">{test.title}</h3>
            <p className="text-xs text-muted-foreground">{test.courseTitle} · {test.subjectName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{test.typeLabel}</Badge>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" />
            {test.durationLabel}
          </span>
          <span>{test.questionLabel}</span>
        </div>
      </div>

      <Button nativeButton={false} render={<Link to={test.attemptHref} />} className="w-full sm:w-auto">
        Attempt
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}