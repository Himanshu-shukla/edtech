export const courseDetails = [
  {
    courseId: "data-analytics",
    overview:
      "This industry-focused certification program is designed to make you a job-ready Data Analyst with strong AI integration skills using Microsoft tools. You will work on real-world datasets, live projects, and business case studies.",
    features: [
      {
        icon: "bar-chart",
        title: "Industry-Aligned Curriculum",
        description:
          "Designed with real-world data analytics and AI use cases followed by top companies.",
      },
      {
        icon: "briefcase",
        title: "25+ Live Projects",
        description:
          "Work on hands-on projects using real datasets from finance, marketing, and operations.",
      },
      {
        icon: "award",
        title: "Microsoft Certification Path",
        description:
          "Prepare for Microsoft Power BI and Azure Data certifications.",
      },
    ],
    curriculum: [
      {
        module: "Foundations of Data Analytics",
        duration: "4 Weeks",
        topics: [
          {
            topic: "Data Fundamentals",
            subtopics: ["Data Types", "Data Lifecycle", "Business Metrics"],
          },
        ],
      },
      {
        module: "Advanced Analytics & AI",
        duration: "8 Weeks",
        topics: [
          {
            topic: "AI for Analysts",
            subtopics: [
              "Predictive Analytics",
              "Intro to ML",
              "AI-driven Dashboards",
            ],
          },
        ],
      },
    ],
    tools: [
      { name: "Excel", icon: "excel" },
      { name: "Power BI", icon: "powerbi" },
      { name: "Python", icon: "python" },
      { name: "Azure", icon: "azure" },
    ],
    prerequisites: "Basic mathematics and willingness to learn data tools.",
    testimonials: [
      {
        name: "Rahul Mehta",
        role: "Data Analyst at Deloitte",
        avatar: "/avatars/rahul.png",
        rating: 5,
        content:
          "The live projects and Power BI training helped me switch my career successfully.",
        color: "green",
      },
    ],
    successStats: [
      { label: "Placement Rate", value: "92%", color: "green" },
      { label: "Avg Salary Hike", value: "65%", color: "orange" },
    ],
    pricing: {
      current: 49999,
      original: 89999,
      discount: "44% OFF",
      deadline: "Limited Time Offer",
      features: [
        { text: "Lifetime Access", icon: "infinity" },
        { text: "Live Mentor Support", icon: "support" },
      ],
    },
    courseInfo: {
      startDate: "Rolling Admissions",
      format: "Live + Recorded",
      support: "1:1 Mentor Support",
      studentsEnrolled: "12,500+",
    },
    trustIndicators: {
      rating: "4.8/5",
      reviewCount: "2,100+",
      testimonialPreview: {
        text: "Best decision I made for my analytics career.",
        author: "Anjali Verma",
      },
    },
  },

  {
    courseId: "data-science-masters",
    overview:
      "A comprehensive master's-level data science program covering machine learning, AI ethics, MLOps, and business strategy with a research-driven capstone project.",
    features: [
      {
        icon: "graduation-cap",
        title: "Master’s Level Curriculum",
        description:
          "In-depth learning across ML, AI, statistics, and enterprise deployment.",
      },
      {
        icon: "cpu",
        title: "MLOps & Deployment",
        description:
          "Learn real-world deployment using Docker, CI/CD, and cloud platforms.",
      },
      {
        icon: "research",
        title: "Capstone Research Project",
        description:
          "Solve a real business or research problem under expert mentorship.",
      },
    ],
    curriculum: [
      {
        module: "Core Data Science",
        duration: "6 Months",
        topics: [
          {
            topic: "Statistics & ML",
            subtopics: [
              "Probability",
              "Regression",
              "Classification",
              "Clustering",
            ],
          },
        ],
      },
      {
        module: "Advanced AI & MLOps",
        duration: "10 Months",
        topics: [
          {
            topic: "Production AI",
            subtopics: [
              "Model Monitoring",
              "CI/CD",
              "Cloud Deployment",
            ],
          },
        ],
      },
    ],
    tools: [
      { name: "Python", icon: "python" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "Docker", icon: "docker" },
      { name: "AWS", icon: "aws" },
    ],
    prerequisites:
      "Prior experience with programming and basic data analysis.",
    testimonials: [
      {
        name: "Sneha Kapoor",
        role: "Senior Data Scientist",
        avatar: "/avatars/sneha.png",
        rating: 5,
        content:
          "This program helped me transition into a leadership data science role.",
        color: "blue",
      },
    ],
    successStats: [
      { label: "Career Transition", value: "85%", color: "green" },
      { label: "Avg Salary", value: "₹18 LPA", color: "orange" },
    ],
    pricing: {
      current: 199999,
      original: 299999,
      discount: "33% OFF",
      deadline: "Admissions Closing Soon",
      features: [
        { text: "Research Mentorship", icon: "mentor" },
        { text: "Career Services", icon: "career" },
      ],
    },
    courseInfo: {
      startDate: "Cohort Based",
      format: "Live Classes",
      support: "Dedicated Academic Advisor",
      studentsEnrolled: "3,200+",
    },
    trustIndicators: {
      rating: "4.9/5",
      reviewCount: "980+",
      testimonialPreview: {
        text: "A true master's-level learning experience.",
        author: "Kunal Sharma",
      },
    },
  },

  {
    courseId: "gen-ai",
    overview:
      "A hands-on Generative AI program where you build real AI products using LLMs, prompt engineering, vector databases, and agentic workflows.",
    features: [
      {
        icon: "sparkles",
        title: "LLMs & Prompt Engineering",
        description:
          "Master GPT-style models and advanced prompting techniques.",
      },
      {
        icon: "bot",
        title: "AI Agents & Automation",
        description:
          "Build autonomous AI agents using modern frameworks.",
      },
      {
        icon: "rocket",
        title: "Startup-Ready Skills",
        description:
          "Launch AI-powered products and SaaS ideas.",
      },
    ],
    curriculum: [
      {
        module: "Generative AI Foundations",
        duration: "4 Weeks",
        topics: [
          {
            topic: "LLMs",
            subtopics: [
              "Transformers",
              "Prompt Design",
              "Fine-tuning",
            ],
          },
        ],
      },
      {
        module: "AI Agents & Apps",
        duration: "6 Weeks",
        topics: [
          {
            topic: "Agentic Systems",
            subtopics: [
              "Tool Calling",
              "Memory",
              "Vector Databases",
            ],
          },
        ],
      },
    ],
    tools: [
      { name: "OpenAI", icon: "openai" },
      { name: "LangChain", icon: "langchain" },
      { name: "Pinecone", icon: "pinecone" },
      { name: "Python", icon: "python" },
    ],
    prerequisites:
      "Basic programming knowledge (Python or JavaScript).",
    testimonials: [
      {
        name: "Aman Gupta",
        role: "AI Engineer",
        avatar: "/avatars/aman.png",
        rating: 5,
        content:
          "This course helped me build real AI agents used in production.",
        color: "orange",
      },
    ],
    successStats: [
      { label: "Projects Built", value: "20+", color: "green" },
      { label: "Hiring Demand", value: "Very High", color: "red" },
    ],
    pricing: {
      current: 69999,
      original: 99999,
      discount: "30% OFF",
      deadline: "Few Seats Left",
      features: [
        { text: "Hands-on Projects", icon: "code" },
        { text: "Community Access", icon: "community" },
      ],
    },
    courseInfo: {
      startDate: "Next Batch Soon",
      format: "Live + Hands-on",
      support: "Expert Mentorship",
      studentsEnrolled: "5,800+",
    },
    trustIndicators: {
      rating: "4.9/5",
      reviewCount: "1,450+",
      testimonialPreview: {
        text: "The best generative AI course available right now.",
        author: "Ritika Jain",
      },
    },
  },
];
