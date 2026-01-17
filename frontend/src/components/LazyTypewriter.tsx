import React, { Suspense, lazy } from 'react';

// Lazy load typewriter component
const Typewriter = lazy(() => import('typewriter-effect'));

interface LazyTypewriterProps {
  options: {
    strings: string[];
    autoStart: boolean;
    loop: boolean;
    delay?: number;
    deleteSpeed?: number;
    cursor?: string;
  };
}

const LazyTypewriter: React.FC<LazyTypewriterProps> = ({ options }) => {
  return (
    <Suspense fallback={<div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight">Build</div>}>
      <Typewriter options={options} />
    </Suspense>
  );
};

export default LazyTypewriter;