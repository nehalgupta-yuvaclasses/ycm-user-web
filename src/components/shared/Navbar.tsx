import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LogIn, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { AuthModal } from './AuthModal';
import { useAuthModal } from '@/contexts/AuthContext';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Courses', href: '/courses' },
  { name: 'Resources', href: '/resources' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthModalOpen, openAuthModal, closeAuthModal, loading, logout, user } = useAuthModal();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled || location.pathname !== '/'
          ? 'bg-white/80 backdrop-blur-md py-3 border-zinc-200 shadow-sm'
          : 'bg-transparent py-5 border-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-zinc-900 text-white p-1.5 rounded-lg shadow-lg shadow-zinc-900/20 transition-transform group-hover:scale-110">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            Yuva Classes
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              link.href.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    location.pathname === link.href 
                      ? "text-zinc-900" 
                      : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-28 animate-pulse rounded-full bg-zinc-100" />
            ) : !user ? (
              <Button 
                onClick={openAuthModal}
                className="h-10 px-6 bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/20 font-semibold gap-2"
              >
                <LogIn className="w-4 h-4" />
                Continue
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-xs font-bold text-white">
                        {user.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-zinc-500 font-bold"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="text-zinc-900">
                  <Menu className="w-6 h-6" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-zinc-900 text-white p-1.5 rounded-lg">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900">
                      Yuva Classes
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      link.href.startsWith('/#') ? (
                        <a
                          key={link.name}
                          href={link.href}
                          className="text-lg font-medium text-zinc-600 hover:text-zinc-900 py-3 transition-colors"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          key={link.name}
                          to={link.href}
                          className={cn(
                            "text-lg font-medium py-3 transition-colors",
                            location.pathname === link.href 
                              ? "text-zinc-900" 
                              : "text-zinc-600 hover:text-zinc-900"
                          )}
                        >
                          {link.name}
                        </Link>
                      )
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
                  <div className="flex flex-col gap-3">
                      {!user ? (
                        <Button 
                          onClick={openAuthModal}
                          className="w-full h-12 text-lg font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10 gap-2"
                        >
                          <LogIn className="w-5 h-5" />
                          Continue
                        </Button>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link to="/dashboard" className="w-full">
                          <Button className="w-full h-12 text-lg font-semibold bg-zinc-900 text-white hover:bg-zinc-800 gap-2">
                            <GraduationCap className="w-5 h-5" />
                            My Dashboard
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full h-12 text-lg font-semibold border-zinc-200 text-zinc-900"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </nav>
  );
}
