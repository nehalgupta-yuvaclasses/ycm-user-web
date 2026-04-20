import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ResourceFilter = 'all' | 'pdf' | 'video' | 'notes';

interface ResourceFiltersProps {
  filter: ResourceFilter;
  onFilterChange: (filter: ResourceFilter) => void;
}

export function ResourceFilters({ filter, onFilterChange }: ResourceFiltersProps) {
  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-foreground">Filters</p>
      <Tabs value={filter} onValueChange={(value) => onFilterChange(value as ResourceFilter)}>
        <div className="overflow-x-auto pb-1">
          <TabsList variant="line" className="w-max gap-1 rounded-none p-0 text-foreground/60">
            <TabsTrigger value="all" className="px-3 py-2 text-sm">All</TabsTrigger>
            <TabsTrigger value="pdf" className="px-3 py-2 text-sm">PDFs</TabsTrigger>
            <TabsTrigger value="video" className="px-3 py-2 text-sm">Videos</TabsTrigger>
            <TabsTrigger value="notes" className="px-3 py-2 text-sm">Notes</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </section>
  );
}