
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="mb-4 block hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Barakah" className="h-16 object-contain brightness-0 invert" />
            </Link>
            <p className="text-[15px] leading-relaxed mb-5 max-w-xs text-zinc-400">
              সারাদেশে প্রিমিয়াম কোয়ালিটির প্রোডাক্ট আপনার দোরগোড়ায়। আপনার বিশ্বস্ত অনলাইন শপিং গন্তব্য।
            </p>
            <div className="space-y-3 text-[15px]">
              <div className="flex items-center gap-3">
                <Phone className="w-[18px] h-[18px] text-zinc-500" />
                <span className="font-medium text-zinc-300">+8801353366144</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-[18px] h-[18px] text-zinc-500" />
                <span className="text-zinc-300">support@barakah.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-[18px] h-[18px] text-zinc-500" />
                <span className="text-zinc-300">ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white text-[15px] mb-5">শপ</h4>
            <ul className="space-y-3 text-[15px]">
              <li><Link to="/shop" className="hover:text-white transition-colors">সব প্রোডাক্ট</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">নতুন কালেকশন</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">বেস্ট সেলার</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">অফার</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white text-[15px] mb-5">সাপোর্ট</h4>
            <ul className="space-y-3 text-[15px]">
              <li><Link to="#" className="hover:text-white transition-colors">যোগাযোগ করুন</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">সাধারণ প্রশ্ন</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">ডেলিভারি ও রিটার্ন</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">অর্ডার ট্র্যাক করুন</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white text-[15px] mb-5">নীতিমালা</h4>
            <ul className="space-y-3 text-[15px]">
              <li><Link to="#" className="hover:text-white transition-colors">প্রাইভেসি পলিসি</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">টার্মস অফ সার্ভিস</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">রিফান্ড পলিসি</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} বারাকাহ। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              💵 ক্যাশ অন ডেলিভারি
            </span>
            <span className="flex items-center gap-2">
              🚚 সারাদেশে ডেলিভারি
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
