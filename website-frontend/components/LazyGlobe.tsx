import React, { useState, useEffect, useRef } from 'react';

interface LazyGlobeProps {
  className?: string;
}

const LazyGlobe: React.FC<LazyGlobeProps> = ({ className }) => {
  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    let observer: IntersectionObserver | null = null;

    const loadGlobe = async () => {
      if (!isMounted) return;

      try {
        // Use string-based dynamic imports to prevent build-time detection
        const [{ Canvas }, { default: Globe }] = await Promise.all([
          import(/* webpackIgnore: true */ "@react-three/fiber"),
          import(/* webpackIgnore: true */ "../globe")
        ]);

        if (!isMounted) return;

        // Create the globe component
        const GlobeWithCanvas = () => (
          <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Globe />
          </Canvas>
        );

        setGlobeComponent(() => GlobeWithCanvas);
      } catch (error) {
        console.error('Failed to load globe:', error);
      }
    };

    const startLoading = () => {
      // Wait for page to be completely loaded first
      if (document.readyState === 'complete') {
        // Add a significant delay to ensure everything else loads first
        setTimeout(loadGlobe, 1000);
      } else {
        window.addEventListener('load', () => {
          setTimeout(loadGlobe, 1000);
        }, { once: true });
      }
    };

    // Use intersection observer to only load when globe area is visible or about to be visible
    if (containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              observer?.disconnect();
              startLoading();
            }
          });
        },
        {
          rootMargin: '200px', // Start loading when 200px away from viewport
          threshold: 0
        }
      );

      observer.observe(containerRef.current);
    }

    return () => {
      isMounted = false;
      observer?.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {GlobeComponent ? <GlobeComponent /> : null}
    </div>
  );
};

export default LazyGlobe;