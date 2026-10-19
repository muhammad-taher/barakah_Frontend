
import { useEffect } from 'react';
import { ShieldCheck, Truck, RefreshCcw, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ImageSlider from '../components/shop/ImageSlider';
import ContentSections from '../components/shop/ContentSections';
import OrderButton from '../components/shop/OrderButton';
import OrderForm from '../components/shop/OrderForm';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80';
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/api/v1/settings/`);
      return res.data;
    }
  });

  const { data: galleryImages = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/api/v1/gallery/`);
      return res.data;
    }
  });

  const { data: contentSections = [] } = useQuery({
    queryKey: ['content_sections'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/api/v1/content-sections/`);
      return res.data;
    }
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/api/v1/reviews/`);
      return res.data;
    }
  });

  // Resolve settings with fallbacks, but prevent flashing default images while loading
  const heroImage = isSettingsLoading ? undefined : (settings?.hero_image_url || DEFAULT_HERO_IMAGE);
  const guideImage = settings?.guide_image_url;
  const guideTitle = settings?.guide_title || 'প্রোডাক্ট ব্যবহারের নির্দেশিকা';
  const galleryTitle = settings?.gallery_title || 'বার্নিশ করার আগে ও পরের অবস্থা';

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
          <OrderButton />
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
                <p className="text-sm text-zinc-500 hidden sm:block">প্রোডাক্ট হাতে পেয়ে পেমেন্ট</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[15px] text-zinc-900">গুণগত মানের নিশ্চয়তা</h4>
                <p className="text-sm text-zinc-500 hidden sm:block">প্রিমিয়াম ম্যাটেরিয়াল</p>
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

      {/* Product user guide image */}
      {guideImage && (
        <section className="max-w-5xl mx-auto px-4 w-full pt-12 md:pt-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-6">{guideTitle}</h2>
          <img
            src={guideImage}
            alt={guideTitle}
            className="w-full rounded-2xl border border-zinc-200 shadow-sm"
            loading="lazy"
          />
        </section>
      )}

      {/* Order CTA */}
      <section className="max-w-5xl mx-auto px-4 w-full py-10 md:py-12 flex justify-center">
        <OrderButton />
      </section>

      {/* Before / after gallery slider */}
      {galleryImages.length > 0 && (
        <>
          <section className="max-w-6xl mx-auto px-4 w-full">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-6">{galleryTitle}</h2>
            <ImageSlider images={galleryImages} aspectClass="aspect-[4/3]" />
          </section>

          {/* Order CTA */}
          <section className="max-w-5xl mx-auto px-4 w-full py-10 md:py-12 flex justify-center">
            <OrderButton />
          </section>
        </>
      )}

      {/* Admin-managed Bangla content sections */}
      {contentSections.length > 0 && (
        <>
          <section className="max-w-4xl mx-auto px-4 w-full">
            <ContentSections sections={contentSections} />
          </section>

          {/* Order CTA */}
          <section className="max-w-5xl mx-auto px-4 w-full py-10 md:py-12 flex justify-center">
            <OrderButton />
          </section>
        </>
      )}

      {/* Customer Reviews slider */}
      {reviews.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 w-full pb-12 md:pb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">কাস্টমার রিভিউ</h2>
            <p className="text-zinc-500">আমাদের সম্মানিত গ্রাহকদের মতামত</p>
          </div>
          <ImageSlider images={reviews} aspectClass="aspect-[3/4]" objectFit="contain" />
        </section>
      )}

      {/* Order form — every CTA on this page scrolls here */}
      <section id="order-form" className="max-w-6xl mx-auto px-4 w-full pb-16 md:pb-20 scroll-mt-20">
        <OrderForm />
      </section>
    </div>
  );
}
