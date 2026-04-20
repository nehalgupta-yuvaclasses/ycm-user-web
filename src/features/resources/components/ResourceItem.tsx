import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Download, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Resource } from '@/features/resources/types';

type ResourceFilter = 'pdf' | 'video' | 'notes';

interface ResourceItemProps {
  resource: Resource;
}

function normalizeResourceType(resourceType: Resource['type']): ResourceFilter {
  if (resourceType === 'pdf') return 'pdf';
  if (resourceType === 'video' || resourceType === 'link') return 'video';
  return 'notes';
}

function getResourceLabel(resourceType: Resource['type']) {
  const normalized = normalizeResourceType(resourceType);
  if (normalized === 'pdf') return 'PDF';
  if (normalized === 'video') return 'Video';
  return 'Notes';
}

function getResourceIcon(resourceType: Resource['type']) {
  const normalized = normalizeResourceType(resourceType);
  if (normalized === 'pdf') return FileText;
  if (normalized === 'video') return Video;
  return BookOpen;
}

export function ResourceItem({ resource }: ResourceItemProps) {
  const Icon = getResourceIcon(resource.type);
  const typeLabel = getResourceLabel(resource.type);

  return (
    <Card className="relative overflow-hidden border-border bg-card transition-colors hover:border-foreground/20">
      <Link
        to={`/resources/${resource.id}`}
        aria-label={`Open ${resource.title}`}
        className="absolute inset-0 z-0"
      />

      <CardContent className="relative z-10 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40">
            <Icon className="size-4 text-foreground" />
          </div>

          <div className="min-w-0 space-y-2">
            <div className="space-y-1">
              <h3 className="truncate text-sm font-medium text-foreground">{resource.title}</h3>
              <p className="text-xs text-muted-foreground">
                Added {new Date(resource.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{typeLabel}</Badge>
              <span>{resource.description || 'Study material'}</span>
            </div>
          </div>
        </div>

        <div className="relative z-20 flex flex-col gap-2 sm:min-w-36">
          <Button nativeButton={false} render={<Link to={`/resources/${resource.id}`} />} variant="outline" className="w-full gap-2">
            View
            <ArrowUpRight className="size-4" />
          </Button>
          <Button
            nativeButton={false}
            render={<a href={resource.file_url} target="_blank" rel="noreferrer" />}
            className="w-full gap-2"
          >
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}