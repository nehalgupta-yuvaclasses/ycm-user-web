import * as React from 'react';
import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Navigation 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { SocialLinks } from '@/components/common/SocialLinks';
import { DEFAULT_SOCIALS, formatPhoneHref } from '@/services/socialsService';
import { useSocials } from '@/hooks/useSocials';
import {
  submitContactMessage,
  validateContactForm,
  type ContactFormErrors,
} from '@/services/messages';

export default function Contact() {
  const { data: socials = DEFAULT_SOCIALS } = useSocials();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [honeypot, setHoneypot] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldownUntil && Date.now() < cooldownUntil) {
      toast.info('Please wait a moment before sending another message.');
      return;
    }

    const validation = validateContactForm({ ...formData, honeypot });
    setErrors(validation.errors);

    if (!validation.isValid) {
      toast.error(validation.errors.general ?? 'Please fix the highlighted fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactMessage({ ...validation.values, honeypot });

      if (result.status === 'ignored') {
        return;
      }

      setIsSubmitted(true);
      setFormData({ full_name: '', email: '', subject: '', message: '' });
      setHoneypot('');
      setErrors({});
      setCooldownUntil(Date.now() + 120000);
      window.setTimeout(() => setCooldownUntil(null), 120000);
      toast.success('Message sent! We will get back to you soon.');
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: socials.phone || '+91 98765 43210',
      label: 'Quick Support',
      description: socials.whatsapp ? 'Open WhatsApp chat' : socials.support_hours || 'Chat with our counselors',
      color: 'bg-emerald-50 text-emerald-600',
      link: socials.whatsapp || (socials.phone ? `https://wa.me/${formatPhoneHref(socials.phone).replace(/^\+/, '')}` : '#')
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: socials.phone || '+91 98765 43210',
      label: 'General Inquiry',
      description: socials.support_hours || 'Mon-Sat, 9:00 AM - 7:00 PM',
      color: 'bg-blue-50 text-blue-600',
      link: socials.phone ? `tel:${formatPhoneHref(socials.phone)}` : '#'
    },
    {
      icon: Mail,
      title: 'Email',
      value: socials.email || 'support@yuvaclasses.com',
      label: 'Official Support',
      description: 'Get a response within 24 hours',
      color: 'bg-zinc-50 text-zinc-900',
      link: socials.email ? `mailto:${socials.email}` : '#'
    }
  ];

  return (
    <div className="bg-white text-zinc-950 scroll-smooth selection:bg-zinc-900 selection:text-white">
      {/* 1. Hero Section - Refined & Minimalist */}
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-24 overflow-hidden bg-zinc-50 border-b border-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-left space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight leading-[1.1]"
            >
              Start Your <br className="hidden md:block" />
              <span className="text-zinc-500">Success Journey.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg text-zinc-500 max-w-xl leading-relaxed"
            >
              Whether you're looking for class schedules, fee details, or academic guidance, we're here to provide the support you need.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. Main Content - Clean Professional Layout */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Side: Contact Methods & Location */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Connect</h2>
                  <p className="text-2xl font-bold text-zinc-900">Reach out directly.</p>
                </div>

                <div className="grid gap-3">
                  {contactMethods.map((method, idx) => (
                    <motion.a
                      key={method.title}
                      href={method.link}
                      initial={{ opacity: 0, y: 5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="group p-5 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm transition-all duration-300 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl ${method.color} flex items-center justify-center`}>
                          <method.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">{method.label}</p>
                          <h4 className="font-semibold text-zinc-900 transition-colors uppercase tracking-tight text-sm">{method.value}</h4>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-all" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Office Location Card */}
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-zinc-900 text-white space-y-6"
              >
                <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-lg">Our Center</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-300 text-sm font-medium">123 Education Hub, Mukherjee Nagar</p>
                    <p className="text-zinc-500 text-xs">{socials.address || 'New Delhi, Delhi 110009'}</p>
                  </div>
                </div>
                <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold rounded-xl h-11">
                  Get Directions
                  <Navigation className="w-3 h-3 ml-2" />
                </Button>
              </motion.div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-zinc-50/50 rounded-2xl border border-zinc-100 p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-10"
                    >
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-zinc-900 tracking-tight text-left">Send a Message</h3>
                        <p className="text-zinc-500 text-sm font-medium text-left">We typically respond within a few hours.</p>
                      </div>

                      <form className="space-y-8" onSubmit={handleSubmit}>
                        <input
                          type="text"
                          name="company"
                          tabIndex={-1}
                          autoComplete="off"
                          className="hidden"
                          aria-hidden="true"
                          value={honeypot}
                          onChange={(event) => setHoneypot(event.target.value)}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left block">Name</label>
                            <Input 
                              placeholder="Your Name" 
                              className="h-12 bg-transparent border-0 border-b border-zinc-200 focus:border-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-900 rounded-none px-0 text-base font-medium transition-all shadow-none" 
                              required 
                              value={formData.full_name}
                              onChange={(e) => {
                                setFormData({ ...formData, full_name: e.target.value });
                                setErrors((current) => ({ ...current, full_name: undefined }));
                              }}
                            />
                            {errors.full_name && <p className="text-xs font-medium text-red-500">{errors.full_name}</p>}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left block">Email</label>
                            <Input 
                              type="email" 
                              placeholder="example@email.com" 
                              className="h-12 bg-transparent border-0 border-b border-zinc-200 focus:border-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-900 rounded-none px-0 text-base font-medium transition-all shadow-none" 
                              required 
                              value={formData.email}
                              onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                setErrors((current) => ({ ...current, email: undefined }));
                              }}
                            />
                            {errors.email && <p className="text-xs font-medium text-red-500">{errors.email}</p>}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left block">Subject</label>
                          <Input 
                            placeholder="How can we help?" 
                            className="h-12 bg-transparent border-0 border-b border-zinc-200 focus:border-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-900 rounded-none px-0 text-base font-medium transition-all shadow-none" 
                            required 
                            value={formData.subject}
                            onChange={(e) => {
                              setFormData({ ...formData, subject: e.target.value });
                              setErrors((current) => ({ ...current, subject: undefined }));
                            }}
                          />
                          {errors.subject && <p className="text-xs font-medium text-red-500">{errors.subject}</p>}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left block">Message</label>
                          <Textarea 
                            placeholder="Type your message here..." 
                            className="min-h-[120px] bg-transparent border-0 border-b border-zinc-200 focus:border-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-zinc-900 rounded-none px-0 text-base font-medium transition-all resize-none shadow-none" 
                            required 
                            value={formData.message}
                            onChange={(e) => {
                              setFormData({ ...formData, message: e.target.value });
                              setErrors((current) => ({ ...current, message: undefined }));
                            }}
                          />
                          {errors.message && <p className="text-xs font-medium text-red-500">{errors.message}</p>}
                        </div>

                        <Button 
                          type="submit" 
                          disabled={isSubmitting || Boolean(cooldownUntil && Date.now() < cooldownUntil)}
                          className="w-full h-12 bg-zinc-900 text-white hover:bg-zinc-800 text-sm font-bold rounded-xl transition-all"
                        >
                          {isSubmitting
                            ? 'Sending...'
                            : cooldownUntil && Date.now() < cooldownUntil
                              ? 'Please wait'
                              : 'Send Message'}
                          <Send className="w-4 h-4 ml-2" />
                        </Button>
                        {cooldownUntil && Date.now() < cooldownUntil && (
                          <p className="text-center text-xs font-medium text-zinc-500">
                            Please wait a moment before submitting again.
                          </p>
                        )}
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-zinc-900" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-zinc-900">Message Sent.</h3>
                        <p className="text-zinc-500 text-base max-w-xs mx-auto">
                          Our team will get back to you shortly via email or phone.
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="text-zinc-400 hover:text-zinc-900 text-xs font-bold"
                        onClick={() => {
                          setIsSubmitted(false);
                          setErrors({});
                          setHoneypot('');
                        }}
                      >
                        Send Another
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-zinc-100">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-zinc-900 uppercase tracking-tight">Stay Connected</h4>
            <p className="text-zinc-500 text-sm">Join our digital community for daily updates.</p>
          </div>
          <div className="flex justify-center">
            <SocialLinks socials={socials} className="justify-center" />
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="aspect-[21/9] w-full bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 relative group shadow-2xl shadow-zinc-200/50">
            {/* 1. The Map (Non-interactive) */}
            <iframe
              src="https://maps.google.com/maps?q=25.369718,86.481910&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale opacity-60 transition-all duration-700 pointer-events-none scale-[1.02]"
              title="Yuva Classes Location"
            ></iframe>

            {/* 2. Professional Overlay Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent pointer-events-none" />
            
            {/* 3. Small Get Me There CTA - Bottom Right */}
            <motion.a
              href="https://maps.app.goo.gl/GT8xn38HBZNbAqJFA"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="absolute bottom-6 right-6 group flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl font-bold shadow-xl shadow-zinc-900/20 hover:bg-zinc-800 transition-all duration-300 no-underline text-xs z-20"
            >
              <span>Get Me There</span>
              <Navigation className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>

            {/* 4. Small Location Badge - Bottom Left */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-zinc-200/50 shadow-sm pointer-events-none z-20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Live Location</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
