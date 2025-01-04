export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: {
    sections: Array<{
      title?: string;
      content: string;
    }>;
  };
  meta_title: string;
  meta_description: string;
  keywords: string[];
  image_url?: string;
  template_type: 'basic' | 'hero';
  is_published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}