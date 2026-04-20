import { useQuery } from '@tanstack/react-query';
import { fetchBlogs, fetchBlogBySlug, fetchRelatedBlogs } from './api';

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ['blogs', slug],
    queryFn: () => fetchBlogBySlug(slug),
    enabled: !!slug,
  });
}

export function useRelatedBlogs(slug: string, category: string) {
  return useQuery({
    queryKey: ['blogs', 'related', slug, category],
    queryFn: () => fetchRelatedBlogs(slug, category),
    enabled: !!slug,
  });
}
