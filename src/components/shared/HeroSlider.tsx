import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthModal } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useBanners } from '@/features/platform/hooks';
import { cn } from '@/lib/utils';

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { openAuthModal } = useAuthModal();
  const { data: banners, isLoading } = useBanners();

  const slides = banners && banners.length > 0 ? banners : [
    {
      id: 'default-1',
      title: 'Your Journey to Government Jobs Starts Here',
      image_url: 'https://picsum.photos/seed/hero1/1200/800',
    }
  ];

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  if (isLoading) {
    return (
      <div className="h-[600px] md:h-[700px] flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <section 
      className="relative h-[600px] md:h-[700px] overflow-hidden bg-zinc-50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/60 to-white z-10 md:hidden" />
          
          <img
            src={slides[current].image_url}
            alt={slides[current].title || 'Banner'}
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />

          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-2xl">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]"
              >
                {slides[current].title || 'Empowering Students for Success'}
              </motion.h1>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/courses">
                  <Button size="lg" className="h-12 px-8 bg-zinc-900 text-white hover:bg-zinc-800 text-lg gap-2 rounded-xl">
                    Explore Courses
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  size="lg" 
                  onClick={openAuthModal}
                  className="h-12 px-8 border-zinc-200 text-lg gap-2 rounded-xl"
                >
                  Join Community
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  current === i ? 'w-8 bg-zinc-900' : 'bg-zinc-300'
                )}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
    </section>
  );
}
