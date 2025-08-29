import { Globe } from 'lucide-react';
import Link from 'next/link';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 20 : size === 'md' ? 24 : 32;
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl';

  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="Geo 3D Hub Home">
      <Globe size={iconSize} className="text-primary group-hover:text-accent transition-colors" />
      <span className={`font-headline font-semibold ${textSize} text-foreground group-hover:text-primary transition-colors`}>
        Geo 3D Hub
      </span>
    </Link>
  );
}
