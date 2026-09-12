import {
  ServiceItem,
  PortfolioProject,
  BlogPost,
  EncryptedDocument,
  HistoricalAuditRecord,
  AppNotification,
  AnalyticsData,
} from '../types/index.ts';
import { ANAND_PAL_PHOTO_DATA_URL } from './anandPalPhoto.ts';

export const COMPANY_INFO = {
  name: 'WEBNOVA',
  legalName: 'WEBNOVA Technologies & Digital Media LLP',
  tagline: 'Modern Websites. Better Business.',
  subTagline: 'WE BUILD YOUR DIGITAL FUTURE',
  credo: 'YOUR VISION. OUR CODE. YOUR SUCCESS.',
  phone: '9519832055',
  phoneFormatted: '+91 9519832055',
  email: 'hello@webnova.in',
  website: 'www.webnova.in',
  address: 'MUMBAI, MAHARASHTRA 400103',
  fullAddress: 'MUMBAI, MAHARASHTRA 400103, INDIA',
  adminEmail: 'webnova88@gmail.com',
  adminEmailAlt: 'webnova88@gmail.com',
  adminName: 'WEBNOVA OFFICIAL DESK',
  whatsappUrl: 'https://wa.me/919519832055?text=Hello%20WEBNOVA%20team,%20I%20am%20interested%20in%20your%20services.',
  telUrl: 'tel:+919519832055',
  mailUrl: 'mailto:webnova88@gmail.com',
  leadership: [
    {
      name: 'REKHA DEVI PAL',
      role: 'SUPER ADMINISTRATOR & DISPATCH CONTROLLER',
      bio: 'Authoritative administrator managing appointment dispatch, client verification, and executive business operations.',
      initials: 'RP',
    },
    {
      name: 'ANAND PAL',
      role: 'FOUNDER & CEO',
      bio: 'Leading strategic direction, digital growth architectures, and enterprise client partnerships at WEBNOVA.',
      initials: 'AP',
    },
    {
      name: 'SURYAPARTAP PAL',
      role: 'CO-FOUNDER & DIRECTOR',
      bio: 'Directing full-stack web engineering, high-uptime cloud infrastructure, and technical execution.',
      initials: 'SP',
    },
  ],
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'website-development',
    title: 'WEBSITE DEVELOPMENT',
    tagline: 'Custom & Responsive Websites',
    category: 'web-dev',
    icon: 'Code2',
    popular: true,
    description:
      'Engineered from scratch for speed, fluid responsive interactions across all smartphones and desktops, and unmatched user experiences.',
    features: [
      'Tailored UI/UX design matching brand guidelines',
      'Ultra-fast load speed (Sub-second First Contentful Paint)',
      '100% Mobile & Tablet responsiveness',
      'Modern component architectures (React, Next.js, Tailwind)',
      'Full semantic SEO markup and OpenGraph tags',
    ],
    deliverables: [
      'Full source code repository',
      'Interactive Figma prototypes',
      'Production deployment on high-speed CDN',
      'CMS / Admin content control',
    ],
    timeline: '2 - 4 Weeks',
    startingPrice: '₹24,999',
  },
  {
    id: 'ecommerce-websites',
    title: 'E-COMMERCE WEBSITES',
    tagline: 'Online Store. More Sales.',
    category: 'ecommerce',
    icon: 'ShoppingCart',
    popular: true,
    description:
      'High-conversion online storefronts designed to maximize average order value, streamline checkout, and integrate seamless payment gateways.',
    features: [
      'Instant UPI, Credit/Debit card, and NetBanking gateways',
      'Automated abandoned cart recovery workflows',
      'Inventory, coupon codes, and shipping rate calculations',
      'Mobile-first frictionless 1-page checkout',
      'Customer order tracking & automated WhatsApp notifications',
    ],
    deliverables: [
      'Configured multi-currency payment integrations',
      'Product catalog setup (up to 50 initial items)',
      'Sales analytics & conversion tracking dashboard',
      'Staff training session for order handling',
    ],
    timeline: '3 - 5 Weeks',
    startingPrice: '₹39,999',
  },
  {
    id: 'business-websites',
    title: 'BUSINESS WEBSITES',
    tagline: 'Professional & SEO Friendly',
    category: 'business',
    icon: 'TrendingUp',
    description:
      'Establish undeniable authority in your industry. Clean corporate landing pages and corporate portals that convert qualified inbound leads.',
    features: [
      'Targeted lead capture forms & booking integrations',
      'Schema.org structured metadata for Google Rich Snippets',
      'Case study & client testimonial showcase modules',
      'Multi-language & regional content support',
      'Integrated live chat & direct WhatsApp triggers',
    ],
    deliverables: [
      'Corporate design system & typography guidelines',
      'Google Analytics 4 & Search Console setup',
      'Lead auto-routing to company email & CRM',
      'Compliance & privacy policy templates',
    ],
    timeline: '2 - 3 Weeks',
    startingPrice: '₹19,999',
  },
  {
    id: 'website-maintenance',
    title: 'WEBSITE MAINTENANCE',
    tagline: 'Fast, Secure & Reliable Support',
    category: 'maintenance',
    icon: 'Settings',
    popular: true,
    description:
      'Never worry about downtime, broken plugins, or security vulnerabilities. Our dedicated engineering desk keeps your business online 24/7.',
    features: [
      '24/7/365 Uptime monitoring & rapid incident response',
      'Automated daily cloud backups with 1-click restore',
      'Regular security audits, SSL renewals, & firewall patches',
      'Content updates, banner changes, and speed tuning',
      'Monthly technical health & traffic reports',
    ],
    deliverables: [
      'Dedicated Slack / WhatsApp priority response channel',
      'Up to 10 hours monthly developer task requests',
      'Guaranteed < 2-hour emergency response SLA',
      'Staging server for pre-release testing',
    ],
    timeline: 'Ongoing Monthly Support',
    startingPrice: '₹4,999 / mo',
  },
  {
    id: 'seo-organic-growth',
    title: 'SEO & ORGANIC MARKETING',
    tagline: 'Rank #1 on Google. Dominate Search.',
    category: 'seo',
    icon: 'Search',
    description:
      'Comprehensive on-page, off-page, and technical SEO campaigns engineered to outrank local and national competitors.',
    features: [
      'High-intent keyword research & competitor gap analysis',
      'Core Web Vitals optimization (LCP, FID, CLS)',
      'Google Business Profile (Local SEO for Mumbai & pan-India)',
      'Authority backlink acquisition & editorial placements',
    ],
    deliverables: [
      'Keyword rank tracking dashboard',
      'Monthly SEO performance report',
      'Technical SEO audit remediation',
      'Optimized content articles',
    ],
    timeline: '3 - 6 Months Campaigns',
    startingPrice: '₹14,999 / mo',
  },
  {
    id: 'performance-ads',
    title: 'PERFORMANCE MARKETING',
    tagline: 'Laser-Targeted Ads. Maximum ROAS.',
    category: 'marketing',
    icon: 'Target',
    description:
      'Data-driven Meta Ads (Instagram/Facebook) and Google Ads campaigns crafted to generate high-quality inquiries and verified sales.',
    features: [
      'High-converting ad creatives & copywriting',
      'Pixel & Server-Side Conversion API (CAPI) configuration',
      'A/B split testing of hooks, audiences, and offers',
      'Dynamic retargeting funnels for warm visitors',
    ],
    deliverables: [
      'Custom ad creative suite (static + motion banners)',
      'Ad campaign structure and audience segments',
      'Real-time ROAS tracking dashboard',
      'Weekly strategy review calls',
    ],
    timeline: 'Bi-weekly Sprints',
    startingPrice: '₹18,000 / mo',
  },
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'project-1',
    title: 'Aura Luxury Jewels',
    client: 'Aura Fine Jewelry Mumbai',
    category: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    description:
      'A high-end luxury e-commerce experience featuring 360-degree jewelry views, custom ring builders, instant WhatsApp consultation, and secure payment checkout.',
    metrics: [
      { label: 'Online Revenue', value: '+310%' },
      { label: 'Conversion Rate', value: '4.8%' },
      { label: 'Mobile Checkout Speed', value: '1.2s' },
    ],
    tags: ['React', 'Tailwind CSS', 'Razorpay', 'Custom Cart', 'WhatsApp API'],
    liveUrl: 'https://aurajewels.example.com',
    testimonial: {
      quote:
        'WEBNOVA completely overhauled our digital flagship. Our online sales exploded within the first 60 days of launch.',
      author: 'Priya Sharma',
      role: 'Managing Director, Aura Jewels',
    },
  },
  {
    id: 'project-2',
    title: 'Zenith Logistics Global',
    client: 'Zenith Freight & Supply Chain',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Corporate portal with real-time shipment tracking, automated quote calculation, and multi-location client management for an international freight carrier.',
    metrics: [
      { label: 'Inbound RFQ Leads', value: '+185%' },
      { label: 'Bounce Rate', value: '-48%' },
      { label: 'Global Page Speed', value: '0.8s' },
    ],
    tags: ['Next.js', 'API Integration', 'Interactive Calculator', 'SEO Schema'],
    liveUrl: 'https://zenithfreight.example.com',
    testimonial: {
      quote:
        'Anand and Suryapartap built an enterprise-grade platform that has elevated our global credibility with multi-national shipping clients.',
      author: 'Rajiv Malhotra',
      role: 'VP Operations, Zenith Logistics',
    },
  },
  {
    id: 'project-3',
    title: 'ProFit Nutrition Hub',
    client: 'ProFit Wellness India',
    category: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    description:
      'Direct-to-consumer health supplement storefront with subscription delivery models, diet recommendation quiz, and automated SMS/WhatsApp restock reminders.',
    metrics: [
      { label: 'Monthly Active Orders', value: '12,400+' },
      { label: 'Repeat Customer Rate', value: '38%' },
      { label: 'Average Order Value', value: '+42%' },
    ],
    tags: ['E-Commerce', 'Subscription Engine', 'Tailwind', 'Cashfree Gateway'],
    liveUrl: 'https://profitnutrition.example.com',
    testimonial: {
      quote:
        'The recurring subscription system designed by WEBNOVA doubled our predictable revenue stream.',
      author: 'Vikram Kapoor',
      role: 'Founder, ProFit Hub',
    },
  },
  {
    id: 'project-4',
    title: 'MedVeda TeleHealth Clinic',
    client: 'MedVeda Healthcare Network',
    category: 'Web Apps',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Telemedicine appointment booking, encrypted health records management, and instant doctor video call integration with seamless SMS notifications.',
    metrics: [
      { label: 'Appointments Booked', value: '45,000+' },
      { label: 'Patient Satisfaction', value: '98.6%' },
      { label: 'HIPAA & ISO Compliant', value: '100%' },
    ],
    tags: ['Web Application', 'Video API', 'Encrypted DB', 'Consultation Booking'],
    liveUrl: 'https://medveda.example.com',
    testimonial: {
      quote:
        'Our patients love the simple mobile booking flow. No bugs, no confusion, just fast reliable healthcare.',
      author: 'Dr. Arishta Saxena',
      role: 'Chief Medical Officer',
    },
  },
  {
    id: 'project-5',
    title: 'UrbanNest Realty Mumbai',
    client: 'UrbanNest Luxury Estates',
    category: 'SEO Growth',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description:
      'High-converting luxury real estate showcase with interactive map search, 3D walkthrough embeddings, and automated agent WhatsApp routing.',
    metrics: [
      { label: 'High-Ticket Inquiries', value: '+240%' },
      { label: 'Google #1 Rankings', value: '34 Keywords' },
      { label: 'Avg Time on Site', value: '4m 12s' },
    ],
    tags: ['Local SEO', 'Interactive Filters', 'Lead Funnel', 'High Resolution Media'],
    liveUrl: 'https://urbannestrealty.example.com',
  },
  {
    id: 'project-6',
    title: 'FinEdge Advisory Suite',
    client: 'FinEdge Capital Partners',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    description:
      'Modern financial advisory platform with tax calculators, portfolio assessment tools, and client document upload vault.',
    metrics: [
      { label: 'Assets Under Advice', value: '₹120 Cr+' },
      { label: 'Client Retention', value: '99.2%' },
      { label: 'Lead Conversion', value: '+160%' },
    ],
    tags: ['Financial Tech', 'Document Vault', 'Calculators', 'Cybersecurity'],
    liveUrl: 'https://finedgecapital.example.com',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Why Slow Websites Are Silently Killing Your Sales in 2026',
    slug: 'speed-conversions-web-vitals-2026',
    excerpt:
      'Every 100ms of extra load time reduces e-commerce conversion rates by 7%. Discover how modern Jamstack and edge caching reverse the decline.',
    category: 'Web Performance',
    content: `
In 2026, user patience has hit an all-time low. If your business website takes longer than 1.8 seconds to render its primary interactive elements, more than 53% of mobile visitors will bounce before seeing your value proposition.

### 1. The Core Web Vitals Revolution
Google has hardened its search ranking algorithm around three key metrics:
- **LCP (Largest Contentful Paint)**: Must be under 1.5 seconds.
- **INP (Interaction to Next Paint)**: Replacing FID to measure responsiveness.
- **CLS (Cumulative Layout Shift)**: Must be under 0.05 to prevent jittery content.

### 2. Architectural Mistakes Common in Legacy Websites
Many businesses in Mumbai and across India still host bloated, outdated templates loaded with 40+ third-party WordPress plugins. Each plugin injects render-blocking CSS and unminified JavaScript.

At **WEBNOVA**, our engineers craft lean, serverless-ready architectures utilizing React, modern Tailwind CSS, and optimized static asset delivery via ultra-low-latency CDN nodes.

### 3. Immediate Action Items
- Audit your site using Google PageSpeed Insights.
- Convert all media to next-generation AVIF/WebP formats.
- Offload non-critical trackers into deferred web workers.
    `,
    author: {
      name: 'Anand Pal',
      role: 'Founder & CEO',
      avatar: ANAND_PAL_PHOTO_DATA_URL,
    },
    publishedAt: 'Sep 4, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: ['Web Development', 'Core Web Vitals', 'Conversion Rate', 'Architecture'],
  },
  {
    id: 'blog-2',
    title: 'The 2026 Blueprint for High-Conversion E-Commerce in India',
    slug: 'high-conversion-ecommerce-blueprint',
    excerpt:
      'From 1-click UPI checkout to WhatsApp order confirmations, here is how leading Indian direct-to-consumer brands outpace competitors.',
    category: 'E-Commerce Growth',
    content: `
India's digital commerce space is undergoing a seismic transformation. With over 850 million connected smartphone users, the standard desktop e-commerce mindset is officially obsolete.

### 1. The UPI Revolution & Frictionless 1-Page Checkout
Multi-step checkout forms asking for redundant billing addresses cause up to 68% cart abandonment. Modern stores implemented by **WEBNOVA** leverage direct UPI intent flows, allowing customers to complete payment in less than 15 seconds through PhonePe, Google Pay, or Paytm.

### 2. WhatsApp as a Primary Customer Channel
Integrating automated WhatsApp notifications for:
- Abandoned cart recovery with exclusive 5-minute discount prompts
- Real-time shipping dispatch and delivery updates
- Instant customer support handoff
Brings open rates above 94% compared to traditional email's 18%.

### 3. Building Trust Through Speed & Social Proof
Prominently display verified customer reviews with photos, clear return policies, and transparent COD verification.
    `,
    author: {
      name: 'Suryapartap Pal',
      role: 'Co-Founder & Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    publishedAt: 'Aug 28, 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=80',
    tags: ['E-Commerce', 'UPI Payments', 'WhatsApp Marketing', 'Sales Funnel'],
  },
  {
    id: 'blog-3',
    title: 'Why Continuous Website Maintenance Is Essential For Brand Security',
    slug: 'website-maintenance-security-guide',
    excerpt:
      'A website is not a one-time product; it is a living digital asset. Discover how automated patch management prevents disastrous hacks.',
    category: 'Security & DevOps',
    content: `
Many business owners assume that once a website is launched, their investment is finished. In reality, modern web technologies evolve weekly. Browsers update security protocols, APIs depreciate, and automated bot scrapers seek out unpatched exploits.

### What Happens Without Regular Maintenance?
1. **Downtime Losses**: Even 2 hours of downtime during a marketing campaign can waste thousands of rupees in paid ad spend.
2. **Broken Forms**: Form plugins frequently fail after backend library updates, silently losing prospective high-value leads.
3. **Blacklisting by Google**: Compromised sites displaying malicious redirects get flagged with a red warning screen, instantly wrecking years of search authority.

### The WEBNOVA Maintenance Guarantee
Our continuous maintenance programs provide:
- 24/7 automated ping monitors checking your site every 60 seconds
- Offsite encrypted backups stored across redundant cloud regions
- Routine speed auditing and script minification
    `,
    author: {
      name: 'Suryapartap Pal',
      role: 'Co-Founder & Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    publishedAt: 'Aug 15, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Maintenance', 'Cybersecurity', 'Cloud Uptime', 'Best Practices'],
  },
  {
    id: 'blog-4',
    title: 'Dominating Local Search: How Mumbai Businesses Rank #1 on Maps',
    slug: 'local-seo-mumbai-strategy',
    excerpt:
      'Learn how geo-tagged schema markup, localized content hubs, and Google Business Profile optimization drive qualified foot traffic and calls.',
    category: 'SEO & Marketing',
    content: `
For retail outlets, clinics, luxury real estate, and professional consultancies in Mumbai, "near me" searches generate the highest buyer intent.

### Local SEO Multipliers:
- Complete Google Business Profile attributes including products, working hours, and high-res imagery.
- Localized landing pages targeting specific business districts: BKC, Andheri, South Mumbai, Powai, and Navi Mumbai.
- Dynamic review generation sequences sent to delighted customers within 2 hours of service delivery.
    `,
    author: {
      name: 'Anand Pal',
      role: 'Founder & CEO',
      avatar: ANAND_PAL_PHOTO_DATA_URL,
    },
    publishedAt: 'Jul 29, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    tags: ['Local SEO', 'Google Maps', 'Mumbai Business', 'Organic Growth'],
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Consultation Calendar Open',
    message: 'New consultation slots opened for this week with Anand & Suryapartap Pal.',
    type: 'info',
    timestamp: '10 mins ago',
    read: false,
    actionLabel: 'Book Now',
    actionUrl: '#booking',
  },
  {
    id: 'notif-2',
    title: 'Security Audit Verified',
    message: 'Encrypted Document Vault passed automated AES-256 integrity inspection.',
    type: 'success',
    timestamp: '2 hours ago',
    read: false,
    actionLabel: 'View Vault',
    actionUrl: '#portal',
  },
  {
    id: 'notif-3',
    title: 'New Service Package: Rapid SEO',
    message: 'Check out our newly updated SEO & Organic Marketing blueprint for Q4 growth.',
    type: 'info',
    timestamp: '1 day ago',
    read: true,
    actionLabel: 'Explore Services',
    actionUrl: '#services',
  },
  {
    id: 'notif-4',
    title: 'System Performance Peak',
    message: 'Global CDN edge latency verified at 18ms across India & South Asia.',
    type: 'success',
    timestamp: '2 days ago',
    read: true,
  },
];

export const INITIAL_DOCUMENTS: EncryptedDocument[] = [
  {
    id: 'doc-1',
    name: 'Master-Service-Agreement-WEBNOVA-2026.pdf',
    category: 'Contract',
    fileSize: '2.4 MB',
    uploadedAt: 'Sep 01, 2026',
    status: 'Verified',
    encryptionHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'doc-2',
    name: 'Invoice-INV-WN-8821-Paid.pdf',
    category: 'Invoice',
    fileSize: '480 KB',
    uploadedAt: 'Aug 28, 2026',
    status: 'Paid',
    encryptionHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
  },
  {
    id: 'doc-3',
    name: 'Technical-Architecture-Blueprint-v2.pdf',
    category: 'Architecture',
    fileSize: '5.1 MB',
    uploadedAt: 'Aug 20, 2026',
    status: 'Verified',
    encryptionHash: 'ca978112ca1bbdcafac231b39a23dc4da7860814416067b3858601db64e52f',
  },
  {
    id: 'doc-4',
    name: 'SEO-Keyword-Audit-&-Competitor-Report.pdf',
    category: 'SEO Report',
    fileSize: '3.8 MB',
    uploadedAt: 'Aug 14, 2026',
    status: 'Verified',
    encryptionHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
  },
  {
    id: 'doc-5',
    name: 'Cybersecurity-SSL-Audit-Signoff.pdf',
    category: 'Audit',
    fileSize: '1.2 MB',
    uploadedAt: 'Aug 02, 2026',
    status: 'Verified',
    encryptionHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
  },
];

export const INITIAL_AUDIT_LOGS: HistoricalAuditRecord[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-09 09:42:15 UTC',
    action: 'Encrypted Document Vault Accessed',
    actor: 'Client Session #WN-9921',
    ipAddress: '157.34.122.84 (Mumbai, IN)',
    status: 'authenticated',
    details: 'Decrypted file hash check verified (AES-256-GCM)',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-08 16:20:02 UTC',
    action: 'Consultation Booking Scheduled',
    actor: 'Lead Portal (Web Form)',
    ipAddress: '103.212.156.12 (Delhi, IN)',
    status: 'success',
    details: 'Initial Consultation confirmed with Google Meet dispatch',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-07 11:05:40 UTC',
    action: 'Invoice Settlement Acknowledged',
    actor: 'Payment Gateway Webhook',
    ipAddress: '52.76.12.19 (Razorpay Secure)',
    status: 'success',
    details: 'Payment receipt generated for INV-WN-8821',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-05 14:12:33 UTC',
    action: 'Two-Factor Token Verification',
    actor: 'Client Auth Service',
    ipAddress: '157.34.122.84 (Mumbai, IN)',
    status: 'authenticated',
    details: 'Client session authorized with bearer token',
  },
];

export const ANALYTICS_SAMPLE_DATA: AnalyticsData = {
  monthlyVisitors: 148200,
  monthlyVisitorsGrowth: 28.4,
  conversionRate: 4.65,
  conversionRateGrowth: 18.2,
  webVitalsScore: 99,
  avgLoadTime: '0.78s',
  roasMultiplier: 4.3,
  dailyTraffic: [
    { day: 'Day 1', visitors: 3400, leads: 112 },
    { day: 'Day 5', visitors: 4200, leads: 145 },
    { day: 'Day 10', visitors: 4800, leads: 178 },
    { day: 'Day 15', visitors: 5100, leads: 210 },
    { day: 'Day 20', visitors: 5800, leads: 265 },
    { day: 'Day 25', visitors: 6400, leads: 310 },
    { day: 'Day 30', visitors: 7100, leads: 342 },
  ],
  trafficSources: [
    { name: 'Organic Search (SEO)', percentage: 46, color: '#2563EB' },
    { name: 'Performance Ads (Meta/Google)', percentage: 28, color: '#38BDF8' },
    { name: 'Direct & Brand Referrals', percentage: 16, color: '#6366F1' },
    { name: 'Social & WhatsApp Sharing', percentage: 10, color: '#10B981' },
  ],
  projectMilestones: [
    {
      id: 'm-1',
      title: 'UI/UX Interactive Prototypes & Wireframing',
      progress: 100,
      status: 'completed',
      dueDate: 'Completed',
    },
    {
      id: 'm-2',
      title: 'Frontend Architecture & Responsive Views',
      progress: 100,
      status: 'completed',
      dueDate: 'Completed',
    },
    {
      id: 'm-3',
      title: 'Automated Booking & Live Chat Integration',
      progress: 95,
      status: 'in-progress',
      dueDate: 'Today',
    },
    {
      id: 'm-4',
      title: 'Client Vault & Performance Analytics Deployment',
      progress: 90,
      status: 'in-progress',
      dueDate: 'Today',
    },
    {
      id: 'm-5',
      title: 'Final Security Hardening & DNS Cutover',
      progress: 60,
      status: 'upcoming',
      dueDate: 'Tomorrow',
    },
  ],
};
