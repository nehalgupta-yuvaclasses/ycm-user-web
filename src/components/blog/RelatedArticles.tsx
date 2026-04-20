import * as React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Blog } from '@/features/blogs/types';

type RelatedArticlesProps = {
  articles: Blog[];
  isLoading?: boolean;
};

export function RelatedArticles({ articles, isLoading }: RelatedArticlesProps) {
  if (isLoading) {
    return (
      <section className="mt-10 space-y-5">
        <div className="h-6 w-40 rounded bg-zinc-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-zinc-200 bg-white shadow-none">
              <div className="aspect-[16/10] bg-zinc-100" />
              <CardContent className="space-y-3 p-4">
                <div className="h-5 w-20 rounded bg-zinc-100" />
                <div className="h-5 w-full rounded bg-zinc-100" />
                <div className="h-5 w-4/5 rounded bg-zinc-100" />
                <div className="h-4 w-24 rounded bg-zinc-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!articles.length) {
    return null;
  }

  return (
    <section className="mt-10 space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Related articles</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">Keep reading</h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 4).map((article) => (
          <Link key={article.slug} to={`/blog/${article.slug}`} className="group block">
            <Card className="overflow-hidden border-zinc-200 bg-white shadow-none transition-colors group-hover:border-zinc-300">
              {article.cover_image ? (
                <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] bg-zinc-100" />
              )}

              <CardContent className="space-y-3 p-4">
                <Badge variant="outline" className="rounded-full border-zinc-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {article.keywords?.[0] || 'General'}
                </Badge>
                <h3 className="line-clamp-2 text-base font-semibold leading-6 text-zinc-950 transition-colors group-hover:text-zinc-700">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Clock className="h-4 w-4" />
                  {getReadTime(article.content)} min read
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

function getReadTime(content: Blog['content']) {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}