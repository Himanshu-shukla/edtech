import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import TechBackground from "../TechBackground";
import useRevealOnScroll from "../hooks/useRevealOnScroll";
import { getPostBySlug, getRelatedPosts } from "../utils/dataAdapter";
import type { BlogPost } from "../types";
import "../components/article-styles.css";

export default function PostPage() {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useRevealOnScroll();
  
  // Function to generate slug from heading text
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Load post data
  useEffect(() => {
    const loadPostData = async () => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const postData = await getPostBySlug(slug);
        if (!postData) {
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        setPost(postData);
        
        // Load related posts
        const relatedPostsData = await getRelatedPosts(postData.slug);
        setRelatedPosts(relatedPostsData);
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [slug]);

  // Track active section and reading progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Reading progress calculation
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setReadingProgress(scrolled);

      // Active section tracking
      const sections = document.querySelectorAll('h1[id], h2[id], h3[id]');
      let currentSection = '';

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!slug) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Invalid URL</h1>
            <Link to="/blog" className="cta cta-primary">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="text-6xl mb-4">📄</div>
              <h1 className="text-2xl font-bold mb-2">Loading Article...</h1>
              <p className="text-white/70">Please wait while we fetch the content.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold mb-2">{error || 'Article Not Found'}</h1>
            <p className="text-white/70 mb-6">The article you're looking for doesn't exist or has been moved.</p>
            <Link to="/blog" className="cta cta-primary">
              Browse All Articles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract headings for Table of Contents
  const extractHeadings = (content: string) => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: Array<{level: number, text: string, id: string}> = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateSlug(text);
      headings.push({ level, text, id });
    }

    return headings;
  };

  const headings = extractHeadings(post.content);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(post.title);

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    copy: () => {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Reading Progress Indicator */}
      <div 
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />
      
      <Navbar />
      
      {/* Background */}
      {/* <div className="fixed inset-0 -z-10">
        <TechBackground className="mix-blend-screen opacity-30" />
      </div> */}
      
      <main className="pt-20">
        {/* SECTION 1: Article Header - DARK THEME */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {/* <TechBackground className="opacity-15" /> */}
          
          <div className="relative mx-auto max-w-5xl px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-8 reveal">
              <Link to="/" className="hover:text-edtech-green transition-colors">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-edtech-green transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white/80">{post.category}</span>
            </nav>

            {/* Article Meta */}
            <div className="mb-12 reveal">
              <div className="flex items-center gap-4 mb-8">
                <span className="bg-edtech-blue/20 backdrop-blur-sm text-edtech-blue px-4 py-2 rounded-full text-sm font-medium border border-edtech-blue/20">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ FEATURED
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-edtech-green">
                  {post.title}
                </span>
              </h1>

              <p className="text-white/80 text-xl md:text-2xl leading-relaxed mb-10 max-w-4xl">
                {post.excerpt}
              </p>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-white/10">
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {post.author.avatar ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/20">
                      <img 
                        src={post.author.avatar.startsWith('http') ? post.author.avatar : `${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${post.author.avatar}`}
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (!(e.target as HTMLImageElement).dataset.usedFallback) {
                            const target = e.target as HTMLImageElement;
                            target.dataset.usedFallback = 'true';
                            target.style.display = 'none';
                            target.parentElement!.classList.add('bg-gradient-to-br', 'from-edtech-green/20', 'to-edtech-orange/20', 'flex', 'items-center', 'justify-center');
                            
                            // Add fallback letter
                            const fallbackLetter = document.createElement('span');
                            fallbackLetter.className = 'font-bold text-xl';
                            fallbackLetter.textContent = post.author.name.charAt(0);
                            target.parentElement!.appendChild(fallbackLetter);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-edtech-green/20 to-edtech-orange/20 rounded-full flex items-center justify-center border border-white/10">
                      <span className="font-bold text-xl">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-lg">{post.author.name}</div>
                    <div className="text-white/60">{post.author.role}</div>
                  </div>
                </div>

                {/* Article Meta */}
                <div className="flex items-center gap-8 text-white/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Article Content - LIGHT THEME */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Sidebar - Mobile: Show first, Desktop: Show on right */}
              <div className="lg:col-span-1 lg:order-2 reveal">
                <div className="sticky top-24 space-y-8">
                  {/* Table of Contents */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-edtech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      Table of Contents
                    </h3>
                    <div className="space-y-2 text-sm">
                      {headings.map((heading, index) => {
                        const isActive = activeSection === heading.id;
                        
                        return (
                          <div 
                            key={index} 
                            onClick={() => scrollToSection(heading.id)}
                            className={`cursor-pointer p-2 rounded ${
                              isActive 
                                ? 'text-edtech-blue font-medium' 
                                : 'text-gray-600 hover:text-edtech-blue'
                            } ${
                              heading.level === 1 ? 'font-semibold' : 
                              heading.level === 2 ? 'ml-4' : 'ml-8'
                            }`}
                          >
                            {heading.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Author Bio - Hide on mobile to save space */}
                  <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-edtech-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      About the Author
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      {post.author.avatar ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                          <img 
                            src={post.author.avatar.startsWith('http') ? post.author.avatar : `${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${post.author.avatar}`}
                            alt={post.author.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              if (!(e.target as HTMLImageElement).dataset.usedFallback) {
                                const target = e.target as HTMLImageElement;
                                target.dataset.usedFallback = 'true';
                                target.style.display = 'none';
                                target.parentElement!.classList.add('bg-gradient-to-br', 'from-edtech-green/20', 'to-edtech-orange/20', 'flex', 'items-center', 'justify-center');
                                
                                // Add fallback letter
                                const fallbackLetter = document.createElement('span');
                                fallbackLetter.className = 'font-bold text-xl text-edtech-blue';
                                fallbackLetter.textContent = post.author.name.charAt(0);
                                target.parentElement!.appendChild(fallbackLetter);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-edtech-green/20 to-edtech-orange/20 rounded-full flex items-center justify-center border-2 border-gray-100">
                          <span className="font-bold text-xl text-edtech-blue">
                            {post.author.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{post.author.name}</div>
                        <div className="text-edtech-blue text-sm font-medium">{post.author.role}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {post.author.name} is a {post.author.role.toLowerCase()} with extensive experience 
                      in the field. They regularly contribute insights on the latest industry trends and 
                      best practices.
                    </p>
                  </div>

                  {/* Newsletter Signup - Hide on mobile to save space */}
                  <div className="hidden lg:block bg-gradient-to-br from-edtech-blue/5 to-edtech-green/5 rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-edtech-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Stay Updated
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Get the latest articles and insights delivered to your inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Your email"
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-edtech-blue focus:ring-2 focus:ring-edtech-blue/20 transition-all duration-300"
                      />
                      <button className="w-full bg-gradient-to-r from-edtech-green to-edtech-orange text-black py-3 rounded-lg font-semibold text-sm hover:brightness-110 transition-all duration-300 hover:scale-105">
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content - Mobile: Show second, Desktop: Show on left */}
              <div className="lg:col-span-3 lg:order-1 reveal">
                {/* Featured Image */}
                <div className="aspect-video rounded-3xl mb-12 border border-gray-200 shadow-lg overflow-hidden group">
                  {post.image ? (
                    <img 
                      src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${post.image}`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        if (!(e.target as HTMLImageElement).dataset.usedFallback) {
                          const target = e.target as HTMLImageElement;
                          target.dataset.usedFallback = 'true';
                          target.style.display = 'none';
                          
                          // Add fallback
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className = "w-full h-full bg-gradient-to-br from-edtech-blue/10 to-edtech-green/10 flex items-center justify-center";
                          fallbackDiv.innerHTML = `
                            <div class="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                              <svg class="w-10 h-10 text-edtech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          `;
                          target.parentElement!.appendChild(fallbackDiv);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-edtech-blue/10 to-edtech-green/10 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-10 h-10 text-edtech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                  <div className="prose prose-lg max-w-none article-content">
                    <div 
                      className="text-gray-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: post.content
                          // Main headings (H1) with IDs
                          .replace(/^# (.+)$/gm, (_, title) => {
                            const id = generateSlug(title);
                            return `<h1 id="${id}" class="text-3xl md:text-4xl font-bold mb-6 mt-8 text-edtech-blue border-b-2 border-edtech-green/20 pb-3 first:mt-0">${title}</h1>`;
                          })
                          // Section headings (H2) with IDs
                          .replace(/^## (.+)$/gm, (_, title) => {
                            const id = generateSlug(title);
                            return `<h2 id="${id}" class="text-2xl md:text-3xl font-bold mb-5 mt-8 text-edtech-blue">${title}</h2>`;
                          })
                          // Subsection headings (H3) with IDs
                          .replace(/^### (.+)$/gm, (_, title) => {
                            const id = generateSlug(title);
                            return `<h3 id="${id}" class="text-xl md:text-2xl font-semibold mb-4 mt-6 text-gray-900">${title}</h3>`;
                          })
                          // Sub-subsection headings (H4)
                          .replace(/^#### (.+)$/gm, '<h4 class="text-lg md:text-xl font-semibold mb-3 mt-5 text-gray-800">$1</h4>')
                          // Bold text - simple replacement
                          .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-edtech-blue">$1</strong>')
                          // Convert line breaks to HTML
                          .replace(/\n\n/g, '</p><p class="mb-4 text-base md:text-lg leading-relaxed text-gray-700">')
                          // Wrap in initial paragraph tag
                          .replace(/^/, '<p class="mb-4 text-base md:text-lg leading-relaxed text-gray-700">')
                          // Close final paragraph
                          .replace(/$/, '</p>')
                          // Clean up empty paragraphs
                          .replace(/<p[^>]*>\s*<\/p>/g, '')
                      }}
                    />
                  </div>

                  {/* Tags */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Related Topics</h3>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gradient-to-r from-edtech-blue/10 to-edtech-green/10 hover:from-edtech-blue/20 hover:to-edtech-green/20 text-gray-700 hover:text-edtech-blue px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border border-gray-200 hover:border-edtech-blue/30 hover:shadow-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-900">Share this article</h3>
                    <div className="flex items-center gap-4 flex-wrap">
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </a>
                      
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </a>
                      
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </a>
                      
                      <button
                        onClick={socialLinks.copy}
                        className="flex items-center gap-3 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Related Posts - DARK THEME */}
        {relatedPosts.length > 0 && (
          <section className="py-16 md:py-24 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5" />
            
            <div className="relative mx-auto max-w-7xl px-6">
              <div className="text-center mb-16 reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Related <span className="text-edtech-green">Articles</span>
                </h2>
                <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed">
                  Continue your learning journey with these related insights and topics.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group">
                    <div className="aspect-video relative overflow-hidden">
                      {relatedPost.image ? (
                        <div className="w-full h-full">
                          <img 
                            src={relatedPost.image.startsWith('http') ? relatedPost.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${relatedPost.image}`}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              if (!(e.target as HTMLImageElement).dataset.usedFallback) {
                                const target = e.target as HTMLImageElement;
                                target.dataset.usedFallback = 'true';
                                target.parentElement!.classList.add('bg-gradient-to-br', 'from-edtech-blue/20', 'to-edtech-green/20');
                                target.style.display = 'none';
                                
                                // Create fallback icon
                                const fallback = document.createElement('div');
                                fallback.className = "absolute inset-0 flex items-center justify-center";
                                fallback.innerHTML = `
                                  <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg class="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                `;
                                target.parentElement!.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-edtech-blue/20 to-edtech-green/20 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-edtech-blue/30 backdrop-blur-sm text-edtech-blue px-3 py-1 rounded-full text-xs font-medium border border-edtech-blue/20">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{relatedPost.readTime} min</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-edtech-green transition-colors group-hover:text-edtech-green">
                        <Link to={`/blog/${relatedPost.slug}`} className="block">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      
                      <p className="text-white/70 text-sm line-clamp-3 mb-6 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {relatedPost.author.avatar ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img 
                                src={relatedPost.author.avatar.startsWith('http') ? relatedPost.author.avatar : `${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${relatedPost.author.avatar}`}
                                alt={relatedPost.author.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  if (!(e.target as HTMLImageElement).dataset.usedFallback) {
                                    const target = e.target as HTMLImageElement;
                                    target.dataset.usedFallback = 'true';
                                    target.style.display = 'none';
                                    target.parentElement!.classList.add('bg-gradient-to-br', 'from-edtech-green/20', 'to-edtech-orange/20', 'flex', 'items-center', 'justify-center');
                                    
                                    // Add fallback letter
                                    const fallbackLetter = document.createElement('span');
                                    fallbackLetter.className = 'text-xs font-bold';
                                    fallbackLetter.textContent = relatedPost.author.name.charAt(0);
                                    target.parentElement!.appendChild(fallbackLetter);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-edtech-green/20 to-edtech-orange/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {relatedPost.author.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-xs text-white/80 font-medium">{relatedPost.author.name}</div>
                            <div className="text-xs text-white/50">{relatedPost.author.role}</div>
                          </div>
                        </div>
                        
                        <Link 
                          to={`/blog/${relatedPost.slug}`}
                          className="text-edtech-green hover:text-edtech-orange transition-colors text-sm font-medium"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center mt-16 reveal">
                <Link to="/blog" className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all duration-300 hover:scale-105">
                  View All Articles
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: CTA Section - ENHANCED DARK THEME */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue relative overflow-hidden">
          {/* <div className="absolute inset-0">
            <TechBackground className="opacity-10" />
          </div> */}
          
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 reveal">
              <div className="mb-8">
                <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-white/10 text-white border border-white/20">
                  🚀 Ready to Level Up?
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Knowledge</span> into Action
              </h2>
              
              <p className="text-white/80 text-xl mb-10 leading-relaxed max-w-3xl mx-auto">
                Don't just read about it—master it! Join thousands of learners who've turned insights 
                into career-changing skills with our hands-on courses taught by industry experts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
                <Link 
                  to="/programs" 
                  className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  🎯 Explore Our Programs
                </Link>
                <Link 
                  to="/contact" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  💬 Get Free Consultation
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-white/20">
                <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-green" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">4.8/5 Student Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">1000+ Success Stories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Industry Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
