import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, ExternalLink, MapPin } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getTrustpilotReviewsData } from '../utils/dataAdapter';

// --- Types ---
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

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Sub-Component: Star Rating ---
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div 
          key={star} 
          className={cn(
            "relative w-5 h-5 flex items-center justify-center",
            star <= rating ? "text-[#00b67a]" : "text-zinc-700"
          )}
        >
          <Star 
            className="w-5 h-5 fill-current" 
            strokeWidth={0}
          />
        </div>
      ))}
    </div>
  );
};

// --- Sub-Component: Review Card ---
const ReviewCard = ({ review }: { review: TrustpilotReview }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 120;
  const isLong = review.review.length > maxLength;
  
  const displayText = isExpanded 
    ? review.review 
    : (isLong ? review.review.substring(0, maxLength).trim() + '...' : review.review);

  return (
    <div className="w-[350px] sm:w-[400px] flex-shrink-0 p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm transition-all hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-xl group">
      
      {/* Header: User Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
               {review.avatar ? (
                 <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
                   {review.name.charAt(0)}
                 </div>
               )}
            </div>
            {review.verified && (
              <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5">
                <CheckCircle className="w-3 h-3 text-[#00b67a] fill-[#00b67a]/20" />
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-bold text-white text-sm">{review.name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{review.location}</span>
            </div>
          </div>
        </div>

        <span className="text-xs text-zinc-600 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
          {new Date(review.reviewDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Stars & Title */}
      <div className="mb-3">
        <StarRating rating={review.rating} />
        <h3 className="font-bold text-white mt-2 leading-tight group-hover:text-[#00b67a] transition-colors">
          {review.title}
        </h3>
      </div>

      {/* Body */}
      <div className="relative">
        <p className="text-sm text-zinc-400 leading-relaxed min-h-[60px]">
          "{displayText}"
        </p>
        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-[#00b67a] hover:text-[#00d08c] mt-2 transition-colors focus:outline-none"
          >
            {isExpanded ? 'Show Less' : 'Read Full Review'}
          </button>
        )}
      </div>
    </div>
  );
};

export default function TrustpilotReviews() {
  const [reviews, setReviews] = useState<TrustpilotReview[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#00b67a]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-6 p-1 pr-4 rounded-full bg-zinc-900 border border-zinc-800"
          >
            <div className="bg-[#00b67a] p-1.5 rounded-full">
              <Star className="w-4 h-4 fill-white text-white" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="font-bold text-white">Trustpilot</span>
              <span className="text-zinc-500">|</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 bg-[#00b67a]" />)}
                </div>
                <span className="font-bold text-white ml-1">4.9</span>
              </div>
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Trusted by <span className="text-[#00b67a]">10,000+</span> Professionals
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl mx-auto"
          >
            Don't just take our word for it. See what our successful graduates say about their experience.
          </motion.p>
        </div>

        {/* --- Infinite Marquee --- */}
        <div className="relative py-4">
          {/* Fade Masks */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="w-[400px] h-[250px] rounded-3xl bg-zinc-900/50 border border-zinc-800 animate-pulse flex-shrink-0" />
               ))}
            </div>
          ) : (
            <div className="flex overflow-hidden group">
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{ 
                  duration: 60, // Slower speed for readability
                  ease: "linear", 
                  repeat: Infinity 
                }}
                className="flex gap-6 flex-shrink-0 group-hover:[animation-play-state:paused]"
              >
                {/* Triple duplication ensures smoothness on very wide screens */}
                {[...reviews, ...reviews, ...reviews].map((review, idx) => (
                  <ReviewCard key={`${review.id}-${idx}`} review={review} />
                ))}
              </motion.div>
            </div>
          )}
        </div>

        {/* --- Footer CTA --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.trustpilot.com/review/edtechinformative.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium border-b border-transparent hover:border-white pb-0.5"
          >
            Read all reviews on Trustpilot <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}