import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold uppercase tracking-widest text-white">
              Sisumaja
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Avaleht
              </Link>
              <Link href="/tehtud-tood" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Tehtud tööd
              </Link>
              <Link href="/kontakt" className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Kontakt
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none">
              <span className="sr-only">Ava menüü</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

