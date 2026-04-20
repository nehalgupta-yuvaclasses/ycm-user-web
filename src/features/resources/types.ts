export interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  type: 'pdf' | 'video' | 'link' | 'notes' | 'book';
  status: 'active' | 'draft';
  thumbnail_url?: string | null;
  created_at: string;
}
