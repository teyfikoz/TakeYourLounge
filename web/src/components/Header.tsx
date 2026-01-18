'use client';

import Navbar from './Navbar';

interface HeaderProps {
  title?: string;
  description?: string;
  showTitle?: boolean;
  className?: string;
}

export default function Header({ title, description, showTitle = false, className = '' }: HeaderProps) {
  return (
    <header className={`bg-white border-b ${className}`}>
      <div className="container-custom py-6">
        <Navbar />
        {showTitle && title && (
          <div className="mt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            {description && (
              <p className="text-xl text-gray-600">{description}</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
