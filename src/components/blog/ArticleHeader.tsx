import * as React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BlogWithAuthor } from '@/features/blogs/types';

type ArticleHeaderProps = {
  blog: BlogWithAuthor;
  category: string;
  readTime: number;
};

export function ArticleHeader({ blog, category, readTime }: ArticleHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-[780px]">
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <Badge variant="outline" className="rounded-full border-zinc-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {category}
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium text-zinc-700">{blog.author?.name || 'Yuva Classes'}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </span>
          </div>
        </div>
      </div>

      <Separator className="my-8 bg-zinc-200/80" />

      {blog.cover_image ? (
        <figure className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="h-auto w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </figure>
      ) : null}
    </header>
  );
}