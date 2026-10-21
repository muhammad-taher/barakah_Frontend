
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-8 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand + contact, side by side on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5">
          <Link to="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
            <img src="/logobarakah.png" alt="Barakah" className="h-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-white font-serif">Barakah</span>
          </Link>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <a href="tel:+8801353366144" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>+8801353366144</span>
            </a>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
              <span className="break-all">support@barakah.com</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>ভালুকা, বাংলাদেশ</span>
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p className="text-zinc-500 text-center sm:text-left">
            © {new Date().getFullYear()} বারাকাহ। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</Link>
            <span className="text-zinc-500">💵 ক্যাশ অন ডেলিভারি</span>
            <span className="text-zinc-500">🚚 সারাদেশে ডেলিভারি</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
