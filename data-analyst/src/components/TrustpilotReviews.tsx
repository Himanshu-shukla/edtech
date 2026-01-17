import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { getTrustpilotReviewsData } from '../utils/dataAdapter';

interface TrustpilotReview {
  id: number | string;
  name: string;
  avatar: string;
  location: string;
  reviewCount: number;
  rating: number;
  title: string;
  review: string;
  reviewDate: string;
  verified: boolean;
}

export default function TrustpilotReviews() {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [reviews, setReviews] = useState<TrustpilotReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getTrustpilotReviewsData();
        setReviews(data);
      } catch (error) {
        console.error('Error loading Trustpilot reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Calculate relative time from review date
  const getRelativeTime = (dateString: string): string => {
    const reviewDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - reviewDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return '1 week ago';
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 60) return '1 month ago';
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Truncate review text
  const truncateText = (text: string, maxLength: number = 150): { text: string; isTruncated: boolean } => {
    if (text.length <= maxLength) {
      return { text, isTruncated: false };
    }
    const truncated = text.substring(0, maxLength).trim();
    const lastSpace = truncated.lastIndexOf(' ');
    return {
      text: lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated,
      isTruncated: true
    };
  };

  // Toggle expand/collapse for a review
  const toggleExpand = (reviewId: string | number) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      const id = String(reviewId);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Duplicate reviews for seamless infinite scroll
  const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews, ...reviews, ...reviews];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const container = e.currentTarget as HTMLElement;
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = e.currentTarget as HTMLElement;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderStars = (rating: number) => {
    // Round to nearest 0.5 for Trustpilot star images (they only support 0.5 increments)
    const roundedRating = Math.round(rating * 2) / 2;
    
    return (
      <div className="flex items-center">
        <img 
          src={`https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-${roundedRating}.svg`}
          alt={`${rating} stars`}
          className="h-4 w-auto"
          style={{ maxHeight: '16px', height: '16px' }}
        />
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            {/* Trustpilot Logo */}
            <div className="flex items-center gap-2 bg-[#00b67a] text-white px-4 py-2 rounded">
              <Star className="w-5 h-5 fill-white text-white" />
              <span className="font-bold text-lg">Trustpilot</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-5.svg"
                alt="5 stars"
                className="h-5 w-auto"
                style={{ maxHeight: '20px', height: '20px' }}
              />
              <span className="font-bold text-gray-900 text-lg">4.9</span>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-[#00b67a]">10,000+</span> Professionals
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See what our successful graduates have to say about their learning journey
          </p>
          
          <div className="mt-4 text-sm text-gray-500">
            TrustScore <span className="font-bold text-gray-900">4.9</span> | <span className="font-bold">Excellent</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b67a]"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No reviews available at the moment.</p>
          </div>
        )}

        {/* Marquee Container */}
        {!loading && reviews.length > 0 && (
        <div className="relative">
          <div 
            className="overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="flex gap-6 animate-marquee-slow hover:pause-marquee">
              {duplicatedReviews.map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="flex-shrink-0 w-[400px] bg-white border border-[#dcdce6] rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Header - Avatar, Name, Location */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={review.avatar} 
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#191919] text-base">{review.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#5f5f5f]">
                        <span>{review.location}</span>
                        <span>•</span>
                        <span>{review.reviewCount} {review.reviewCount === 1 ? 'review' : 'reviews'}</span>
                      </div>
                    </div>
                    <div className="text-xs text-[#5f5f5f] whitespace-nowrap">
                      {getRelativeTime(review.reviewDate)}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-3">
                    {renderStars(review.rating)}
                  </div>

                  {/* Title */}
                  <h5 className="font-bold text-[#191919] mb-3 text-lg leading-snug">
                    {review.title}
                  </h5>

                  {/* Review Text with Truncation */}
                  <div className="mb-4">
                    {(() => {
                      const reviewKey = `${review.id}-${index}`;
                      const isExpanded = expandedReviews.has(reviewKey);
                      const { text, isTruncated } = truncateText(review.review);
                      
                      return (
                        <>
                          <p className="text-[#191919] text-base leading-relaxed whitespace-pre-line">
                            {isExpanded ? review.review : text}
                            {!isExpanded && isTruncated && '...'}
                          </p>
                          {isTruncated && (
                            <button
                              onClick={() => toggleExpand(reviewKey)}
                              className="text-[#00b67a] hover:text-[#008a5d] font-medium text-sm mt-2 transition-colors"
                            >
                              {isExpanded ? 'Read less' : 'Read more'}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Date and Status */}
                  <div className="flex items-center gap-3 text-xs text-[#5f5f5f]">
                    <span className="bg-[#f5f5f5] px-2 py-1 rounded">{review.reviewDate}</span>
                    {review.verified && (
                      <span className="bg-[#f5f5f5] px-2 py-1 rounded">Unprompted review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
        )}

        {/* CTA */}
        {!loading && reviews.length > 0 && (
        <div className="text-center mt-12">
          <a
            href="https://www.trustpilot.com/review/edtechinformative.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#00b67a] hover:text-[#008a5d] font-semibold text-lg transition-colors"
          >
            Read all reviews on Trustpilot
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
        )}
      </div>

      <style>{`
        @keyframes marquee-slow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-500%);
          }
        }

        .animate-marquee-slow {
          animation: marquee-slow 60s linear infinite;
        }

        .pause-marquee:hover {
          animation-play-state: paused;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
