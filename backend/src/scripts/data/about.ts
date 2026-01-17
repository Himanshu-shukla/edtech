// Import pricing FAQs and course benefits from pricing data
import { pricingFAQs, courseBenefits } from './pricing';

export const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    bio: "Former Google AI researcher with 15+ years in tech education. PhD in Computer Science from MIT.",
    image: "/api/placeholder/300/300",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder", 
    bio: "Ex-Microsoft Principal Engineer. Built scalable learning platforms for 1M+ students worldwide.",
    image: "/api/placeholder/300/300",
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Head of Curriculum",
    bio: "Former Stanford Professor. Expert in AI/ML education with 200+ published papers.",
    image: "/api/placeholder/300/300", 
    linkedin: "#",
    twitter: "#"
  },
  {
    name: "David Kim",
    role: "VP of Student Success",
    bio: "Career coach with 10+ years helping 5000+ students land their dream tech jobs.",
    image: "/api/placeholder/300/300",
    linkedin: "#",
    twitter: "#"
  }
];

export const companyValues = [
  {
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Innovation First",
    description: "We stay ahead of industry trends, constantly updating our curriculum to reflect the latest technologies and practices."
  },
  {
    iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z",
    title: "Community Driven",
    description: "Our vibrant community of learners, mentors, and industry experts creates an environment where everyone thrives."
  },
  {
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Results Focused",
    description: "We measure success by our students' career outcomes. 95% of our graduates land their dream jobs within 6 months."
  },
  {
    iconPath: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    title: "Student First",
    description: "Every decision we make is guided by what's best for our students' learning journey and career success."
  }
];

export const aboutStats = [
  { number: "50,000+", label: "Students Graduated", color: "edtech-green" },
  { number: "95%", label: "Job Placement Rate", color: "edtech-orange" },
  { number: "150+", label: "Industry Partners", color: "edtech-red" },
  { number: "4.9/5", label: "Average Rating", color: "edtech-green" }
];

export const companyMilestones = [
  {
    year: "2018",
    title: "Founded EdTech Informative",
    description: "Started with a mission to democratize quality tech education globally."
  },
  {
    year: "2019", 
    title: "First 1,000 Students",
    description: "Reached our first milestone with students from 25+ countries."
  },
  {
    year: "2020",
    title: "COVID Pivot",
    description: "Successfully transitioned to fully remote learning during the pandemic."
  },
  {
    year: "2021",
    title: "Industry Partnerships",
    description: "Formed partnerships with Google, Microsoft, and Amazon for certification programs."
  },
  {
    year: "2022",
    title: "AI Specialization Launch",
    description: "Became the first online platform to offer comprehensive AI and ML bootcamps."
  },
  {
    year: "2023",
    title: "50,000 Graduate Milestone",
    description: "Celebrated 50,000+ successful graduates with 95% job placement rate."
  },
  {
    year: "2024",
    title: "Global Expansion",
    description: "Expanded to serve students in 80+ countries with localized content."
  }
];

// Company contact and communication data
export const contactData = {
  offices: [
    {
      name: "Head Office",
      address: "30 N Gould St, Sheridan WY, 82801",
      email: "support@edtechinformative.uk",
      phone: "+1 929 588 7774"
    },
    {
      name: "UK Office", 
      address: "128 City Rd, London EC1V 2NX",
      phone: "+44 7520 637 821"
    }
  ],
  responseTime: "We usually respond within 1 business day.",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.001!2d-73.935242!3d40.730610!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sus!4v1700000000000"
};

export const whatsappQuickMessages = [
  "I'm interested in your courses",
  "Can you help me choose the right course?",
  "What are your pricing options?",
  "Do you offer certifications?"
];

// Company information including WhatsApp and hero data
export const companyInfo = {
  whatsappNumber: "+919643274676",
  supportEmail: "support@edtechinformative.uk",
  heroRoles: [
    "Data • AI • Analytics ",
    "Generative AI",
    "Data Science"

  ],
  carouselRoles: [
    "Data Analyst",
    "Data Scientist", 
    "AI Researcher",
    "Data Engineer",
    "Generative AI"
  ],
  marketingStats: [
    { number: "99.9%", label: "Uptime" },
    { number: "+42%", label: "Productivity" },
    { number: "2M+", label: "Automations" },
    { number: "120+", label: "Integrations" }
  ],
  pricingFaq: pricingFAQs,
  whatsappQuickMessages: whatsappQuickMessages,
  courseBenefitsComparison: courseBenefits.map(benefit => ({
    feature: benefit[0],
    description: benefit[1],
    us: benefit[2],
    others: benefit[3]
  }))
};

// Upcoming and trending skills data
export const upcomingSkills = [
  {
    id: 'quantum-computing',
    name: 'Quantum Computing',
    category: 'EMERGING TECH',
    demand: 'Ultra High',
    growth: '+450%',
    icon: '⚛️',
    accent: 'blue'
  },
  {
    id: 'multimodal-ai',
    name: 'Multimodal AI',
    category: 'AI/ML',
    demand: 'Critical',
    growth: '+320%',
    icon: '🧠',
    accent: 'orange'
  },
  {
    id: 'edge-computing',
    name: 'Edge Computing',
    category: 'CLOUD TECH',
    demand: 'High',
    growth: '+280%',
    icon: '⚡',
    accent: 'green'
  },
  {
    id: 'web3-security',
    name: 'Web3 Security',
    category: 'BLOCKCHAIN',
    demand: 'Critical',
    growth: '+400%',
    icon: '🛡️',
    accent: 'red'
  },
  {
    id: 'neuromorphic-ai',
    name: 'Neuromorphic AI',
    category: 'AI HARDWARE',
    demand: 'Ultra High',
    growth: '+500%',
    icon: '🔬',
    accent: 'blue'
  },
  {
    id: 'spatial-computing',
    name: 'Spatial Computing',
    category: 'AR/VR/XR',
    demand: 'High',
    growth: '+380%',
    icon: '🥽',
    accent: 'orange'
  },
  {
    id: 'autonomous-systems',
    name: 'Autonomous Systems',
    category: 'ROBOTICS',
    demand: 'Critical',
    growth: '+350%',
    icon: '🤖',
    accent: 'green'
  },
  {
    id: 'bio-computing',
    name: 'Bio-Computing',
    category: 'BIOTECH',
    demand: 'Ultra High',
    growth: '+600%',
    icon: '🧬',
    accent: 'red'
  }
];

// Countries highlighted on the globe (Americas + Europe)
export const highlightedCountries = [
  "England",
  "USA"
];
