export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  email: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
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

export interface SkillsGrouped {
  category: string;
  skills: Skill[];
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

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  category: string;
  status: string;
  source: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  history?: ChatMessage[];
}

export interface SourceRef {
  source: string;
  similarity: number;
}

export interface ChatResponse {
  response: string;
  lead_intent?: boolean;
  lead_prompt?: string;
  sources?: SourceRef[];
  fallback?: boolean;
}

export interface KnowledgeBaseEntry {
  id: string;
  content: string;
  source: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
