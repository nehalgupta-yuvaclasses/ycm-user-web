import * as React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Link as LinkIcon, Search, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useResources } from '@/features/resources/hooks';
import { ResourceFilters } from '@/features/resources/components/ResourceFilters';
import { ResourceList } from '@/features/resources/components/ResourceList';
import { EmptyState } from '@/features/resources/components/EmptyState';
import type { Resource } from '@/features/resources/types';

type ResourceFilter = 'all' | 'pdf' | 'video' | 'notes';

const QUICK_ACCESS = [
  { label: 'Notes', value: 'notes' as ResourceFilter, icon: BookOpen },
  { label: 'PDFs', value: 'pdf' as ResourceFilter, icon: FileText },
  { label: 'Recorded Lectures', value: 'video' as ResourceFilter, icon: Video },
  { label: 'Important Files', value: 'notes' as ResourceFilter, icon: LinkIcon },
];

function normalizeResourceType(resourceType: Resource['type']): ResourceFilter {
  const type = resourceType.toLowerCase();
  if (type === 'pdf') return 'pdf';
  if (type === 'video' || type === 'link') return 'video';
  return 'notes';
}

function matchesSearch(resource: Resource, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  return (
    resource.title.toLowerCase().includes(needle) ||
    normalizeResourceType(resource.type).toLowerCase().includes(needle)
  );
}

function ResourceSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-11 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  );
}

export default function StudentResources() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState<ResourceFilter>('all');
  const { data: resources, isLoading, isError, refetch } = useResources();

  const filteredResources = React.useMemo(() => {
    const items = resources ?? [];

    return items.filter((resource) => {
      const normalizedType = normalizeResourceType(resource.type);
      const matchesType = filter === 'all' || normalizedType === filter;
      return matchesType && matchesSearch(resource, searchQuery);
    });
  }, [resources, searchQuery, filter]);

  const hasResources = (resources?.length ?? 0) > 0;
  const isEmptyLibrary = !isLoading && !isError && !hasResources;
  const isEmptySearch = !isLoading && !isError && hasResources && filteredResources.length === 0;

  return (
    <div className="space-y-4 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground">All your study materials in one place</p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search title or type"
            className="h-10 pl-9"
            aria-label="Search resources"
          />
        </div>
      </div>

      <section className="space-y-3">
        <p className="text-sm font-medium text-foreground">Quick access</p>
        <div className="flex gap-2 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible">
          {QUICK_ACCESS.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.label}
                variant="outline"
                onClick={() => setFilter(item.value)}
                className="h-11 min-w-36 justify-start gap-2"
              >
                <Icon className="size-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </section>

      <ResourceFilters filter={filter} onFilterChange={setFilter} />

      {isLoading ? (
        <ResourceSkeleton />
      ) : isError ? (
        <EmptyState
          title="Unable to load resources"
          description="Try again in a moment."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      ) : isEmptyLibrary ? (
        <EmptyState
          title="No resources available yet"
          description="Resources will appear once your course starts"
          action={<Button nativeButton={false} render={<Link to="/dashboard/courses" />}>Browse Courses</Button>}
        />
      ) : isEmptySearch ? (
        <EmptyState
          title="No matching resources"
          description="Try a different keyword or switch the filter."
          action={<Button onClick={() => setSearchQuery('')}>Clear Search</Button>}
        />
      ) : (
        <ResourceList resources={filteredResources} />
      )}
    </div>
  );
}

