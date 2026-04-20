import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Star, Target } from 'lucide-react';
import { motion } from 'motion/react';

export function FacultySection() {
  return (
    <section id="faculty" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10">
                <Card className="overflow-hidden border-4 border-zinc-50 rounded-2xl shadow-xl">
                  <div className="aspect-[4/5] relative">
                    <img
                      src="https://picsum.photos/seed/nehalgupta/800/1000"
                      alt="Nehal Gupta"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-white">Nehal Gupta</h3>
                      <p className="text-zinc-200 text-[10px] font-bold uppercase tracking-wider">Founder & Director</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Experience Badge */}
              <div className="absolute -bottom-4 -right-4 bg-zinc-900 text-white p-4 rounded-xl shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-lg font-bold leading-none">10+ Years</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="space-y-3">
                <Badge className="bg-zinc-100 text-zinc-900 border-zinc-200 hover:bg-zinc-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                  Leadership & Vision
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                  Empowering Students <br />
                  <span className="text-zinc-400">Since 2022</span>
                </h2>
              </div>

              <div className="space-y-4 text-zinc-600 text-base leading-relaxed">
                <p>
                  Yuva Classes was founded in 2022 by <span className="font-bold text-zinc-900">Nehal Gupta</span> with a clear vision — to provide the right guidance, mentorship, and learning environment to students preparing for competitive examinations.
                </p>
                <p>
                  Yuva Classes was established to bridge the gap in structured learning by offering a focused, student-centric approach that combines expert teaching, well-organized study plans, and a motivating environment.
                </p>
                <p>
                  Nehal Sir has dedicated himself to delivering high-quality education at the most affordable cost possible, ensuring that financial limitations do not become a barrier to success.
                </p>
                <p>
                  Through consistent efforts and personalized mentorship, Yuva Classes has already impacted the lives of thousands of students across Bihar, turning their dreams into reality.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-zinc-900">10k+</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Students</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-zinc-900" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-zinc-900">95%</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Success</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
