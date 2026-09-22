
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCcw, Sparkles, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from '../components/shop/ProductCard';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80';
const DEFAULT_PROMO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80';

export default function Home() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get('http://127.0.0.1:5000/api/v1/products/');
      return res.data;
    }
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await axios.get('http://127.0.0.1:5000/api/v1/settings/');
      return res.data;
    }
  });

  const featuredProducts = products ? products.slice(0, 8) : [];

  // Resolve settings with fallbacks
  const heroImage = settings?.hero_image_url || DEFAULT_HERO_IMAGE;
  const promoTitle = settings?.promo_title || 'Weekend Special.\nUp to 30% Off.';
  const promoSubtitle = settings?.promo_subtitle || 'Upgrade your wardrobe with our latest arrivals. Limited time offer exclusively online.';
  const promoLink = settings?.promo_link || '/shop?sale=true';
  const promoImage = settings?.promo_image_url || DEFAULT_PROMO_IMAGE;

  // Custom offer settings
  const offerEnabled = settings?.offer_enabled !== 'false';
  const offerTitle = settings?.offer_title;
  const offerSubtitle = settings?.offer_subtitle;
  const offerBadge = settings?.offer_badge;
  const offerImage = settings?.offer_image_url;
  const offerLink = settings?.offer_link || '/shop';
  const offerButtonText = settings?.offer_button_text || 'Shop Now';

  const showOfferBanner = offerEnabled && (offerTitle || offerImage);

  return (
    <div className="flex flex-col pb-0">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Barakah Collection" 
            className="w-full h-full object-cover object-center scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto flex flex-col items-center">
          <span className="uppercase tracking-[0.25em] text-[11px] font-semibold mb-5 block text-white/80">
            New Season Collection
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
            Designed for everyday confidence.
          </h1>
          <p className="text-base md:text-lg text-white/80 mb-10 max-w-lg leading-relaxed">
            Discover our premium selection of contemporary essentials. Crafted with uncompromising quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/shop"
              className="bg-white text-black px-8 py-3.5 font-semibold hover:bg-zinc-100 transition-all duration-200 inline-flex items-center justify-center gap-2 text-sm"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="border border-white/40 text-white px-8 py-3.5 font-semibold hover:bg-white/10 transition-all duration-200 inline-flex items-center justify-center gap-2 text-sm"
            >
              View All Products
            </Link>
          </div>
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
                <h4 className="font-semibold text-sm text-zinc-900">Nationwide Delivery</h4>
                <p className="text-xs text-zinc-500 hidden sm:block">All across Bangladesh</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">Cash on Delivery</h4>
                <p className="text-xs text-zinc-500 hidden sm:block">Pay when you receive</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">Quality Guarantee</h4>
                <p className="text-xs text-zinc-500 hidden sm:block">Premium materials</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCcw className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900">Easy Exchanges</h4>
                <p className="text-xs text-zinc-500 hidden sm:block">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 w-full py-16 md:py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2 block">Curated For You</span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Trending Now</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold hover:underline hidden sm:inline-flex items-center gap-1 text-zinc-600 hover:text-black transition-colors">
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} product={{...product, id: String(product.id)}} />
          ))}
        </div>
        <div className="mt-10 text-center sm:hidden">
          <Link to="/shop" className="text-sm font-semibold inline-flex items-center gap-1.5 text-zinc-600 hover:text-black transition-colors">
            View All Products
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Custom Offer Banner — Admin configurable, shown below Trending Now */}
      {showOfferBanner && (
        <section className="max-w-7xl mx-auto px-4 w-full pb-16 md:pb-20">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-100/60">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Text Content */}
              <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                {offerBadge && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full w-fit mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    {offerBadge}
                  </span>
                )}
                {offerTitle && (
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-3 leading-tight">
                    {offerTitle}
                  </h3>
                )}
                {offerSubtitle && (
                  <p className="text-zinc-600 mb-6 max-w-lg text-sm md:text-base leading-relaxed">
                    {offerSubtitle}
                  </p>
                )}
                <Link
                  to={offerLink}
                  className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-zinc-800 transition-colors w-fit text-sm"
                >
                  {offerButtonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Offer Image */}
              {offerImage && (
                <div className="flex-1 min-h-[250px] md:min-h-[350px] relative">
                  <img
                    src={offerImage}
                    alt={offerTitle || 'Special Offer'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 w-full pb-16 md:pb-20">
        <div className="bg-zinc-900 rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch">
          <div className="p-10 md:p-14 lg:p-20 flex-1 flex flex-col justify-center text-center md:text-left">
            <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {promoTitle.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}{i < promoTitle.split('\n').length - 1 && <br/>}</span>
              ))}
            </h3>
            <p className="text-zinc-400 mb-8 max-w-md text-sm md:text-base leading-relaxed">{promoSubtitle}</p>
            <div>
              <Link to={promoLink} className="bg-white text-black px-7 py-3 font-semibold hover:bg-zinc-100 transition-colors inline-flex items-center gap-2 text-sm">
                Shop The Sale
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full md:w-auto min-h-[280px] md:min-h-full">
            <img 
              src={promoImage} 
              alt="Promo" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
