# WEBNOVA — Digital Marketing & Modern Web Agency

A modern, high-performance web agency platform built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Designed for digital marketing agencies, creative studios, and freelancers to showcase services, display case studies, accept customer consultation bookings, and manage client appointments through a dedicated admin panel.

---

## ✨ Features

- **Hero & Value Proposition**: Engaging interactive hero section with quick CTA routes and trust metrics.
- **Interactive Service Catalog**: Highlighting Web Development, SEO, Performance Marketing, UI/UX, and Branding.
- **Client Portfolio & Case Studies**: Categorized showcase of client projects with live preview modals and performance metrics.
- **Customer Consultation Booking Form**: Multi-step booking form with date/time pickers, service selection, and instant confirmation.
- **Administrative Booking Dashboard**:
  - Review all pending, confirmed, and cancelled appointments.
  - One-click **Confirm Appointment** with automatic WhatsApp confirmation message generator.
  - **Cancel / Reschedule** with custom reason triggers.
  - Filter by date, status, or search by customer name.
- **Client Portal**: Track active project statuses, review past bookings, and request updates.
- **Dark / Light Mode**: Full theme switching with automatic system preference detection and local persistence.
- **Zero Configuration / Standalone**: Built with persistent client storage — runs instantly without any third-party database keys or cloud setups.
- **SEO & PWA Ready**: Includes `robots.txt`, `sitemap.xml`, OpenGraph meta tags, and web app manifest.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```
The compiled, production-ready static files will be generated in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment

The project is pre-configured for instant deployment on all modern static hosting providers:

### Vercel
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Framework preset will automatically detect **Vite**.
3. Click **Deploy**. SPA rewrites are already handled by `vercel.json`.

### Netlify
1. Import your GitHub repository to [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy! SPA routing is pre-configured in `public/_redirects`.

---

## 📁 Project Structure

```
├── public/
│   ├── _redirects         # Netlify SPA redirect rule
│   ├── favicon.svg        # Official agency SVG icon
│   ├── robots.txt         # Search engine crawler directives
│   ├── site.webmanifest   # Mobile web app manifest
│   └── sitemap.xml        # SEO sitemap
├── src/
│   ├── components/        # UI sections & modals
│   │   ├── AdminDashboard.tsx
│   │   ├── CustomerBookingForm.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── ClientPortal.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── services/          # Local database & notification services
│   │   ├── bookingDb.ts
│   │   └── adminEmailService.ts
│   ├── types/             # Shared TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx            # Main application root
│   ├── main.tsx           # React DOM entry point
│   └── index.css          # Tailwind CSS styles
├── package.json           # Dependencies & build scripts
├── tsconfig.json          # TypeScript compiler configuration
├── vercel.json            # Vercel deployment configuration
└── vite.config.ts         # Vite bundler configuration
```

---

## 📄 License
This project is licensed under the MIT License.
