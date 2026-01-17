
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import TechBackground from "../TechBackground";
import useRevealOnScroll from "../hooks/useRevealOnScroll";
import { getBlogPostsData, getBlogCategoriesData, getFeaturedBlogPostsData } from "../utils/dataAdapter";
import type { BlogPost } from "../types";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Add scroll reveal animations
  useRevealOnScroll();

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        const [postsData, categoriesData, featuredData] = await Promise.all([
          getBlogPostsData(),
          getBlogCategoriesData(),
          getFeaturedBlogPostsData()
        ]);
        
        // Make sure we have all posts including featured ones
        const allPosts = [...postsData];
        
        // Add any featured posts not already in the main posts array
        featuredData.forEach(featuredPost => {
          if (!allPosts.some(post => post.id === featuredPost.id)) {
            allPosts.push(featuredPost);
          }
        });
        
        setBlogPosts(allPosts);
        setCategories(categoriesData);
        setFeaturedPosts(featuredData);
        

      } catch (error) {
        console.error('Error loading blog data:', error);
        setBlogPosts([]);
        setCategories([]);
        setFeaturedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  // Initialize scroll reveal for dynamic content after data loads
  useEffect(() => {
    if (!loading && (blogPosts.length > 0 || featuredPosts.length > 0)) {
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.1 }
        );
        
        const blogRevealElements = document.querySelectorAll('.blog-reveal');
        blogRevealElements.forEach((el) => observer.observe(el));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [loading, blogPosts.length, featuredPosts.length]);

  const allCategories = useMemo(() => ['All', ...categories], [categories]);
  
  // Memoize filtered posts for better performance
  const filteredPosts = useMemo(() => 
    blogPosts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    }), 
    [blogPosts, selectedCategory, searchTerm]
  );

  // Memoize date formatter to avoid recreation on each render
  const formatDate = useMemo(() => (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Background */}
      {/* <div className="fixed inset-0 -z-10">
        <TechBackground className="mix-blend-screen opacity-30" />
      </div>
       */}
      <main className="pt-20">
        {/* SECTION 1: Hero Section - BRAND COLORS */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          {/* <TechBackground className="opacity-15" /> */}
          
          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <div className="badge-hero mx-auto w-max mb-8 reveal">
              <span>📝</span><span>TECH INSIGHTS & TUTORIALS</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight reveal">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Tech Insights</span> & Tutorials
            </h1>
            <p className="text-white/80 text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed reveal">
              Stay ahead of the curve with <span className="text-edtech-green font-semibold">cutting-edge insights</span>, expert tutorials, and industry trends 
              that shape the future of technology and <span className="text-edtech-orange font-semibold">accelerate your career</span> growth
            </p>

            {/* Blog Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-12 blog-reveal reveal">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-edtech-green mb-2">{blogPosts.length}+</div>
                <div className="text-white/80 text-sm font-medium">Expert Articles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-edtech-orange mb-2">{categories.length}</div>
                <div className="text-white/80 text-sm font-medium">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">Weekly</div>
                <div className="text-white/80 text-sm font-medium">New Content</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-edtech-red mb-2">Expert</div>
                <div className="text-white/80 text-sm font-medium">Authors</div>
              </div>
            </div>

            {/* Enhanced Search and Filter */}
            <div className="max-w-5xl mx-auto reveal">
              <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Find Your Next Read</h3>
                <div className="flex flex-col gap-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search articles, tutorials, technologies, or topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 border-2 border-white/20 rounded-2xl pl-16 pr-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-edtech-green/50 focus:bg-white/15 transition-all text-lg"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {allCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-edtech-green to-edtech-orange text-black shadow-lg'
                            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/20'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Featured Posts - LIGHT THEME */}
        {selectedCategory === 'All' && !searchTerm && (
          <section className="py-16 md:py-20 bg-gradient-to-br from-white via-gray-50 to-white">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center mb-12 reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  <span className="text-edtech-blue">Featured</span> Articles
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover our most popular and <span className="text-edtech-blue font-semibold">insightful articles</span> that are <span className="text-edtech-orange font-semibold">shaping the tech industry</span>
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-12 blog-reveal reveal">
                {featuredPosts.slice(0, 2).map((post) => (
                  <article key={post.id} className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-[1.02]">
                    {/* Featured Badge */}
                    <div className="absolute top-6 right-6 z-10">
                      <span className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        ⭐ FEATURED
                      </span>
                    </div>

                    {/* Featured Image */}
                    <div className="aspect-video relative overflow-hidden">
                      {post.image ? (
                        <div className="w-full h-full">
                          <img 
                            src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${post.image}`} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              if (!(e.target as HTMLImageElement).dataset.usedFallback) {
                                const target = e.target as HTMLImageElement;
                                target.dataset.usedFallback = 'true';
                                target.parentElement!.classList.add('bg-gradient-to-br', 'from-edtech-blue/10', 'to-edtech-green/10');
                                target.style.display = 'none';
                                
                                // Create fallback icon
                                const fallback = document.createElement('div');
                                fallback.className = "absolute inset-0 flex items-center justify-center";
                                fallback.innerHTML = `
                                  <div class="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg class="w-8 h-8 text-edtech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                  </div>
                                `;
                                target.parentElement!.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-edtech-blue/10 to-edtech-green/10 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-edtech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      </div>
                      )}
                      <div className="absolute top-6 left-6 z-10">
                        <span className="bg-edtech-blue/20 backdrop-blur-sm text-edtech-blue px-3 py-1.5 rounded-full text-sm font-medium border border-edtech-blue/20">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-4 line-clamp-2 text-gray-900 hover:text-edtech-blue transition-colors group-hover:text-edtech-blue">
                        <Link to={`/blog/${post.slug}`} className="block">
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {post.author.avatar ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
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
                                  fallbackLetter.className = 'font-bold text-edtech-blue';
                                  fallbackLetter.textContent = post.author.name.charAt(0);
                                  target.parentElement!.appendChild(fallbackLetter);
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-edtech-green/20 to-edtech-orange/20 rounded-full flex items-center justify-center border-2 border-gray-100">
                            <span className="font-bold text-edtech-blue">
                              {post.author.name.charAt(0)}
                            </span>
                          </div>
                        )}
                          <div>
                            <div className="font-semibold text-gray-900">{post.author.name}</div>
                            <div className="text-sm text-gray-500">{post.author.role}</div>
                          </div>
                        </div>
                        
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-6 py-3 rounded-full font-semibold hover:brightness-110 transition-all duration-300 hover:scale-105 text-sm"
                        >
                          Read Article →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: All Posts Grid - DARK */}
        <section className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-deep via-bg-deep to-edtech-blue/5" />
          
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-between mb-12 reveal">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  All <span className="text-edtech-orange">Articles</span>
                </h2>
                <p className="text-white/70 text-lg">
                  Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </p>
              </div>
              
              {(selectedCategory !== 'All' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchTerm('');
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-white/70 text-lg">Loading blog posts...</div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 blog-reveal reveal">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group relative">
                    {/* Blog Image */}
                    {post.image && (
                      <div className="w-full h-44 overflow-hidden">
                        <img 
                          src={post.image.startsWith('http') ? post.image : `${import.meta.env.VITE_API_BASE_URL}/uploads/blog-images/${post.image}`} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            if (!(e.target as HTMLImageElement).dataset.usedFallback) {
                              const target = e.target as HTMLImageElement;
                              target.dataset.usedFallback = 'true';
                              target.parentElement!.classList.add('bg-gradient-to-br', 'from-edtech-blue/20', 'to-edtech-green/20');
                              target.style.display = 'none';
                              
                              // Create fallback icon
                              const fallback = document.createElement('div');
                              fallback.className = "w-full h-full flex items-center justify-center";
                              fallback.innerHTML = `
                                <svg class="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              `;
                              target.parentElement!.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Article Content */}
                    <div className="p-6">
                    {/* Article Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-black/30 text-white/80 rounded-full text-xs font-medium border border-white/20">
                        {post.category}
                      </span>
                        {!post.image && (
                      <div className="p-3 rounded-xl bg-gradient-to-br from-edtech-blue/20 to-edtech-green/20">
                        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                        )}
                    </div>

                    {/* Article Content */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-edtech-orange transition-colors">
                        <Link to={`/blog/${post.slug}`} className="block">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Article Meta */}
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-6">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        {post.readTime} min read
                      </span>
                    </div>

                    {/* Author and Read More */}
                    <div className="flex items-center justify-between mb-4">
                                              <div className="flex items-center gap-3">
                          {post.author.avatar ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
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
                                    fallbackLetter.className = 'text-xs font-bold text-white';
                                    fallbackLetter.textContent = post.author.name.charAt(0);
                                    target.parentElement!.appendChild(fallbackLetter);
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-edtech-green/20 to-edtech-orange/20 rounded-full flex items-center justify-center border border-white/20">
                              <span className="text-xs font-bold text-white">
                                {post.author.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-xs text-white/80 font-medium">{post.author.name}</div>
                            <div className="text-xs text-white/50">{post.author.role}</div>
                          </div>
                        </div>
                      
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-edtech-green hover:text-edtech-orange transition-colors text-sm font-medium"
                      >
                        Read More →
                      </Link>
                    </div>

                    {/* Tags */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded border border-white/10">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-white/50 px-2 py-1">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    </div> {/* End of p-6 container */}
                    
                    {/* Featured Badge */}
                    {post.featured && (
                      <span className="absolute top-4 right-4 bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-2.5 py-1 text-xs font-bold rounded-full shadow-lg">
                        FEATURED
                      </span>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-4">No articles found</h3>
                <p className="text-white/70 text-lg mb-8">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-8 py-3 rounded-full font-semibold hover:brightness-110 transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: Newsletter Section - LIGHT */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-white via-gray-50 to-white">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 reveal">
              <div className="w-20 h-20 bg-gradient-to-br from-edtech-green/20 to-edtech-orange/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-gray-100">
                <svg className="w-10 h-10 text-edtech-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Never Miss an <span className="text-edtech-blue">Update</span>
              </h2>
              <p className="text-gray-600 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
                Subscribe to our newsletter and get the latest tech insights, tutorials, and career advice 
                delivered straight to your inbox every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-edtech-blue focus:ring-2 focus:ring-edtech-blue/20 transition-all text-lg"
                />
                <button className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-8 py-4 rounded-xl font-bold hover:brightness-110 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Weekly insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: CTA Section - ENHANCED DARK */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-edtech-blue via-bg-deep to-edtech-blue relative overflow-hidden">
          {/* <div className="absolute inset-0">
            <TechBackground className="opacity-10" />
          </div> */}
          
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 reveal">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white border border-white/20">
                  🚀 Ready to Transform Your Career?
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-edtech-green to-edtech-orange">Knowledge</span> into Action
              </h2>
              
              <p className="text-white/80 text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
                Don't just read about technology - <span className="text-edtech-green font-semibold">master it hands-on</span> with our comprehensive courses 
                designed by <span className="text-edtech-orange font-semibold">industry experts</span> who've built real-world solutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/programs" 
                  className="bg-gradient-to-r from-edtech-green to-edtech-orange text-black px-8 py-4 rounded-full font-bold text-lg hover:brightness-110 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  🎯 Explore Our Programs
                </Link>
                <Link 
                  to="/contact" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  💬 Get Free Consultation
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-edtech-green" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm">4.8/5 Rating</span>
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
