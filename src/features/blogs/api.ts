import { supabase } from '@/lib/supabaseClient';
import { Blog, BlogWithAuthor } from './types';

const BLOG_SELECT_FIELDS = 'id, title, slug, content, excerpt, cover_image, meta_title, meta_description, keywords, status, author_id, created_at, updated_at';

export async function fetchBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_SELECT_FIELDS)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchBlogBySlug(slug: string): Promise<BlogWithAuthor | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_SELECT_FIELDS)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  if (!data?.author_id) {
    return { ...data, author: null };
  }

  const { data: author, error: authorError } = await supabase
    .from('users')
    .select('name, avatar_url')
    .eq('id', data.author_id)
    .maybeSingle();

  if (authorError) {
    return { ...data, author: null };
  }

  return { ...data, author: author || null };
}

export async function fetchRelatedBlogs(currentSlug: string, category: string, limit = 4): Promise<Blog[]> {
  if (!currentSlug) {
    return [];
  }

  const { data, error } = await supabase
    .from('blogs')
    .select(BLOG_SELECT_FIELDS)
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) throw error;

  const normalizedCategory = category.trim().toLowerCase();
  const related = (data || []).filter((blog) => {
    if (!normalizedCategory) {
      return true;
    }

    const blogCategory = (blog.keywords?.[0] || '').toLowerCase();
    return blogCategory === normalizedCategory || blog.keywords?.some((keyword) => keyword.toLowerCase() === normalizedCategory);
  });

  const fallback = (data || []).filter((blog) => !related.some((item) => item.slug === blog.slug));

  return [...related, ...fallback].slice(0, limit);
}
