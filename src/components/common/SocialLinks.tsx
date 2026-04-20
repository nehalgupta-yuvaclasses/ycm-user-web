import { FaWhatsapp, FaTelegram, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { type SocialsData, isSocialLink } from '@/services/socialsService';

interface SocialLinksProps {
  socials: SocialsData;
  className?: string;
}

const socialItems = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: FaWhatsapp,
    href: (socials: SocialsData) => socials.whatsapp,
    hoverClass: 'hover:bg-emerald-600 hover:border-emerald-600',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    icon: FaTelegram,
    href: (socials: SocialsData) => socials.telegram,
    hoverClass: 'hover:bg-sky-500 hover:border-sky-500',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: FaInstagram,
    href: (socials: SocialsData) => socials.instagram,
    hoverClass: 'hover:bg-pink-500 hover:border-pink-500',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: FaFacebookF,
    href: (socials: SocialsData) => socials.facebook,
    hoverClass: 'hover:bg-blue-600 hover:border-blue-600',
  },
  {
    key: 'twitter',
    label: 'X',
    icon: FaTwitter,
    href: (socials: SocialsData) => socials.twitter,
    hoverClass: 'hover:bg-zinc-900 hover:border-zinc-900',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: FaYoutube,
    href: (socials: SocialsData) => socials.youtube,
    hoverClass: 'hover:bg-red-600 hover:border-red-600',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: FaLinkedinIn,
    href: (socials: SocialsData) => socials.linkedin,
    hoverClass: 'hover:bg-sky-700 hover:border-sky-700',
  },
] as const;

export function SocialLinks({ socials, className }: SocialLinksProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {socialItems.map((item) => {
        const href = item.href(socials);

        if (!isSocialLink(href)) {
          return null;
        }

        const Icon = item.icon;

        return (
          <a
            key={item.key}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            className={cn(
              'group flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-100 bg-zinc-50 text-zinc-500 transition-all duration-300 hover:text-white',
              item.hoverClass,
            )}
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}