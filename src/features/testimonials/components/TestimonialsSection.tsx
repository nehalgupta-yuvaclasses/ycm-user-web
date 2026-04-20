import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTestimonials } from '@/features/testimonials/hooks';

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = useTestimonials();

  if (isLoading) {
    return (
      <section className="py-12 bg-zinc-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) return null;

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-12 bg-zinc-50 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 mb-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-zinc-200 shadow-sm">
            <span className="flex h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">Testimonials</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Voices of Our <span className="text-zinc-400">Achievers</span>
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Real feedback from students who transformed their journey.
          </p>
        </motion.div>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused] py-2">
          {duplicatedTestimonials.map((testimonial, index) => (
            <div key={`${testimonial.id}-${index}`} className="px-2.5 w-[280px] md:w-[350px] shrink-0">
              <Card className="bg-white border-zinc-100 relative overflow-hidden h-full shadow-sm hover:shadow-md transition-all duration-500 group/card">
                <CardContent className="p-6">
                  <Quote className="absolute top-5 right-5 w-10 h-10 text-zinc-50 group-hover/card:text-zinc-100 transition-colors duration-500" />
                  
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-zinc-700 text-xs md:text-sm leading-relaxed mb-6 relative z-10 whitespace-normal font-medium italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-50">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-[10px] font-bold text-zinc-400">
                      {testimonial.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-xs">{testimonial.name}</h4>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Achiever</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Gradient overlays for smooth fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-zinc-50 via-zinc-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-zinc-50 via-zinc-50/80 to-transparent z-10 pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 mt-8 text-center" />
    </section>
  );
}

