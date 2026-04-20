import { Target, Users, BarChart3, MessageSquare, IndianRupee, Layout, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const FEATURES = [
  {
    icon: Target,
    title: 'Result-Oriented Learning',
    description: 'Our methodology focuses on maximizing your score through strategic preparation.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Users,
    title: 'Expert Faculty',
    description: 'Learn from highly qualified educators with years of experience in competitive exams.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Daily Practice & Mock Tests',
    description: 'Regular assessments and full-length mock tests to build speed and accuracy.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: MessageSquare,
    title: 'Doubt Solving Support',
    description: 'Dedicated sessions to clear all your queries and strengthen your concepts.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: IndianRupee,
    title: 'Affordable Pricing',
    description: 'Top-quality education at competitive prices to make learning accessible.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Layout,
    title: 'Structured Curriculum',
    description: 'Well-planned syllabus coverage tailored to the latest exam patterns.',
    color: 'bg-indigo-50 text-indigo-600',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight leading-tight">
              Why Choose <span className="text-zinc-500">Yuva Classes?</span>
            </h2>
            <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
              We provide the most effective learning environment to help you achieve your career goals with a proven methodology.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative bg-zinc-50 p-6 rounded-[1.5rem] border border-zinc-100 hover:border-zinc-900/10 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-3 group-hover:translate-x-1 transition-transform duration-500">{feature.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed mb-5">{feature.description}</p>
              
              <div className="flex items-center gap-2 text-zinc-400 group-hover:text-zinc-900 transition-colors duration-500 text-[10px] font-bold uppercase tracking-wider">
                Learn More
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
