import { useState, useEffect } from "react";

interface RoleCarouselProps {
  rolesList: string[];
  interval?: number;
}

interface CardData {
  role: string;
  position: number; // 0=top4, 1=top3, 2=top2, 3=top1, 4=center, 5=bottom1, 6=bottom2, 7=bottom3, 8=bottom4
  previousPosition: number;
  id: number;
  isAnimatingToCenter?: boolean; // Track if card is animating to center position
}

const RoleCarousel = ({ rolesList, interval = 2000 }: RoleCarouselProps) => {
  const [cards, setCards] = useState<CardData[]>(() => [
    { role: rolesList[5] || rolesList[0], position: 0, previousPosition: 0, id: 0, isAnimatingToCenter: false }, // top4
    { role: rolesList[6] || rolesList[0], position: 1, previousPosition: 1, id: 1, isAnimatingToCenter: false }, // top3
    { role: rolesList[7] || rolesList[0], position: 2, previousPosition: 2, id: 2, isAnimatingToCenter: false }, // top2
    { role: rolesList[8] || rolesList[0], position: 3, previousPosition: 3, id: 3, isAnimatingToCenter: false }, // top1
    { role: rolesList[0] || rolesList[0], position: 4, previousPosition: 4, id: 4, isAnimatingToCenter: false }, // center
    { role: rolesList[1] || rolesList[0], position: 5, previousPosition: 5, id: 5, isAnimatingToCenter: false }, // bottom1
    { role: rolesList[2] || rolesList[0], position: 6, previousPosition: 6, id: 6, isAnimatingToCenter: false }, // bottom2
    { role: rolesList[3] || rolesList[0], position: 7, previousPosition: 7, id: 7, isAnimatingToCenter: false }, // bottom3
    { role: rolesList[4] || rolesList[0], position: 8, previousPosition: 8, id: 8, isAnimatingToCenter: false }, // bottom4
  ]);
  const [nextRoleIndex, setNextRoleIndex] = useState(9);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);

      // Update positions with animation tracking
      setCards(prevCards => {
        const newCards = prevCards.map(card => ({
          ...card,
          previousPosition: card.position,
          position: card.position - 1,
          isAnimatingToCenter: card.position === 5 // Mark card moving from bottom1 to center
        }));
        
        // Remove card that went off top (position -1)
        const visibleCards = newCards.filter(card => card.position >= 0);
        
        // Add new card at bottom (position 8)
        const newRole = rolesList[nextRoleIndex % rolesList.length];
        visibleCards.push({ 
          role: newRole, 
          position: 8, 
          previousPosition: 8,
          id: Date.now(),
          isAnimatingToCenter: false
        });
        
        return visibleCards;
      });
      
      setNextRoleIndex(prev => prev + 1);

      // Clear animation flag and reset isAnimatingToCenter after animation completes
      setTimeout(() => {
        setAnimating(false);
        setCards(prevCards => 
          prevCards.map(card => ({ ...card, isAnimatingToCenter: false }))
        );
      }, 1400); // Increased slightly for smoother feel
    }, interval);

    return () => clearInterval(id);
  }, [interval, rolesList, nextRoleIndex]);

  const getCardStyles = (position: number, animating: boolean) => {
    const positions = {
      0: { y: -40, scale: 0.7, opacity: 0.1, zIndex: 1, rotateX: 120 },   // top4 - very low visibility
      1: { y: -32, scale: 0.75, opacity: 0.3, zIndex: 2, rotateX: 120 },  // top3
      2: { y: -24, scale: 0.8, opacity: 0.5, zIndex: 3, rotateX: 120 },   // top2
      3: { y: -16, scale: 0.9, opacity: 0.7, zIndex: 4, rotateX: 120 },   // top1
      4: { y: 0, scale: 1.0, opacity: 1.0, zIndex: 10, rotateX: 0 },      // center
      5: { y: 16, scale: 0.9, opacity: 0.7, zIndex: 4, rotateX: -120 },   // bottom1
      6: { y: 24, scale: 0.8, opacity: 0.5, zIndex: 3, rotateX: -120 },   // bottom2
      7: { y: 32, scale: 0.75, opacity: 0.3, zIndex: 2, rotateX: -120 },  // bottom3
      8: { y: 40, scale: 0.7, opacity: 0.1, zIndex: 1, rotateX: -120 },   // bottom4 - very low visibility
    };

    const pos = positions[position as keyof typeof positions];
    
    return {
      transform: `perspective(600px) translateY(${pos.y * 4}px) scale(${pos.scale}) rotateX(${pos.rotateX}deg)`,
      opacity: pos.opacity,
      zIndex: pos.zIndex,
      transition: animating ? 'all 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none', // Smoother easing
      transformStyle: 'preserve-3d' as const
    };
  };

  // Function to determine which card should show text
  const shouldShowText = (card: CardData) => {
    // During animation, show text on both:
    // 1. Card that was previously in center (moving up)
    // 2. Card that is moving to center (from bottom1 to center)
    if (animating) {
      return card.previousPosition === 4 || (card.previousPosition === 5 && card.position === 4);
    }
    // When not animating, only show text for center position
    return card.position === 4;
  };

  // Function to get text opacity for smooth fade effect
  const getTextOpacity = (card: CardData) => {
    if (!shouldShowText(card)) return 0;
    
    // During animation, create fade effect
    if (animating) {
      // Card moving up (center to top) - fade out
      if (card.previousPosition === 4 && card.position === 3) {
        return 0; // Fade out immediately
      }
      // Card moving to center (bottom to center) - fade in
      if (card.previousPosition === 5 && card.position === 4) {
        return 1; // Fade in immediately
      }
      // Default for other cards showing text
      return 1;
    }
    
    return 1;
  };

  return (
    <div className="relative w-80 h-[400px]  flex flex-col justify-center items-center perspective-1000 overflow-hidden">
      {cards.map((card) => (
        <div
          key={card.id}
          className="absolute w-72 h-16 shadow-xl border border-white/80 rounded-lg flex items-center justify-center overflow-hidden"
          style={getCardStyles(card.position, animating)}
        >
          {/* Base background layer */}
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: card.position > 4 
                  ? 'linear-gradient(to bottom, #0f1f3d, #1a2e4a, #243654, #2a4a78)'
                  : 'linear-gradient(to bottom, #2a4a78, #243654, #1a2e4a, #0f1f3d)',
            }}
          />
          
          {/* Orange overlay that fades in/out */}
          <div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'linear-gradient(to right, #EF552C, #FF6B47)',
              opacity: (() => {
                if (!animating) {
                  return card.position === 4 ? 1 : 0;
                }
                // During animation
                if (card.previousPosition === 4) return 0; // Fade out from center
                if (card.previousPosition === 5 && card.position === 4) return 1; // Fade in to center
                return card.position === 4 ? 1 : 0;
              })(),
              transition: animating ? 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
          />
          
          {/* Text content */}
          <span 
            className="text-white font-bold text-lg relative z-10"
            style={{
              opacity: getTextOpacity(card),
              transition: animating ? 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
            }}
          >
            {shouldShowText(card) ? card.role : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RoleCarousel;
