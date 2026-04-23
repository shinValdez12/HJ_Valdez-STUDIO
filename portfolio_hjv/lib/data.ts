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
  iosUrl?: string
  videoUrl?: string
  featured: boolean
  platforms?: ("android" | "ios" | "web")[]
  screenshots?: string[]
}

export interface Artwork {
  id: string
  title: string
  category: string
  image: string
  year: string
}

export interface Experiment {
  id: string
  slug: string
  title: string
  description: string
  category: "motion" | "interaction" | "generative"
  image: string
  techStack: string[]
  demoType: "interactive" | "video" | "embed"
  featured: boolean
}

export interface Contact {
  email: string
  github: string
  linkedin: string
  instagram: string
}
export const contact: Contact = {
  email: "hashimjaharadvaldez@gmail.com",
  github: "https://github.com/shinValdez12",
  linkedin: "https://www.linkedin.com/in/hashim-jahara-d-valdez-245a20374/",
  instagram: "https://www.gram.com/hjvadlez/?hl=en",
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
    platforms: ["web"],
    screenshots: [
      "/project/project-image/hjv-portfolio1.png",
      "/project/project-image/hjv-portfolio2.png",
      "/project/project-image/hjv-portfolio3.png",
    ],
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
    iosUrl: "coming-soon",
    videoUrl: "",
    featured: true,
    platforms: ["android", "ios"],
    screenshots: [
      "/project/project-image/macdotracker1.png",
      "/project/project-image/macdotracker2.png",
      "/project/project-image/macdotracker3.png",
    ],
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
    platforms: ["web"],
    screenshots: [
      "/project/project-image/haven-real-estate-1.png",
      "/project/project-image/haven-real-estate-2.png",
      "/project/project-image/haven-real-estate-3.png",
    ],
  },
  {
    id: "4",
    slug: "nexus-saas",
    title: "Nexus SaaS",
    shortDescription: "Modern SaaS landing page designed for performance, clarity, and high conversion.",
    fullDescription: "Nexus SaaS is a modern developer-focused landing page built to showcase a high-performance platform. It emphasizes speed, scalability, and seamless deployment through a clean UI, smooth animations, and a structured user journey. The design is inspired by leading SaaS platforms, focusing on clarity, engagement, and conversion-driven layout.",
    image: "/project/nexus-saas.png",
    category: "saas",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    role: "Frontend Developer & UI Designer",
    challenges: "Designing a visually engaging SaaS interface while maintaining performance and smooth animation flow across devices.",
    solution: "Used Framer Motion for smooth transitions, structured sections for clear user flow, and optimized components in Next.js to ensure fast load times and responsiveness..",
    liveUrl: "https://nexus-sand-ten.vercel.app/",
    featured: false,
    platforms: ["web"],
    screenshots: [
      "/project/project-image/nexus-saas-1.png",
      "/project/project-image/nexus-saas-2.png",
    ],
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
    platforms: ["web"],
    screenshots: [
      "/project/project-image/shin-dev-portfolio-1.png",
      "/project/project-image/shin-dev-portfolio-2.png",
      "/project/project-image/shin-dev-portfolio-3.png",
    ],
  },
]

export const artworks: Artwork[] = [
 {
    id: "1",
    title: "Quiet Companion",
    category: "2D Art",
    image: "gallery/Quiet_Companion.jpg",
    year: "2025",
  },
  {
    id: "2",
    title: "Anxiety",
    category: "2D Art",
    image: "gallery/anxiety.jpg",
    year: "2025",
  },
  {
    id: "3",
    title: "The Memory of Her",
    category: "2D Art",
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
]

export const experiments: Experiment[] = [
  {
    id: "1",
    slug: "particle-flow",
    title: "Particle Flow",
    description: "Interactive particle system that responds to mouse movement and creates organic flowing patterns.",
    category: "generative",
    image: "/video/Particle_Flow.mp4",
    techStack: ["Three.js", "GLSL", "React Three Fiber"],
    demoType: "interactive",
    featured: true,
  },
  {
    id: "2",
    slug: "magnetic-cursor",
    title: "Magnetic Cursor",
    description: "Elements that are attracted to and repelled by cursor movement with physics simulation.",
    category: "interaction",
    image: "/video/magnetic-cursor.mp4",
    techStack: ["Framer Motion", "React", "Physics Engine"],
    demoType: "interactive",
    featured: false,
  },
  // {
  //   id: "5",
  //   slug: "scroll-distortion",
  //   title: "Scroll Distortion",
  //   description: "Image distortion effects driven by scroll velocity and direction.",
  //   category: "motion",
  //   image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&h=600&fit=crop",
  //   techStack: ["GLSL", "Three.js", "Lenis"],
  //   demoType: "interactive",
  //   featured: false,
  // },
  {
    id: "3",
    slug: "generative-typography",
    title: "Generative Typography",
    description: "Procedurally generated letterforms that evolve and mutate over time.",
    category: "generative",
    image: "/video/generative-type.mp4",
    techStack: ["Canvas", "P5.js", "OpenType.js"],
    demoType: "interactive",
    featured: true,
  },
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
