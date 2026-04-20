export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: any; // jsonb
  excerpt: string | null;
  cover_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[];
  status: 'draft' | 'published';
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogAuthor {
  name: string | null;
  avatar_url: string | null;
}

export interface BlogWithAuthor extends Blog {
  author: BlogAuthor | null;
}
