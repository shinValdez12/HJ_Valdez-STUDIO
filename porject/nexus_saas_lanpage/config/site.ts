export const siteConfig = {
  name: "Nexus",
  tagline: "Ship faster. Scale smarter.",
  description:
    "Nexus is the all-in-one developer platform that lets your team build, deploy, and iterate on modern web applications — without the operational overhead.",
  url: "https://nexus.app",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/nexusapp",
    github: "https://github.com/nexusapp",
  },
}

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export const trustedLogos = [
  { name: "Vercel", width: 80 },
  { name: "Stripe", width: 66 },
  { name: "Linear", width: 72 },
  { name: "Supabase", width: 96 },
  { name: "Resend", width: 76 },
  { name: "Railway", width: 84 },
]

export const features = [
  {
    icon: "Zap",
    title: "Instant Deployments",
    description:
      "Push to production in seconds. Every commit triggers an atomic deployment with zero-downtime rollouts and instant rollbacks.",
  },
  {
    icon: "Shield",
    title: "Built-in Security",
    description:
      "End-to-end encryption, SOC 2 compliance, and automated vulnerability scanning — security baked in from day one.",
  },
  {
    icon: "BarChart3",
    title: "Real-time Analytics",
    description:
      "Understand performance with granular metrics, custom dashboards, and AI-powered anomaly detection.",
  },
  {
    icon: "GitBranch",
    title: "Git-native Workflow",
    description:
      "Branch previews, staging environments, and CI/CD pipelines that feel like a natural extension of your Git workflow.",
  },
  {
    icon: "Globe",
    title: "Global Edge Network",
    description:
      "Deploy to 50+ regions instantly. Sub-50ms latency everywhere with automatic failover and intelligent routing.",
  },
  {
    icon: "Users",
    title: "Team Collaboration",
    description:
      "Share previews, leave comments, and manage access controls — built for teams that move fast together.",
  },
]

export const steps = [
  {
    step: "01",
    title: "Connect your repo",
    description:
      "Link your GitHub, GitLab, or Bitbucket repository in one click. We automatically detect your framework and configure everything.",
  },
  {
    step: "02",
    title: "Configure your pipeline",
    description:
      "Set environment variables, build commands, and deployment rules using our intuitive dashboard or infrastructure-as-code.",
  },
  {
    step: "03",
    title: "Deploy with confidence",
    description:
      "Every push is a preview. Merge to production with full observability, automatic scaling, and instant rollback capability.",
  },
]

export const pricingPlans = [
  {
    name: "Hobby",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for side projects and personal work.",
    cta: "Start for free",
    featured: false,
    features: [
      "3 projects",
      "Unlimited deployments",
      "Community support",
      "Basic analytics",
      "100 GB bandwidth/mo",
    ],
  },
  {
    name: "Pro",
    price: { monthly: 20, annual: 16 },
    description: "For professionals and growing startups.",
    cta: "Get started",
    featured: true,
    badge: "Most popular",
    features: [
      "Unlimited projects",
      "Team collaboration (5 seats)",
      "Priority support",
      "Advanced analytics",
      "1 TB bandwidth/mo",
      "Custom domains",
      "Environment secrets",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: 99, annual: 79 },
    description: "For large teams that need more control.",
    cta: "Contact sales",
    featured: false,
    features: [
      "Everything in Pro",
      "Unlimited seats",
      "Dedicated support SLA",
      "SSO / SAML",
      "Audit logs",
      "Custom contracts",
      "SLA uptime guarantee",
    ],
  },
]

export const testimonials = [
  {
    quote:
      "Nexus cut our deployment time from 45 minutes to under 2. The DX is unmatched — it feels like using the future.",
    author: "Sarah Chen",
    role: "CTO at Luminary",
    avatar: "/avatars/sarah.jpg",
    initials: "SC",
  },
  {
    quote:
      "We migrated 12 services in a weekend. The zero-downtime deploys and branch previews have completely changed how our team ships.",
    author: "Marcus Webb",
    role: "Lead Engineer at Orbit",
    avatar: "/avatars/marcus.jpg",
    initials: "MW",
  },
  {
    quote:
      "Finally a platform that doesn't get in your way. Nexus just works — from local dev to production at scale.",
    author: "Priya Nair",
    role: "Founder at Flowbase",
    avatar: "/avatars/priya.jpg",
    initials: "PN",
  },
  {
    quote:
      "The global edge network is incredible. Our p99 latency dropped by 60% the day we switched. Our users noticed immediately.",
    author: "James Okafor",
    role: "Staff Engineer at Pinnacle",
    avatar: "/avatars/james.jpg",
    initials: "JO",
  },
  {
    quote:
      "Best-in-class team features. Preview URLs for every PR means our designers and PMs can give feedback before anything ships.",
    author: "Elena Vasquez",
    role: "VP Engineering at Helio",
    avatar: "/avatars/elena.jpg",
    initials: "EV",
  },
  {
    quote:
      "We're a 3-person team shipping like a 20-person team. Nexus automates all the infrastructure toil so we focus on product.",
    author: "Tom Brecht",
    role: "Co-founder at Slate",
    avatar: "/avatars/tom.jpg",
    initials: "TB",
  },
]

export const faqs = [
  {
    question: "How does Nexus differ from other deployment platforms?",
    answer:
      "Nexus is purpose-built for modern full-stack applications. Unlike traditional PaaS platforms, we offer true edge deployments, Git-native workflows, and a developer experience designed around speed — with zero cold starts and automatic preview environments for every branch.",
  },
  {
    question: "Can I migrate from my existing platform?",
    answer:
      "Yes. We provide a migration CLI that automatically imports your environment variables, domain configurations, and build settings from Vercel, Netlify, Heroku, and Railway. Most teams complete migration in under an hour.",
  },
  {
    question: "What frameworks and runtimes does Nexus support?",
    answer:
      "Nexus supports all major frameworks including Next.js, Remix, SvelteKit, Nuxt, Astro, and any Node.js, Python, Go, or Rust application. If it runs in a container, it runs on Nexus.",
  },
  {
    question: "Is there a free tier available?",
    answer:
      "Absolutely. Our Hobby plan is free forever with no credit card required. It includes unlimited deployments, 100 GB of bandwidth, and 3 projects — more than enough to build and launch your idea.",
  },
  {
    question: "How does pricing work for teams?",
    answer:
      "Pro includes 5 seats at $20/month. Additional seats are $8/seat/month. Enterprise plans are custom — reach out and we'll build a plan around your team's needs.",
  },
  {
    question: "Do you offer SLA guarantees?",
    answer:
      "Enterprise plans include a 99.99% uptime SLA with dedicated support. Pro plans have a 99.9% uptime commitment. Our status page is publicly available at status.nexus.app.",
  },
]

export const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Developers: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "CLI", href: "#" },
    { label: "Status", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
    { label: "DPA", href: "#" },
  ],
}
