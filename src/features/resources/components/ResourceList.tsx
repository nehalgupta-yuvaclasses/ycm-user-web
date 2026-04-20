import type { Resource } from '@/features/resources/types';
import { ResourceItem } from './ResourceItem';

interface ResourceListProps {
  resources: Resource[];
}

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-foreground">Resource list</p>
      <div className="space-y-3">
        {resources.map((resource) => (
          <ResourceItem key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
}