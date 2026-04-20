import * as React from 'react';
import { motion } from 'motion/react';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface ContinueLearningHeroProps {
  courseTitle: string;
  lastAccessed: string;
  progress: number;
}

export function ContinueLearningHero({ courseTitle, lastAccessed, progress }: ContinueLearningHeroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group relative bg-zinc-900 rounded-[2rem] p-8 text-white overflow-hidden border-none shadow-2xl shadow-zinc-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              <Clock className="w-3 h-3" />
              Last Accessed {lastAccessed}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight max-w-xl">
                {courseTitle}
              </h3>
              <p className="text-zinc-400 text-sm font-medium">Continue where you left off and stay on track.</p>
            </div>

            <div className="space-y-3 max-w-md">
              <div className="flex justify-between text-xs font-bold text-zinc-400">
                <span>Course Progress</span>
                <span className="text-white">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-white/10" />
            </div>
          </div>

          <Button className="h-16 px-8 bg-white text-zinc-900 hover:bg-zinc-100 rounded-2xl font-bold text-lg gap-3 shadow-xl shadow-white/10 group-hover:scale-105 transition-transform shrink-0">
            <Play className="w-5 h-5 fill-current" />
            Continue Learning
          </Button>
        </div>
        
        {/* Decorative background glass effect */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-zinc-800/50 rounded-full blur-3xl"></div>
      </Card>
    </motion.div>
  );
}
