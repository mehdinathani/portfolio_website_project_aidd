export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  email: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url?: string;
  profile_image_url?: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  tech_stack: string[];
  project_url?: string;
  github_url?: string;
  image_url?: string;
  featured: boolean;
  order_index: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_url?: string;
  order_index: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  responsibilities: string;
  order_index: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date_earned: string;
  credential_url?: string;
  order_index: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  author_company?: string;
  quote: string;
  date: string;
  linkedin_url?: string;
  order_index: number;
}
