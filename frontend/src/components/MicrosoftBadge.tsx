interface MicrosoftBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function MicrosoftBadge({ className = "", size = 'md' }: MicrosoftBadgeProps) {
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base",
    lg: "px-6 sm:px-8 md:px-10 py-4 sm:py-5 text-base sm:text-lg"
  };

  const logoSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2", 
    lg: "w-2.5 h-2.5"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
     <div className={`inline-flex items-center bg-gradient-to-r from-edtech-blue/30 to-edtech-blue/40 backdrop-blur-lg text-white ${sizeClasses[size]} rounded-2xl font-bold border-2 border-blue-400/50 shadow-lg shadow-blue-500/25 ${className}`}>
      {/* Microsoft Logo Section */}
      <div className="flex items-center bg-white rounded-lg px-3 py-1 mr-3 min-w-fit">
        <div className="flex items-center">
          <div className="grid grid-cols-2 gap-0.5 mr-2">
            <div className={`${logoSizes[size]} bg-red-500`}></div>
            <div className={`${logoSizes[size]} bg-green-500`}></div>
            <div className={`${logoSizes[size]} bg-blue-500`}></div>
            <div className={`${logoSizes[size]} bg-yellow-500`}></div>
          </div>
          <span className={`text-gray-700 font-semibold ${textSizes[size]}`}>Microsoft</span>
        </div>
      </div>
      
      {/* Certification Text */}
      <span className="text-blue-100 font-bold tracking-wide">CERTIFIED PROGRAM</span>
    </div>
  );
}
