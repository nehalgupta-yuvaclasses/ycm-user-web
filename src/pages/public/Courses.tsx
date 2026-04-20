import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Info } from 'lucide-react';
import { useCourses } from '@/features/courses/hooks';
import { CourseCard } from '@/features/courses/components/CourseCard';
import { CourseSkeleton } from '@/features/courses/components/CourseSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const sortOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
];

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const { data: courses, isLoading, isError } = useCourses(sortBy);

  const filteredCourses = (courses || []).filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.author || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
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
              Explore <br className="hidden md:block" />
              our <span className="text-zinc-400">Courses</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed"
            >
              Master competitive exams with India's most structured and result-oriented batches. Learn from the legends.
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
                  placeholder="Search courses, instructors, keywords..." 
                  className="pl-12 md:pl-14 pr-12 h-14 md:h-16 bg-white border-zinc-200 rounded-2xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] text-base transition-all duration-300 placeholder:text-zinc-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-zinc-100 rounded-full transition-all text-zinc-400 hover:text-zinc-900"
                  >
                    <SlidersHorizontal className="w-4 h-4 rotate-90" />
                  </button>
                )}

                {!searchQuery && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 pointer-events-none">
                    <kbd className="px-2 py-1 bg-zinc-50 border border-zinc-100 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">⌘ K</kbd>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Available Batches</h2>
              <p className="text-sm text-zinc-500 font-medium">Showing {filteredCourses.length} results from our total library</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">Sort</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-56 h-11 md:h-12 rounded-xl border-zinc-200 bg-white font-bold text-zinc-900 focus:ring-2 focus:ring-zinc-900/5 transition-all">
                  <div className="flex items-center gap-2.5">
                    <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-1.5 min-w-[200px]">
                  {sortOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="rounded-xl font-semibold py-2.5 px-3 focus:bg-zinc-50 focus:text-zinc-900 cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(6)].map((_, i) => <CourseSkeleton key={i} />)}
              </div>
            ) : isError ? (
              <div className="py-24 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                <Info className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900">Error loading courses</h3>
                <p className="text-zinc-500">Please try again later</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 md:py-32 text-center">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                  <Search className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2 md:mb-3">No results found</h3>
                <p className="text-sm md:text-base text-zinc-500 max-w-sm mx-auto mb-8 font-medium">
                  We couldn't find any courses matching your keywords. Try again with different search terms.
                </p>
                <Button onClick={() => setSearchQuery('')} className="bg-zinc-900 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-zinc-900/10">
                  Reset Search
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
