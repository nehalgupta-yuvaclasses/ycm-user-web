import * as React from 'react';
import { Copy, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlogWithAuthor } from '@/features/blogs/types';

type AuthorSectionProps = {
  blog: BlogWithAuthor;
  onShare: (platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => void;
};

export function AuthorSection({ blog, onShare }: AuthorSectionProps) {
  const authorName = blog.author?.name || 'Yuva Classes';
  const authorInitials = authorName
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Card className="mt-10 border-zinc-200 bg-white shadow-none">
      <CardContent className="flex flex-col gap-6 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
            {blog.author?.avatar_url ? (
              <img src={blog.author.avatar_url} alt={authorName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-xs font-semibold text-zinc-400">{authorInitials || 'YC'}</span>
            )}
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Written by</p>
            <p className="mt-1 text-base font-semibold text-zinc-950">{authorName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => onShare('twitter')} aria-label="Share on Twitter">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onShare('linkedin')} aria-label="Share on LinkedIn">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onShare('facebook')} aria-label="Share on Facebook">
            <Facebook className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onShare('copy')} aria-label="Copy link">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}