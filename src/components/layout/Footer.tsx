
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white mb-4 block">
              BARAKAH
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              Premium quality products delivered to your doorstep across Bangladesh. Your trusted online shopping destination.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-zinc-500" />
                <span>+880 1XXX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span>support@barakah.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-500" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Barakah. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              💵 Cash on Delivery
            </span>
            <span className="flex items-center gap-1.5">
              🚚 Nationwide Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
