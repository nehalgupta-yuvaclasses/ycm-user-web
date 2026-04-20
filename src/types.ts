export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url: string;
  instructor_name: string;
  price: number;
  original_price?: number;
  rating: number;
  students_count: number;
  category: string;
  created_at?: string;
  is_bestseller?: boolean;
  is_new?: boolean;
}

export interface Faculty {
  id: string;
  name: string;
  role: string;
  image: string;
  experience: string;
  specialization: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Selection {
  id: string;
  name: string;
  exam: string;
  rank: string;
  year: string;
  image: string;
}
