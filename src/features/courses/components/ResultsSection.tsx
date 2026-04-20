import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAchievers } from '@/features/testimonials/hooks';

export function ResultsSection() {
  const { data: achievers, isLoading } = useAchievers();

  if (isLoading) {
    return (
      <section id="results" className="py-24 bg-zinc-50/50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </section>
    );
  }

  if (!achievers || achievers.length === 0) return null;

  // Duplicate the achievers for seamless infinite scroll
  const doubledAchievers = [...achievers, ...achievers];

  return (
    <section id="results" className="py-24 bg-zinc-50/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
              <Trophy className="w-3 h-3" />
              Wall of Fame
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
              Our Pride: <span className="text-zinc-500">Selected Students</span>
            </h2>
            <p className="text-zinc-600 text-lg">
              Every year, hundreds of our students secure their dream government jobs. Here are some of our recent achievers.
            </p>
          </div>
        </div>
      </div>

      {/* Infinite Horizontal Scroll */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-50/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-50/50 to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex gap-6 px-4"
          animate={{
            x: [0, -2000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          whileHover={{ animationPlayState: 'paused' }}
          style={{ width: 'fit-content' }}
        >
          {doubledAchievers.map((achiever, index) => (
            <Card 
              key={`${achiever.id}-${index}`} 
              className="w-[280px] shrink-0 overflow-hidden border-zinc-200/60 bg-white hover:border-zinc-900 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 flex items-center justify-center">
                {achiever.image_url ? (
                  <img
                    src={achiever.image_url}
                    alt={achiever.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Trophy className="w-12 h-12 text-zinc-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Selected</span>
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{achiever.name}</h3>
                </div>
              </div>
              
              <CardContent className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Exam</span>
                    <span className="text-sm font-bold text-zinc-900">{achiever.exam}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Score/Rank</span>
                    <span className="text-sm font-bold text-zinc-900">{achiever.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Year</span>
                    <span className="text-sm font-bold text-zinc-900">{achiever.year}</span>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-black uppercase tracking-tighter">Top Achiever</span>
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mt-16 text-center">
        <p className="text-zinc-400 text-sm font-medium">
          * Showing top achievers from recent exams. Results are updated regularly.
        </p>
      </div>
    </section>
  );
}

