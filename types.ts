
export interface Program {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  category: string;
}

export interface Founder {
  name: string;
  role: string;
  description: string;
  phone: string;
  image: string;
}

export interface Announcement {
  text: string;
  isActive: boolean;
  type: 'info' | 'urgent' | 'success';
}

export interface Lead {
  id: string;
  programTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'enrolled';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export enum Page {
  Home = 'home',
  Programs = 'programs',
  About = 'about',
  Admin = 'admin',
  PrivacyPolicy = 'privacy-policy',
  Terms = 'terms'
}
