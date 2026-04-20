import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  FileText, 
  Download, 
  Star, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  Loader2,
  Video,
  Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useResources } from '@/features/resources/hooks';
import { ResourceSkeleton } from '@/features/resources/components/ResourceSkeleton';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: resources, isLoading, isError } = useResources();

  const filteredResources = useMemo(() => {
    return (resources || []).filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (res.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || res.type === typeFilter;
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });
  }, [resources, searchQuery, typeFilter, sortBy]);

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
              Learning <br className="hidden md:block" />
              <span className="text-zinc-400">Resources</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed"
            >
              Premium notes, solved papers, and expert capsules designed to streamline your exam preparation.
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
                  placeholder="Search resources, titles, subjects..." 
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
      <section className="py-8 border-b border-zinc-50 bg-white sticky top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 w-[120px] rounded-xl border-zinc-100 bg-zinc-50/50 font-bold text-[13px] ring-0 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                    <SelectItem value="all" className="rounded-xl font-bold py-2 focus:bg-zinc-900 focus:text-white">All Resources</SelectItem>
                    <SelectItem value="pdf" className="rounded-xl font-bold py-2 focus:bg-zinc-900 focus:text-white">PDFs</SelectItem>
                    <SelectItem value="video" className="rounded-xl font-bold py-2 focus:bg-zinc-900 focus:text-white">Videos</SelectItem>
                    <SelectItem value="link" className="rounded-xl font-bold py-2 focus:bg-zinc-900 focus:text-white">Links</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">Sorted by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-full lg:w-56 rounded-xl border-zinc-200 bg-white font-bold text-zinc-900 ring-0 focus:ring-2 focus:ring-zinc-900/5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl p-1.5">
                  <SelectItem value="newest" className="rounded-xl font-bold py-3 focus:bg-zinc-900 focus:text-white">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ResourceSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="py-24 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                <Info className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900">Error loading resources</h3>
                <p className="text-zinc-500">Please try again later</p>
              </div>
            ) : filteredResources.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredResources.map((resource, index) => (
                  <ResourceCard key={resource.id} resource={resource} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-zinc-300" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No resources found</h3>
                <p className="text-zinc-500 max-w-xs mx-auto text-sm font-medium">
                  We couldn't find any resources matching your current search. Try adjusting your filters.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                  }}
                  className="mt-8 bg-zinc-900 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-zinc-900/10"
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

function ResourceCard({ resource, index }: { resource: any; index: number }) {
  const Icon = resource.type === 'pdf' ? FileText : resource.type === 'video' ? Video : LinkIcon;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/resources/${resource.id}`} className="group block">
        <div className="rounded-2xl border border-zinc-100 bg-white overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 flex flex-col h-full">
          {/* Visual Header */}
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform duration-500">
               <Icon className="w-8 h-8" />
            </div>
            {/* Type Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/95 backdrop-blur shadow-sm text-zinc-900 border-none font-bold text-[10px] h-6 uppercase px-2">
                {resource.type}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-zinc-900 line-clamp-2 leading-tight group-hover:text-zinc-700 transition-colors mb-2">
              {resource.title}
            </h3>
            <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
              {resource.description}
            </p>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Pricing</span>
                <span className="text-lg font-black text-emerald-600 tracking-tight">Free</span>
              </div>
              
              <div className="flex items-center gap-2 group/btn translate-x-2">
                <span className="text-[13px] font-bold text-zinc-400 group-hover/btn:text-zinc-900 transition-colors">Details</span>
                <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center group-hover/btn:bg-zinc-900 group-hover/btn:border-zinc-900 transition-all shadow-sm">
                  <ChevronRight className="w-4 h-4 group-hover/btn:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
