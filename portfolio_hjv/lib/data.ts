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
  category: "3d" | "motion" | "interaction" | "generative" | "audio"
  image: string
  techStack: string[]
  demoType: "interactive" | "video" | "embed"
  featured: boolean
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
    liveUrl: "https://aurora-demo.vercel.app",
    githubUrl: "https://hjv-studio.vercel.app/",
    featured: true,
    platforms: ["web"],
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop",
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
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop",
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
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&h=800&fit=crop",
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
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=800&fit=crop",
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
    apkUrl: "/downloads/pulse.apk",
    iosUrl: "shin-dev-beryl.vercel.app",
    featured: false,
    platforms: ["web"],
    screenshots: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=800&fit=crop",
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
    image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=800&h=600&fit=crop",
    techStack: ["Three.js", "GLSL", "React Three Fiber"],
    demoType: "interactive",
    featured: true,
  },
  {
    id: "2",
    slug: "morphing-shapes",
    title: "Morphing Shapes",
    description: "Smooth morphing animations between geometric primitives using shader-based techniques.",
    category: "3d",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    techStack: ["React Three Fiber", "Drei", "GSAP"],
    demoType: "interactive",
    featured: true,
  },
  {
    id: "3",
    slug: "audio-visualizer",
    title: "Audio Visualizer",
    description: "Real-time audio visualization using Web Audio API with reactive 3D elements.",
    category: "audio",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop",
    techStack: ["Web Audio API", "Canvas", "Framer Motion"],
    demoType: "interactive",
    featured: true,
  },
  {
    id: "4",
    slug: "magnetic-cursor",
    title: "Magnetic Cursor",
    description: "Elements that are attracted to and repelled by cursor movement with physics simulation.",
    category: "interaction",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&h=600&fit=crop",
    techStack: ["Framer Motion", "React", "Physics Engine"],
    demoType: "interactive",
    featured: false,
  },
  {
    id: "5",
    slug: "scroll-distortion",
    title: "Scroll Distortion",
    description: "Image distortion effects driven by scroll velocity and direction.",
    category: "motion",
    image: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&h=600&fit=crop",
    techStack: ["GLSL", "Three.js", "Lenis"],
    demoType: "interactive",
    featured: false,
  },
  {
    id: "6",
    slug: "generative-typography",
    title: "Generative Typography",
    description: "Procedurally generated letterforms that evolve and mutate over time.",
    category: "generative",
    image: "https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=800&h=600&fit=crop",
    techStack: ["Canvas", "P5.js", "OpenType.js"],
    demoType: "interactive",
    featured: true,
  },
  {
    id: "7",
    slug: "liquid-transitions",
    title: "Liquid Transitions",
    description: "Fluid page transitions using displacement maps and shader effects.",
    category: "motion",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop",
    techStack: ["GSAP", "Pixi.js", "Custom Shaders"],
    demoType: "video",
    featured: false,
  },
  {
    id: "8",
    slug: "3d-text-warp",
    title: "3D Text Warp",
    description: "Text that wraps and bends along 3D surfaces with real-time deformation.",
    category: "3d",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=600&fit=crop",
    techStack: ["Three.js", "Troika-3d-text", "Custom Geometry"],
    demoType: "interactive",
    featured: false,
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
