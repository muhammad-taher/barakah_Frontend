
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from '../components/shop/ProductCard';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80';
const DEFAULT_PROMO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80';

export default function Home() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/products/`);
      return res.data;
    }
  });

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/settings/`);
      return res.data;
    }
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/packages/`);
      return res.data;
    }
  });

  const featuredProducts = products ? products.slice(0, 8) : [];

  // Resolve settings with fallbacks, but prevent flashing default images while loading
  const heroImage = isSettingsLoading ? undefined : (settings?.hero_image_url || DEFAULT_HERO_IMAGE);
  const promoTitle = settings?.promo_title || 'সাপ্তাহিক অফার\n৩০% পর্যন্ত ছাড়';
  const promoSubtitle = settings?.promo_subtitle || 'আমাদের নতুন কালেকশন থেকে বেছে নিন আপনার পছন্দের ড্রেস। শুধুমাত্র অনলাইনে সীমিত সময়ের অফার।';
  const promoLink = settings?.promo_link || '/shop?sale=true';
  const promoImage = isSettingsLoading ? undefined : (settings?.promo_image_url || DEFAULT_PROMO_IMAGE);

  return (
    <div className="flex flex-col pb-0">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] max-h-[900px] flex items-end justify-center pb-[15vh] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-zinc-900">
          {heroImage && (
            <img 
              src={heroImage} 
              alt="Barakah Collection" 
              className="w-full h-full object-cover object-center scale-105"
              loading="eager"
            />
          )}
        </div>
        <div className="relative z-10 flex justify-center w-full">
          <a
            href="#order-section"
            className="bg-black text-white px-8 py-3.5 rounded-full font-bold hover:bg-zinc-800 transition-all duration-200 inline-flex items-center justify-center gap-2 text-[15px] shadow-lg hover:shadow-xl hover:scale-105"
          >
            অর্ডার করতে ক্লিক করুন
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Trust Benefits */}
      <section className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 md:py-10">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[15px] text-zinc-900">সারাদেশে ডেলিভারি</h4>
                <p className="text-sm text-zinc-500 hidden sm:block">বাংলাদেশের যেকোনো প্রান্তে</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[15px] text-zinc-900">ক্যাশ অন ডেলিভারি</h4>
                <p className="text-sm text-zinc-500 hidden sm:block">প্রোডাক্ট হাতে পেয়ে পেমেন্ট</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[15px] text-zinc-900">গুণগত মানের নিশ্চয়তা</h4>
                <p className="text-sm text-zinc-500 hidden sm:block">প্রিমিয়াম ম্যাটেরিয়াল</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCcw className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[15px] text-zinc-900">সহজ রিটার্ন পলিসি</h4>
                <p className="text-sm text-zinc-500 hidden sm:block">৭ দিনের রিটার্ন সুবিধা</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="order-section" className="max-w-7xl mx-auto px-4 w-full py-16 md:py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 block">আপনার জন্য স্পেশাল</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">ট্রেন্ডিং প্রোডাক্ট</h2>
          </div>
          <Link to="/shop" className="text-[15px] font-semibold hover:underline hidden sm:inline-flex items-center gap-1 text-zinc-600 hover:text-black transition-colors">
            সব দেখুন
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={{...product, id: String(product.id)}} />
          ))}
        </div>
        <div className="mt-10 text-center sm:hidden">
          <Link to="/shop" className="text-[15px] font-semibold inline-flex items-center gap-1.5 text-zinc-600 hover:text-black transition-colors">
            সব প্রোডাক্ট দেখুন
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Packages Section */}
      {packages?.map((pkg: any) => (
        <section key={pkg.id} className="max-w-7xl mx-auto px-4 w-full pb-16 md:pb-20">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-100/60">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Text Content */}
              <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 leading-tight">
                  {pkg.headline}
                </h3>
                {pkg.description && (
                  <p className="text-zinc-600 mb-6 max-w-lg text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {pkg.description}
                  </p>
                )}
                <Link
                  to={pkg.link || '/shop'}
                  className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-800 transition-colors w-fit text-sm"
                >
                  অর্ডার করতে ক্লিক করুন
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Package Image */}
              {pkg.image_url && (
                <div className="flex-1 min-h-[250px] md:min-h-[350px] relative">
                  <img
                    src={pkg.image_url}
                    alt={pkg.headline}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 w-full pb-16 md:pb-20">
        <div className="bg-zinc-900 rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="p-10 md:p-14 lg:p-20 flex-1 flex flex-col justify-center text-center md:text-left">
            <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {promoTitle.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}{i < promoTitle.split('\n').length - 1 && <br/>}</span>
              ))}
            </h3>
            <p className="text-zinc-400 mb-8 max-w-md text-[15px] leading-relaxed">{promoSubtitle}</p>
            <div>
              <Link to={promoLink} className="bg-white text-black px-7 py-3 rounded-full font-bold hover:bg-zinc-100 transition-colors inline-flex items-center gap-2 text-[15px]">
                অফারগুলো দেখুন
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full md:w-auto min-h-[280px] md:min-h-full bg-zinc-800">
            {promoImage && (
              <img 
                src={promoImage} 
                alt="Promo" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
