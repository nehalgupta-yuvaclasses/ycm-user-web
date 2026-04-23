export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  course_id: string | null;
  created_at: string;
}

export interface Achiever {
  id: string;
  name: string;
  score: string;
  exam: string;
  year: string;
  image_url: string | null;
  created_at: string;
}
