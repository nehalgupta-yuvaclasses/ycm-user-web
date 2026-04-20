import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone } from 'lucide-react';
import { SocialLinks } from '@/components/common/SocialLinks';
import { DEFAULT_SOCIALS } from '@/services/socialsService';
import { useSocials } from '@/hooks/useSocials';

export function Footer() {
  const { data: socials = DEFAULT_SOCIALS } = useSocials();

  return (
    <footer className="bg-white border-t border-zinc-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          {/* Brand & Socials */}
          <div className="max-w-xs space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-zinc-900 text-white p-1.5 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                Global Yuva Classes
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Empowering students with strategic guidance and result-oriented learning for government exams.
            </p>
            <SocialLinks socials={socials} />
            <div className="space-y-2 text-sm text-zinc-500">
              {socials.phone && (
                <a href={`tel:${socials.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
                  <Phone className="h-4 w-4" />
                  <span>{socials.phone}</span>
                </a>
              )}
              {socials.email && (
                <a href={`mailto:${socials.email}`} className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
                  <Mail className="h-4 w-4" />
                  <span>{socials.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16">
            <div>
              <h4 className="font-bold text-zinc-900 mb-5 text-[10px] uppercase tracking-[0.2em]">Platform</h4>
              <ul className="space-y-3">
                {['Home', 'About', 'Courses', 'Resources', 'Blogs'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={
                        item === 'Home' ? '/' : 
                        item === 'About' ? '/about' : 
                        item === 'Courses' ? '/courses' : 
                        item === 'Resources' ? '/resources' : 
                        item === 'Blogs' ? '/blog' : '#'
                      } 
                      className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors"
                    >
                      {item === 'About' ? 'About Us' : item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-5 text-[10px] uppercase tracking-[0.2em]">Exams</h4>
              <ul className="space-y-3">
                {['SSC GD', 'Bihar Police', 'Railway', 'Banking'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold text-zinc-900 mb-5 text-[10px] uppercase tracking-[0.2em]">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/contact" className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a href="/#faq" className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <Link to="/refund-policy" className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link to="/disclaimer" className="text-zinc-500 hover:text-zinc-900 text-sm transition-colors">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-400 text-xs font-medium">
            2026 Global Yuva Classes, All Right Reserved
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-zinc-400 hover:text-zinc-900 text-xs font-medium transition-colors">Privacy</Link>
            <Link to="/terms" className="text-zinc-400 hover:text-zinc-900 text-xs font-medium transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
