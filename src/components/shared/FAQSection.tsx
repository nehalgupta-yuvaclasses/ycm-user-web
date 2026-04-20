import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { motion } from 'motion/react';
import { HelpCircle, Loader2 } from 'lucide-react';
import { useFAQs } from '@/features/platform/hooks';

export function FAQSection() {
  const { data: faqs, isLoading } = useFAQs();

  if (isLoading) {
    return (
      <section id="faq" className="py-24 bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </section>
    );
  }

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              <HelpCircle className="w-3 h-3" />
              Common Questions
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Frequently Asked <span className="text-zinc-400">Questions</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Everything you need to know about our courses, batches, and learning platform.
            </p>
          </motion.div>

          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Accordion multiple={false} className="w-full space-y-3">
              {faqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="border border-zinc-100 rounded-2xl px-6 bg-zinc-50/50 hover:bg-zinc-50 transition-colors duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-bold text-zinc-900 py-6 hover:no-underline text-base md:text-lg group">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 text-base md:text-lg pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-zinc-400 text-sm">
              Still have questions? <a href="#contact" className="text-zinc-900 font-bold underline underline-offset-4 hover:text-zinc-600 transition-colors">Contact our support team</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

