import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ReadyTestItem } from '../types';
import { TestItem } from './TestItem';

interface TestListProps {
  tests: ReadyTestItem[];
}

export function TestList({ tests }: TestListProps) {
  if (tests.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">No tests available</p>
            <h2 className="text-base font-medium text-foreground">Explore a new test pack</h2>
          </div>
          <Button nativeButton={false} render={<Link to="/courses" />} className="w-full sm:w-auto">
            Explore Tests
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        {tests.map((test) => (
          <TestItem key={test.id} test={test} />
        ))}
      </CardContent>
    </Card>
  );
}