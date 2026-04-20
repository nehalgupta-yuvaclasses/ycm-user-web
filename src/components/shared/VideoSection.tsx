import { Lightbulb, Target, BarChart3, Compass } from 'lucide-react';
import { motion } from 'motion/react';

const METHODOLOGY = [
  {
    icon: Lightbulb,
    title: 'Concept-Based Learning',
    description: 'We focus on strong conceptual clarity rather than rote learning, enabling students to solve any complex problem.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Target,
    title: 'Exam-Oriented Preparation',
    description: 'Our courses are meticulously designed according to the latest competitive exam patterns and historical trends.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: BarChart3,
    title: 'Practice & Analysis',
    description: 'Regular mock tests and performance analytics help students identify their weak areas and improve consistently.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Compass,
    title: 'Guidance & Motivation',
    description: 'Our educators serve as mentors, providing continuous motivation and strategic guidance throughout the journey.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];

export function VideoSection() {
  return (
    <section className="py-24 bg-zinc-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Header Column */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                  <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Our Methodology</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                  The Yuva <br />
                  <span className="text-zinc-400">Advantage</span>
                </h2>
                <p className="text-zinc-600 text-lg leading-relaxed max-w-sm">
                  We don't just teach; we prepare you for excellence through a scientifically designed learning process.
                </p>
              </motion.div>
            </div>

            {/* Cards Grid Column */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {METHODOLOGY.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-zinc-500 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
