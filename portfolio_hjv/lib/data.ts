export interface Project {
  id: string
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  image: string
  category: "web" | "saas" | "native" | "art"
  techStack: string[]
  role: string
  challenges: string
  solution: string
  liveUrl?: string
  githubUrl?: string
  apkUrl?: string
  videoUrl?: string
  featured: boolean
}

export interface Artwork {
  id: string
  title: string
  category: string
  image: string
  year: string
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "hjv-portfolio",
    title: "HJV Portfolio",
    shortDescription: "Modern developer portfolio with smooth animations and premium UI/UX design.",
    fullDescription: "HJV Portfolio is a modern and responsive web portfolio built using Next.js, Tailwind CSS, and Framer Motion. It showcases projects, skills, and digital works with smooth scroll animations, interactive UI elements, and a clean aesthetic design. The goal of this project is to create a high-performance and visually engaging portfolio experience that works seamlessly across all devices.",
    image: "/project/hjv-portfolio.png",
    category: "web",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
    role: "Frontend Developer & UI/UX Designer",
    challenges: "Creating smooth scroll animations while maintaining performance and ensuring responsiveness across different screen sizes.",
    solution: "Used Framer Motion for animation control and optimized layout structure with Tailwind CSS. Implemented responsive design patterns and performance-focused components in Next.js.",
    liveUrl: "https://hjv-studio.vercel.app/",
    githubUrl: "",
    featured: true,
  },
  {
    id: "2",
    slug: "macdotracker",
    title: "Macdotracker",
    shortDescription: "Mobile app for McDonald's crew in the Philippines to track work hours, shifts, and earnings.",
    fullDescription: "Macdotracker is a crew labor tracking app designed to help track daily work hours, monitor overtime, and compute earnings with ease and accuracy.",
    image: "/project/macdotraker-preview.png",
    category: "native",
    techStack: ["React Native", "Expo", "TypeScript", "React"],
    role: "Lead Mobile Developer",
    challenges: "Handling accurate time calculations including overtime, night differential, and flexible schedules while ensuring a smooth and responsive mobile UI.",
    solution: "Built a lightweight and efficient mobile app using React Native and Expo. Implemented real time calculations for work hours and earnings, and designed a clean UI for better usability.",
    apkUrl: "/native/MacdotrackerPH.apk",
    videoUrl: "",
    featured: true,
  },
  {
    id: "3",
    slug: "haven-real-estate",
    title: "Haven Real Estate",
    shortDescription: "Premium real estate website with modern UI, smooth animations, and property search experience.",
    fullDescription: "Haven Real Estate is a modern real estate web application designed for agencies and property businesses. Built with Next.js, Tailwind CSS, and Framer Motion, it features a premium UI/UX with smooth animations, responsive layouts, and an intuitive property search experience. The project focuses on delivering a high-end look suitable for real estate agencies, combining performance, design, and usability.",
    image: "/project/haven-real-estate.png",
    category: "web",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
    role: "Frontend Developer & UI Designer",
    challenges: "Designing a premium-looking interface while keeping performance optimized and ensuring smooth animations across devices.",
    solution: "Used Tailwind CSS for consistent design, Framer Motion for smooth transitions, and optimized layout structure in Next.js for performance and responsiveness.",
    liveUrl: "",
    githubUrl: "",
    featured: true,
  },
  {
    id: "4",
    slug: "nexus-saas",
    title: "Nexus SaaS",
    shortDescription: "Modern SaaS landing page designed for performance, clarity, and high conversion.",
    fullDescription: "Nexus SaaS is a modern developer-focused landing page built to showcase a high-performance platform. It emphasizes speed, scalability, and seamless deployment through a clean UI, smooth animations, and a structured user journey. The design is inspired by leading SaaS platforms, focusing on clarity, engagement, and conversion-driven layout.",
    image: "/project/nexus-saas.png",
    category: "web",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    role: "Frontend Developer & UI Designer",
    challenges: "Designing a visually engaging SaaS interface while maintaining performance and smooth animation flow across devices.",
    solution: "Used Framer Motion for smooth transitions, structured sections for clear user flow, and optimized components in Next.js to ensure fast load times and responsiveness..",
    liveUrl: "https://nexus-sand-ten.vercel.app/",
    featured: false,
  },
  {
    id: "5",
    slug: "shin-dev-portfolio",
    title: "Shin Dev Portfolio",
    shortDescription: "Luxury developer portfolio crafted with Awwwards-inspired UI, smooth animations, and immersive design.",
    fullDescription: "Shin Dev Portfolio is a high end personal portfolio designed with Awwwards-level standards in mind. Built using Next.js, Tailwind CSS, and Framer Motion, it focuses on delivering a luxury UI/UX experience with smooth scroll animations, cinematic transitions, and a strong visual identity. The project showcases advanced frontend techniques, combining design precision with performance to create an immersive and modern web experience.",
    image: "/project/shin-dev-portfolio.png",
    category: "web",
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
    role: "Frontend Developer & UI/UX Designer",
    challenges: "Creating a premium, award-level design while maintaining performance, responsiveness, and smooth animation flow.",
    solution: "Used Framer Motion for advanced animations, structured layouts carefully to avoid scroll issues, and optimized components for performance while maintaining a visually rich experience.",
    liveUrl: "shin-dev-beryl.vercel.app",
    featured: false,
  },
  // {
  //   id: "6",
  //   slug: "flux-commerce",
  //   title: "Flux Commerce",
  //   shortDescription: "Next-generation e-commerce platform",
  //   fullDescription: "Flux is a modern e-commerce solution designed for high-performance and conversion optimization. Features AI product recommendations and seamless checkout.",
  //   image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop",
  //   category: "saas",
  //   techStack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Algolia"],
  //   role: "Technical Lead",
  //   challenges: "Optimizing for conversion while handling high traffic loads during sales events.",
  //   solution: "Implemented edge caching, optimized the checkout funnel with A/B testing, and built a scalable inventory management system.",
  //   liveUrl: "https://flux-commerce.vercel.app",
  //   githubUrl: "https://github.com/hjvaldez/flux",
  //   featured: false,
  // },
]

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Quiet Companion",
    category: "Abstract",
    image: "gallery/Quiet_Companion.jpg",
    year: "2025",
  },
  {
    id: "2",
    title: "Anxiety",
    category: "Digital Art",
    image: "gallery/anxiety.jpg",
    year: "2025",
  },
  {
    id: "3",
    title: "The Memory of Her",
    category: "The Memory of Her",
    image: "gallery/Her_Presence.jpg",
    year: "2026",
  },
  {
    id: "4",
    title: "At Ease",
    category: "2D Art",
    image: "gallery/At_Ease.png",
    year: "2026",
  },
  {
    id: "5",
    title: "Stillness",
    category: "2D Art",
    image: "gallery/Stillness.png",
    year: "2026",
  },
  {
    id: "6",
    title: "Luminous Gaze",
    category: "2D Art",
    image: "gallery/Luminous_Gaze.png",
    year: "2023",
  },
  // {
  //   id: "7",
  //   title: "Void Walker",
  //   category: "Concept Art",
  //   image: "https://images.unsplash.com/photo-1604076913837-52ab5f9e6182?w=700&h=1000&fit=crop",
  //   year: "2024",
  // },
  // {
  //   id: "8",
  //   title: "Data Streams",
  //   category: "Generative",
  //   image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&h=600&fit=crop",
  //   year: "2024",
  // },
]

export const skills = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "React Native", category: "Mobile" },
  { name: "Expo", category: "Mobile" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Supabase", category: "Backend" },
  { name: "Three.js", category: "3D" },
  { name: "Figma", category: "Design" },
]
