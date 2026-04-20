import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useBlog, useRelatedBlogs } from '@/features/blogs/hooks';
import { ArticleHeader } from '@/components/blog/ArticleHeader';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { AuthorSection } from '@/components/blog/AuthorSection';
import { RelatedArticles } from '@/components/blog/RelatedArticles';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, isError } = useBlog(slug || '');
  const category = blog?.keywords?.[0] || '';
  const { data: relatedBlogs, isLoading: relatedLoading } = useRelatedBlogs(blog?.slug || '', category);
  const scrollProgress = useScrollProgress();

  React.useEffect(() => {
    if (!blog) {
      return;
    }

    document.title = `${blog.meta_title || blog.title} | Yuva Classes Blog`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', blog.meta_description || blog.excerpt || '');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', blog.title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', blog.meta_description || blog.excerpt || '');
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && blog.cover_image) {
      ogImage.setAttribute('content', blog.cover_image);
    }
  }, [blog]);

  const handleShare = React.useCallback((platform: 'twitter' | 'facebook' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const text = `Check out this article: ${blog?.title || 'Yuva Classes Blog'}`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
      return;
    }

    const shareUrls: Record<'twitter' | 'facebook' | 'linkedin', string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
  }, [blog?.title]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen items-center justify-center px-4">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
        </div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16">
          <Card className="w-full border-zinc-200 bg-white shadow-none">
            <CardContent className="flex flex-col items-center gap-5 px-6 py-10 text-center sm:px-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-400">
                <Loader2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Blog not found</h1>
                <p className="max-w-md text-sm leading-6 text-zinc-500">
                  The article you are trying to open does not exist or could not be loaded.
                </p>
              </div>
              <Link to="/blog" className={cn(buttonVariants({ variant: 'default' }), 'gap-2')}>
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const readTime = getReadTime(blog.content);

  return (
    <div className="min-h-screen bg-background text-zinc-950">
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 origin-left bg-zinc-950"
        initial={{ scaleX: 0 }}
        style={{ scaleX: scrollProgress }}
      />

      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-2 px-0 text-zinc-600 hover:text-zinc-950')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <Button variant="outline" size="sm" onClick={() => handleShare('copy')} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
          <ArticleHeader blog={blog} category={category || 'General'} readTime={readTime} />

          <ArticleContent content={blog.content} highlight={blog.excerpt} />

          <Separator className="bg-zinc-200/80" />

          <AuthorSection blog={blog} onShare={handleShare} />

          <RelatedArticles articles={relatedBlogs || []} isLoading={relatedLoading} />

          <section className="mt-2">
            <Card className="border-zinc-200 bg-zinc-50 shadow-none">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">Continue learning</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                    Continue Your Learning Journey
                  </h2>
                  <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
                    Explore more structured learning content, practical guidance, and exam-ready resources built to keep you moving forward.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/courses" className={cn(buttonVariants({ variant: 'default' }), 'w-full sm:w-auto')}>
                    Explore Courses
                  </Link>
                  <Link to="/blog" className={cn(buttonVariants({ variant: 'outline' }), 'w-full sm:w-auto')}>
                    Read More Articles
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}

function getReadTime(content: unknown) {
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function useScrollProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        setProgress(currentScroll / scrollHeight);
      }
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return progress;
}