export interface RetentionImage {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

export interface RetentionImageFormData {
  title: string;
  description?: string;
  image_url: string;
  is_active: boolean;
}
