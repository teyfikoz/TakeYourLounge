'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="flex justify-between items-center">
      <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
        <Image
          src="/logo.svg"
          alt="TakeYourLounge Logo"
          width={280}
          height={48}
          priority
          className="h-11 w-auto md:h-14 lg:h-16"
        />
      </Link>
      <div className="space-x-4 md:space-x-6">
        <Link
          href="/lounges"
          className={`${
            isActive('/lounges')
              ? 'text-brand-600 font-medium'
              : 'text-gray-700 hover:text-brand-600'
          } transition-colors`}
        >
          Lounges
        </Link>
        <Link
          href="/airports"
          className={`${
            isActive('/airports')
              ? 'text-brand-600 font-medium'
              : 'text-gray-700 hover:text-brand-600'
          } transition-colors`}
        >
          Airports
        </Link>
        <Link
          href="/about"
          className={`${
            isActive('/about')
              ? 'text-brand-600 font-medium'
              : 'text-gray-700 hover:text-brand-600'
          } transition-colors`}
        >
          About
        </Link>
      </div>
    </nav>
  );
}
