import { Link } from 'react-router-dom';
import { BookOpen, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  actions: Array<{ label: string; href: string }>;
}

const ICONS = [Video, FileText, BookOpen];

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="space-y-3">
      <p className="text-sm font-medium text-foreground">Quick actions</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {actions.map((action, index) => {
          const Icon = ICONS[index] ?? BookOpen;

          return (
            <Button
              key={action.label}
              variant="outline"
              nativeButton={false}
              render={<Link to={action.href} />}
              className="h-11 w-full justify-start gap-2"
            >
              <Icon className="size-4" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
