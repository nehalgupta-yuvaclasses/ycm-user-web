import * as React from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, Clock, ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBlogs } from '@/features/blogs/hooks';
import { BlogSkeleton } from '@/features/blogs/components/BlogSkeleton';

export default function BlogListing() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  const { data: blogs, isLoading, isError } = useBlogs();

  const categories = ['All', ...new Set((blogs || []).map(blog => blog.keywords?.[0] || 'General'))];

  const filteredBlogs = (blogs || []).filter(blog => {
    const category = blog.keywords?.[0] || 'General';
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (blog.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 overflow-hidden bg-zinc-50 border-b border-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-left space-y-6 md:space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight leading-[1.1]"
            >
              Insights & <br className="hidden md:block" />
              <span className="text-zinc-400">Articles</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed"
            >
              Learn, grow, and stay ahead with stories and guides curated by our top educators and industry experts.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-2xl group"
            >
              <div className="relative">
                <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 transition-colors group-focus-within:text-zinc-900" />
                <Input 
                  type="text" 
                  placeholder="Search articles by title, category, or keywords..." 
                  className="pl-12 md:pl-14 pr-12 h-14 md:h-16 bg-white border-zinc-200 rounded-2xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] text-base transition-all duration-300 placeholder:text-zinc-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 border-b border-zinc-50 bg-white sticky top-[72px] z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block text-nowrap">Categories</span>
              <div className="flex items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                      selectedCategory === cat
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/10'
                        : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium whitespace-nowrap">
              Showing <span className="text-zinc-900 font-bold">{filteredBlogs.length}</span> articles
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="py-24 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
              <Info className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-900">Error loading articles</h3>
              <p className="text-zinc-500">Please try again later</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredBlogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 md:py-32 text-center">
              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-3">No articles found</h3>
              <p className="text-sm md:text-base text-zinc-500 max-w-sm mx-auto mb-8 font-medium">
                We couldn't find any articles matching your search. Please try different keywords or reset filters.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} className="bg-zinc-900 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-zinc-900/10">
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

function BlogCard({ blog, index }: { blog: any; index: number }) {
  const category = blog.keywords?.[0] || 'General';
  // Calculate approximate read time: ~200 words per minute
  const wordCount = JSON.stringify(blog.content).split(' ').length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/blog/${blog.slug}`} className="group block">
        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col h-full">
          {/* Thumbnail Wrapper */}
          <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
            {blog.cover_image ? (
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                <Info className="w-12 h-12" />
              </div>
            )}
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/95 backdrop-blur shadow-sm text-zinc-900 border-none font-bold text-[10px] h-6 uppercase tracking-wider px-2">
                {category}
              </Badge>
            </div>
            
            {/* Read Time Overlay */}
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/95 backdrop-blur shadow-sm border border-black/5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-bold text-zinc-900">{readTime} min read</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-3">
              <Calendar className="w-3 h-3" />
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            
            <h3 className="text-xl font-bold text-zinc-900 leading-tight group-hover:text-zinc-700 transition-colors mb-3 line-clamp-2">
              {blog.title}
            </h3>
            
            <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed mb-6 font-medium">
              {blog.excerpt}
            </p>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-100 overflow-hidden">
                  <span className="text-[10px] font-bold text-zinc-400">YC</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Team</span>
                  <span className="text-xs font-bold text-zinc-900">Yuva Classes</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 group/btn text-zinc-300 group-hover:text-zinc-900 transition-all">
                <span className="text-[13px] font-bold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">Read</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

