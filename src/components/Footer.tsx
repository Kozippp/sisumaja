import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold uppercase tracking-widest text-white">Sisumaja</span>
            <p className="mt-2 text-sm text-gray-400">Eesti esimene creatorhouse.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/tehtud-tood" className="text-gray-400 hover:text-primary">
              Tehtud tööd
            </Link>
            <Link href="/kontakt" className="text-gray-400 hover:text-primary">
              Kontakt
            </Link>
            {/* Social Icons could go here */}
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sisumaja. Kõik õigused kaitstud.
        </div>
      </div>
    </footer>
  );
}

