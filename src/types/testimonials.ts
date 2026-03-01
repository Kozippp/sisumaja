export type TestimonialType = 'text' | 'image';
export type TestimonialStatus = 'draft' | 'published';

export interface Testimonial {
  id: string;
  created_at: string;
  updated_at: string;
  type: TestimonialType;
  content: string | null;
  author_name: string | null;
  author_role: string | null;
  author_company: string | null;
  image_url: string | null;
  status: TestimonialStatus;
  order: number;
}

export interface TestimonialFormData {
  type: TestimonialType;
  content: string;
  author_name: string;
  author_role: string;
  author_company: string;
  image_url: string;
  status: TestimonialStatus;
}
