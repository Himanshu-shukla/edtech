
// type TechBackgroundProps = {
//   className?: string;
// };

// export default function TechBackground({ className = "" }: TechBackgroundProps) {
//   return (
//     <div className={`absolute inset-0 overflow-hidden opacity-90 ${className}`}>
//       {/* Bar Chart - Top Left */}
//       <div className="absolute top-20 left-16">
//         <div className="flex items-end space-x-1">
//           <div className="w-2 h-8 bg-blue-400 animate-pulse"></div>
//           <div className="w-2 h-12 bg-blue-500 animate-pulse delay-100"></div>
//           <div className="w-2 h-6 bg-blue-400 animate-pulse delay-200"></div>
//           <div className="w-2 h-16 bg-blue-600 animate-pulse delay-300"></div>
//           <div className="w-2 h-10 bg-blue-500 animate-pulse delay-400"></div>
//         </div>
//       </div>

//       {/* Line Graph with Points - Top Right */}
//       <div className="absolute top-32 right-20">
//         <svg width="80" height="40" className="stroke-purple-400 animate-pulse">
//           <polyline 
//             fill="none" 
//             stroke="currentColor" 
//             strokeWidth="2" 
//             points="0,35 15,25 30,30 45,15 60,20 75,10"
//           />
//           <circle cx="0" cy="35" r="2" fill="currentColor" />
//           <circle cx="15" cy="25" r="2" fill="currentColor" />
//           <circle cx="30" cy="30" r="2" fill="currentColor" />
//           <circle cx="45" cy="15" r="2" fill="currentColor" />
//           <circle cx="60" cy="20" r="2" fill="currentColor" />
//           <circle cx="75" cy="10" r="2" fill="currentColor" />
//         </svg>
//       </div>

//       {/* Spinning Circles - Bottom Left */}
//       <div className="absolute bottom-32 left-24">
//         <svg width="60" height="60" className="animate-spin" style={{ animationDuration: "10s" }}>
//           <circle 
//             cx="30" 
//             cy="30" 
//             r="25" 
//             fill="none" 
//             stroke="#3B82F6" 
//             strokeWidth="6" 
//             strokeDasharray="40 120"
//           />
//           <circle 
//             cx="30" 
//             cy="30" 
//             r="25" 
//             fill="none" 
//             stroke="#8B5CF6" 
//             strokeWidth="6" 
//             strokeDasharray="30 120" 
//             strokeDashoffset="-40"
//           />
//           <circle 
//             cx="30" 
//             cy="30" 
//             r="25" 
//             fill="none" 
//             stroke="#06B6D4" 
//             strokeWidth="6" 
//             strokeDasharray="50 120" 
//             strokeDashoffset="-70"
//           />
//         </svg>
//       </div>

//       {/* Horizontal Progress Bars - Left Middle */}
//       <div className="absolute top-1/2 left-12">
//         <div className="space-y-1">
//           <div className="flex space-x-1">
//             <div className="w-8 h-1 bg-blue-400 animate-pulse"></div>
//             <div className="w-6 h-1 bg-blue-300 animate-pulse delay-100"></div>
//             <div className="w-10 h-1 bg-blue-500 animate-pulse delay-200"></div>
//           </div>
//           <div className="flex space-x-1">
//             <div className="w-6 h-1 bg-purple-400 animate-pulse delay-100"></div>
//             <div className="w-8 h-1 bg-purple-300 animate-pulse delay-200"></div>
//             <div className="w-7 h-1 bg-purple-500 animate-pulse delay-300"></div>
//           </div>
//           <div className="flex space-x-1">
//             <div className="w-10 h-1 bg-cyan-400 animate-pulse delay-200"></div>
//             <div className="w-5 h-1 bg-cyan-300 animate-pulse delay-300"></div>
//             <div className="w-9 h-1 bg-cyan-500 animate-pulse delay-400"></div>
//           </div>
//         </div>
//       </div>

//       {/* Dashboard Cards - Bottom Right */}
//       <div className="absolute bottom-20 right-16">
//         <div className="space-y-2">
//           <div className="w-16 h-8 border border-blue-400/50 rounded animate-pulse">
//             <div className="p-1">
//               <div className="w-8 h-1 bg-blue-400 mb-1"></div>
//               <div className="w-12 h-1 bg-blue-300"></div>
//             </div>
//           </div>
//           <div className="w-16 h-8 border border-purple-400/50 rounded animate-pulse delay-100">
//             <div className="p-1">
//               <div className="w-10 h-1 bg-purple-400 mb-1"></div>
//               <div className="w-8 h-1 bg-purple-300"></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chart Icon - Bottom Center */}
//       <div className="absolute top-3/4 right-1/3">
//         <svg 
//           width="40" 
//           height="40" 
//           className="text-blue-400 animate-bounce" 
//           fill="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.5h-15V5h15v14.5zm0-16.5h-15c-.83 0-1.5.67-1.5 1.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5z" />
//         </svg>
//       </div>

//       {/* Growth Chart Icon - Top Center Right */}
//       <div className="absolute top-1/4 right-1/4">
//         <svg 
//           width="32" 
//           height="32" 
//           className="text-green-400 animate-pulse" 
//           fill="currentColor" 
//           viewBox="0 0 24 24"
//         >
//           <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
//         </svg>
//       </div>

//       {/* Additional Elements for More Dynamic Feel */}
      
//       {/* Small Bar Chart - Top Center */}
//       <div className="absolute top-16 left-1/3">
//         <div className="flex items-end space-x-1">
//           <div className="w-1 h-4 bg-cyan-400 animate-pulse delay-100"></div>
//           <div className="w-1 h-6 bg-cyan-500 animate-pulse delay-200"></div>
//           <div className="w-1 h-3 bg-cyan-400 animate-pulse delay-300"></div>
//           <div className="w-1 h-8 bg-cyan-600 animate-pulse delay-400"></div>
//         </div>
//       </div>

//       {/* Pie Chart Segment - Center Right */}
//       <div className="absolute top-1/2 right-12">
//         <svg width="32" height="32" className="animate-pulse delay-500">
//           <circle 
//             cx="16" 
//             cy="16" 
//             r="12" 
//             fill="none" 
//             stroke="#F59E0B" 
//             strokeWidth="4" 
//             strokeDasharray="25 75" 
//             transform="rotate(-90 16 16)"
//           />
//           <circle 
//             cx="16" 
//             cy="16" 
//             r="12" 
//             fill="none" 
//             stroke="#EF4444" 
//             strokeWidth="4" 
//             strokeDasharray="20 80" 
//             strokeDashoffset="-25"
//             transform="rotate(-90 16 16)"
//           />
//         </svg>
//       </div>

//       {/* Network Nodes - Bottom Left */}
//       <div className="absolute bottom-16 left-8">
//         <svg width="48" height="32" className="text-indigo-400 animate-pulse delay-300">
//           <circle cx="8" cy="16" r="3" fill="currentColor" />
//           <circle cx="24" cy="8" r="3" fill="currentColor" />
//           <circle cx="40" cy="20" r="3" fill="currentColor" />
//           <line x1="8" y1="16" x2="24" y2="8" stroke="currentColor" strokeWidth="1" />
//           <line x1="24" y1="8" x2="40" y2="20" stroke="currentColor" strokeWidth="1" />
//           <line x1="8" y1="16" x2="40" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
//         </svg>
//       </div>

//       {/* Code Brackets - Top Right Corner */}
//       <div className="absolute top-8 right-8">
//         <div className="text-emerald-400 text-2xl font-mono animate-pulse delay-600">
//           {"< />"}
//         </div>
//       </div>

//       {/* Data Flow Animation - Center */}
//       <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
//         <div className="flex space-x-2 items-center">
//           <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
//           <div className="w-8 h-0.5 bg-blue-400 animate-pulse"></div>
//           <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping delay-200"></div>
//           <div className="w-8 h-0.5 bg-purple-400 animate-pulse delay-200"></div>
//           <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping delay-400"></div>
//         </div>
//       </div>
//     </div>
//   );
// }
