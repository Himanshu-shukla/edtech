// Course icon library - SVG path strings
export const courseIcons = [
  // Data Analytics
  { iconName: 'bar-chart', iconPath: 'M4 19V7m5 12V4m5 15V9m5 10V12' },
  { iconName: 'chart-line', iconPath: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v16H4z' },
  { iconName: 'pie-chart', iconPath: 'M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c.79 0 1.57.1 2.31.29l-2.31 8.71L21 12z' },
  
  // AI & Machine Learning
  { iconName: 'star-sparkle', iconPath: 'M12 3l2.4 4.9L20 9l-4 3.9.9 5.6L12 16.8 7.1 18.5 8 13 4 9l5.6-1.1L12 3z' },
  { iconName: 'brain', iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { iconName: 'lightning', iconPath: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { iconName: 'cpu', iconPath: 'M19 12h2m-2 0a7 7 0 11-14 0 7 7 0 0114 0zM12 19v2m0-2a7 7 0 110-14 7 7 0 010 14zm0-16V1m0 2a7 7 0 110 14 7 7 0 010-14z' },
  
  // Automation & Robots
  { iconName: 'robot', iconPath: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { iconName: 'cog', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { iconName: 'workflow', iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  
  // Web Development
  { iconName: 'code', iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { iconName: 'globe', iconPath: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
  { iconName: 'desktop', iconPath: 'M9 17v-2m3 2v-4m3 4v-6M9 3h6l6 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9l6-6z' },
  
  // Mobile Development
  { iconName: 'mobile', iconPath: 'M5 2a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2H5zm7 16h.01' },
  { iconName: 'smartphone', iconPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  
  // Cloud Computing
  { iconName: 'cloud', iconPath: 'M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9Z' },
  { iconName: 'server', iconPath: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 01.9-.995l7-1a1 1 0 01.2 0l7 1A1 1 0 0120 6v7z' },
  
  // Cybersecurity
  { iconName: 'shield', iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm-2-8l2 2 4-4' },
  { iconName: 'lock', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  
  // Business & Marketing
  { iconName: 'trending-up', iconPath: 'M18 2.0845a1 1 0 011 1V17a1 1 0 01-2 0V4.4142L7.7071 13.7071a1 1 0 01-1.4142 0L2.2929 9.7071a1 1 0 011.4142-1.4142L8 12.5858 16.5858 4.0001H13a1 1 0 010-2h5z' },
  { iconName: 'target', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { iconName: 'briefcase', iconPath: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  
  // Education
  { iconName: 'graduation-cap', iconPath: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14v7' },
  { iconName: 'book-open', iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  
  // Default fallback
  { iconName: 'default', iconPath: 'M13 10V3L4 14h7v7l9-11h-7z' }
];
