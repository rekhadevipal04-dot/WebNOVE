export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  category: 'web-dev' | 'ecommerce' | 'business' | 'maintenance' | 'marketing' | 'seo';
  icon: string;
  description: string;
  features: string[];
  deliverables: string[];
  timeline: string;
  startingPrice: string;
  popular?: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  category: 'E-Commerce' | 'Business' | 'Web Apps' | 'Maintenance' | 'SEO Growth';
  image: string;
  description: string;
  metrics: {
    label: string;
    value: string;
  }[];
  tags: string[];
  liveUrl?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export interface ConsultationBooking {
  id: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  timezone: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  projectBrief: string;
  budgetRange: string;
  meetingLink: string;
  status: 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  avatar: string;
  activeTier: string;
  phone: string;
}

export interface EncryptedDocument {
  id: string;
  name: string;
  category: 'Contract' | 'Invoice' | 'Architecture' | 'SEO Report' | 'Handover' | 'Audit';
  fileSize: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Signature' | 'Paid' | 'Archived';
  encryptionHash: string;
  downloadUrl?: string;
}

export interface HistoricalAuditRecord {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  ipAddress: string;
  status: 'success' | 'flagged' | 'authenticated';
  details: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  isQuickOption?: boolean;
}

export interface AnalyticsData {
  monthlyVisitors: number;
  monthlyVisitorsGrowth: number;
  conversionRate: number;
  conversionRateGrowth: number;
  webVitalsScore: number;
  avgLoadTime: string;
  roasMultiplier: number;
  dailyTraffic: { day: string; visitors: number; leads: number }[];
  trafficSources: { name: string; percentage: number; color: string }[];
  projectMilestones: {
    id: string;
    title: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'upcoming';
    dueDate: string;
  }[];
}
