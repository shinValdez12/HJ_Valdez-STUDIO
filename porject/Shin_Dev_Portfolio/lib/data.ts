export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  role: string;
  tech: string[];
  category: string;
  color: string;
  image: string;
  heroImage: string;
  gallery: string[];
  overview: string;
  challenge: string;
  solution: string;
  features: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "lumina-design-system",
    title: "Lumina",
    subtitle: "Design System & Component Library",
    description: "A comprehensive design system built for scale — tokens, components, and patterns that power 40+ products.",
    year: "2024",
    role: "Lead Designer & Developer",
    tech: ["React", "TypeScript", "Storybook", "Figma", "Radix UI"],
    category: "Design System",
    color: "#6366f1",
    image: "/images/projects/lumina-cover.jpg",
    heroImage: "/images/projects/lumina-hero.jpg",
    gallery: [
      "/images/projects/lumina-1.jpg",
      "/images/projects/lumina-2.jpg",
      "/images/projects/lumina-3.jpg",
    ],
    overview: "Lumina is an enterprise-grade design system that bridges the gap between design and engineering. Built with accessibility-first principles, it powers 40+ products across the platform.",
    challenge: "The engineering team was drowning in inconsistency — 7 different button styles, 12 shades of gray, and zero documentation. Every team had their own approach, making coherence impossible.",
    solution: "We established a token-based architecture with clear semantic naming. Components were built in isolation using Storybook, with automated visual regression testing to prevent drift.",
    features: [
      "120+ production-ready components",
      "Full dark/light mode support",
      "WCAG 2.1 AA compliant",
      "Automated visual regression testing",
      "Live documentation with code examples",
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: "2",
    slug: "nova-dashboard",
    title: "Nova",
    subtitle: "Analytics Dashboard Platform",
    description: "Real-time analytics platform with cinematic data visualizations and intelligent anomaly detection.",
    year: "2024",
    role: "Frontend Engineer",
    tech: ["Next.js", "D3.js", "WebSockets", "PostgreSQL", "Tailwind"],
    category: "Web App",
    color: "#10b981",
    image: "/images/projects/nova-cover.jpg",
    heroImage: "/images/projects/nova-hero.jpg",
    gallery: [
      "/images/projects/nova-1.jpg",
      "/images/projects/nova-2.jpg",
    ],
    overview: "Nova transforms raw data streams into actionable intelligence. The platform handles 10M+ events per day, surfacing critical patterns through beautiful, performant visualizations.",
    challenge: "Rendering thousands of data points in real-time without sacrificing frame rate was the core challenge. Traditional chart libraries couldn't handle the throughput.",
    solution: "Built a custom WebGL rendering layer with D3 for calculations. Implemented a virtual canvas approach that only re-renders changed regions, achieving consistent 60fps even with dense datasets.",
    features: [
      "Real-time data streaming via WebSockets",
      "Custom WebGL chart rendering engine",
      "Intelligent anomaly detection with ML",
      "Multi-tenant architecture",
      "Export to PDF / CSV / PNG",
    ],
    liveUrl: "https://example.com",
  },
  {
    id: "3",
    slug: "drift-mobile-app",
    title: "Drift",
    subtitle: "Mindful Focus Mobile App",
    description: "A beautifully crafted focus & flow-state application for deep work sessions with ambient soundscapes.",
    year: "2023",
    role: "Product Designer & React Native Developer",
    tech: ["React Native", "Expo", "Reanimated", "Skia", "Supabase"],
    category: "Mobile App",
    color: "#f59e0b",
    image: "/images/projects/drift-cover.jpg",
    heroImage: "/images/projects/drift-hero.jpg",
    gallery: [
      "/images/projects/drift-1.jpg",
      "/images/projects/drift-2.jpg",
    ],
    overview: "Drift helps knowledge workers achieve deep focus through carefully curated ambient environments and non-disruptive session management. 50,000+ downloads in its first month.",
    challenge: "Most focus apps feel clinical and anxiety-inducing. The challenge was creating something that felt genuinely calming and beautiful, while still being functional enough to replace existing workflows.",
    solution: "We obsessed over the tactile feel of every interaction — spring physics on every gesture, breathing animations tied to the system clock, and generative ambient art using React Native Skia.",
    features: [
      "Generative ambient visuals with Skia",
      "Pomodoro + custom session modes",
      "20+ curated soundscapes",
      "Apple Health & Google Fit integration",
      "Streak tracking and achievements",
    ],
    githubUrl: "https://github.com",
  },
  {
    id: "4",
    slug: "arc-ecommerce",
    title: "Arc",
    subtitle: "Next-Gen E-Commerce Experience",
    description: "A reimagined retail experience with AI-powered product discovery and cinematic product presentations.",
    year: "2023",
    role: "Creative Developer",
    tech: ["Next.js", "Shopify", "Framer Motion", "OpenAI", "Stripe"],
    category: "E-Commerce",
    color: "#ef4444",
    image: "/images/projects/arc-cover.jpg",
    heroImage: "/images/projects/arc-hero.jpg",
    gallery: [
      "/images/projects/arc-1.jpg",
      "/images/projects/arc-2.jpg",
    ],
    overview: "Arc reimagines the online shopping experience, turning product discovery into an editorial journey. AI-curated collections, cinema-inspired product pages, and frictionless checkout drove a 3.2x conversion uplift.",
    challenge: "The client's existing store had an 87% bounce rate on product pages. Customers were overwhelmed by choice and underwhelmed by presentation.",
    solution: "Rebuilt the product page as a cinematic experience — large-format imagery, micro-story copy, and AI-recommended complementary pieces. The cart became a curated lookbook.",
    features: [
      "AI-powered product recommendations",
      "Editorial-style product pages",
      "3D product viewer with model-loading",
      "One-click checkout with Stripe",
      "Real-time inventory with Shopify",
    ],
    liveUrl: "https://example.com",
  },
  {
    id: "5",
    slug: "void-creative-tools",
    title: "Void",
    subtitle: "Generative Art & Creative Suite",
    description: "Browser-based creative tools for generative artists — parametric systems, noise fields, and exportable SVGs.",
    year: "2023",
    role: "Creative Developer",
    tech: ["SvelteKit", "WebGL", "WASM", "Canvas API", "Rust"],
    category: "Creative Tool",
    color: "#8b5cf6",
    image: "/images/projects/void-cover.jpg",
    heroImage: "/images/projects/void-hero.jpg",
    gallery: [
      "/images/projects/void-1.jpg",
    ],
    overview: "Void is a browser-native creative suite for generative artists. Powered by a Rust/WASM computation core and WebGL renderer, it can handle millions of particles at interactive framerates.",
    challenge: "JavaScript alone couldn't handle the computational demands of real-time generative art at the resolution and complexity artists demanded. We needed near-native performance in a browser.",
    solution: "Compiled performance-critical algorithms to WebAssembly with Rust. Built a custom WebGL renderer that batches draw calls aggressively. The result feels desktop-native in a browser tab.",
    features: [
      "WASM-powered computation engine",
      "Real-time WebGL rendering at 60fps",
      "Parametric noise field systems",
      "SVG and PNG export at print resolution",
      "Shareable URL-encoded artwork state",
    ],
    githubUrl: "https://github.com",
  },
  {
    id: "6",
    slug: "pulse-social-platform",
    title: "Pulse",
    subtitle: "Community Social Platform",
    description: "An intimate social platform focused on authentic conversation and meaningful connections.",
    year: "2022",
    role: "Full-Stack Developer",
    tech: ["Next.js", "tRPC", "Prisma", "PostgreSQL", "Cloudflare"],
    category: "Social Platform",
    color: "#06b6d4",
    image: "/images/projects/pulse-cover.jpg",
    heroImage: "/images/projects/pulse-hero.jpg",
    gallery: [
      "/images/projects/pulse-1.jpg",
    ],
    overview: "Pulse is an intimate social platform that prioritizes depth of connection over breadth. Anti-algorithmic by design, it surfaces posts chronologically and limits feeds to genuine relationships.",
    challenge: "Building a social platform that feels different from the giants — less anxiety-inducing, more human — while still delivering the real-time features users expect.",
    solution: "End-to-end type safety with tRPC made iteration incredibly fast. Real-time updates via optimistic UI patterns made the experience feel instant without complex WebSocket management.",
    features: [
      "Chronological, algorithm-free feed",
      "End-to-end encrypted DMs",
      "Ephemeral posts that expire after 48h",
      "Granular notification controls",
      "Import and export your entire data",
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
];

export interface GalleryItem {
  id: string;
  title: string;
  medium: string;
  year: string;
  image: string;
  color: string;
}

export const galleryItems: GalleryItem[] = [
  { id: "1", title: "Chromatic Drift #001", medium: "Generative / p5.js", year: "2024", image: "/images/gallery/g1.jpg", color: "#6366f1" },
  { id: "2", title: "Void Study III", medium: "Digital Painting", year: "2024", image: "/images/gallery/g2.jpg", color: "#10b981" },
  { id: "3", title: "Signal Noise", medium: "Generative / WebGL", year: "2023", image: "/images/gallery/g3.jpg", color: "#f59e0b" },
  { id: "4", title: "Liminal Space", medium: "Photography + Edit", year: "2023", image: "/images/gallery/g4.jpg", color: "#ef4444" },
  { id: "5", title: "Frequency Field", medium: "Generative / Canvas", year: "2023", image: "/images/gallery/g5.jpg", color: "#8b5cf6" },
  { id: "6", title: "Monolith", medium: "3D / Blender", year: "2022", image: "/images/gallery/g6.jpg", color: "#06b6d4" },
];

export const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Framer Motion", "WebGL", "CSS/Tailwind"] },
  { category: "Design", items: ["Figma", "Design Systems", "Motion Design", "Brand Identity", "Typography", "UX Research"] },
  { category: "Backend", items: ["Node.js", "tRPC", "PostgreSQL", "Prisma", "Supabase", "Edge Runtime"] },
  { category: "Creative", items: ["Generative Art", "p5.js", "WebAssembly", "Rust", "GLSL Shaders", "Blender"] },
];

export const experience = [
  {
    role: "Senior Creative Developer",
    company: "Studio Meridian",
    period: "2023 — Present",
    description: "Lead developer on award-winning interactive experiences for global brands. Spearheaded adoption of Web Animations API and Framer Motion across the studio.",
  },
  {
    role: "Frontend Engineer",
    company: "Vercel",
    period: "2022 — 2023",
    description: "Built core features for the Vercel dashboard. Improved Time-to-Interactive by 40% through code splitting and edge rendering strategies.",
  },
  {
    role: "UI Engineer",
    company: "Linear",
    period: "2021 — 2022",
    description: "Designed and developed the mobile application from the ground up. Shipped performance improvements reducing app cold-start time by 60%.",
  },
  {
    role: "Creative Developer",
    company: "Freelance",
    period: "2019 — 2021",
    description: "Independent consultancy focused on motion-rich web experiences for startups and creative agencies. 20+ projects shipped.",
  },
];
