import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { MessageCircle } from 'lucide-react';

interface SelectedPackage {
  packageId: number;
  quantity: number;
}

const bdDivisionsDistricts: Record<string, string[]> = {
  Dhaka: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  Chattogram: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Comilla', 'Cox\'s Bazar', 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  Rajshahi: ['Bogura', 'Chapainawabganj', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Rajshahi', 'Sirajganj'],
  Khulna: ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
  Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur']
};

export default function PackageOrder() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Billing form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update district when division changes
  useEffect(() => {
    if (bdDivisionsDistricts[division]) {
      setDistrict(bdDivisionsDistricts[division][0]);
    }
  }, [division]);

  // Packages
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>([]);

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/packages/`);
      return res.data;
    }
  });

  const location = useLocation();
  const defaultPackageId = location.state?.selectedPackageId;

  // Auto-select the default or first package when packages load
  useEffect(() => {
    if (packages.length > 0 && selectedPackages.length === 0) {
      if (defaultPackageId && packages.some((p: any) => p.id === defaultPackageId)) {
        setSelectedPackages([{ packageId: defaultPackageId, quantity: 1 }]);
      } else {
        setSelectedPackages([{ packageId: packages[0].id, quantity: 1 }]);
      }
    }
  }, [packages, defaultPackageId]);

  const togglePackage = (pkgId: number) => {
    setSelectedPackages(prev => {
      const exists = prev.find(s => s.packageId === pkgId);
      if (exists) {
        // Don't allow deselecting if it's the last one
        if (prev.length <= 1) return prev;
        return prev.filter(s => s.packageId !== pkgId);
      } else {
        return [...prev, { packageId: pkgId, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (pkgId: number, qty: number) => {
    if (qty < 1) return;
    setSelectedPackages(prev =>
      prev.map(s => s.packageId === pkgId ? { ...s, quantity: qty } : s)
    );
  };

  const isSelected = (pkgId: number) => selectedPackages.some(s => s.packageId === pkgId);
  const getQuantity = (pkgId: number) => selectedPackages.find(s => s.packageId === pkgId)?.quantity || 1;

  // Calculate totals
  const getSelectedItems = () => {
    return selectedPackages.map(sp => {
      const pkg = packages.find((p: any) => p.id === sp.packageId);
      return { ...sp, pkg };
    }).filter((item: any) => item.pkg);
  };

  const subtotal = getSelectedItems().reduce((sum: number, item: any) => sum + (item.pkg.price * item.quantity), 0);
  const total = subtotal;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPackages.length === 0) {
      alert('অনুগ্রহ করে অন্তত একটি প্যাকেজ সিলেক্ট করুন।');
      return;
    }
    setIsSubmitting(true);
    try {
      const fullAddress = `${address}, ${district}, ${division}`;
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/v1/orders/package-checkout`, {
        customer_name: name,
        phone,
        address: fullAddress,
        packages: selectedPackages.map(sp => ({ package_id: sp.packageId, quantity: sp.quantity }))
      });
      navigate('/order-success', { state: { orderNumber: res.data.order_number, totalAmount: res.data.total_amount } });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'অর্ডার করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-white py-4 px-4 text-center">
        <h1 className="text-lg md:text-2xl font-bold">
          অর্ডার কনফার্ম করতে নিচের ফর্মটি সঠিক তথ্য দিয়ে পূরণ করুন।
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handlePlaceOrder}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Billing + Packages */}
            <div className="flex-1">
              {/* Billing Details */}
              <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">বিলিং তথ্য</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-red-600 mb-1">আপনার নাম লিখুন *</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border border-zinc-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-600 mb-1">আপনার মোবাইল নং লিখুন *</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full border border-zinc-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-600 mb-1">বিভাগ *</label>
                      <select
                        required
                        value={division}
                        onChange={e => setDivision(e.target.value)}
                        className="w-full border border-zinc-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                      >
                        {Object.keys(bdDivisionsDistricts).map(div => (
                          <option key={div} value={div}>{div}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-600 mb-1">শহর/জেলা *</label>
                      <select
                        required
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                        className="w-full border border-zinc-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                      >
                        {bdDivisionsDistricts[division]?.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-600 mb-1">আপনার ঠিকানা লিখুন *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="যেমন: House 12, Road 5, Block C"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full border border-zinc-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Shipping */}
                <div className="mt-6">
                  <h3 className="font-bold text-lg mb-2">শিপিং</h3>
                  <div className="border border-zinc-200 rounded-md px-4 py-3 bg-zinc-50 text-zinc-600">
                    ফ্রি হোম ডেলিভারি!
                  </div>
                </div>
              </div>

              {/* Package Selection */}
              <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-6">কোনটি নিতে চান সিলেক্ট করুন।</h2>
                <div className="space-y-4">
                  {packages.map((pkg: any) => {
                    const selected = isSelected(pkg.id);
                    const qty = getQuantity(pkg.id);
                    return (
                      <div
                        key={pkg.id}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          selected
                            ? 'border-green-500 bg-green-50'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                        onClick={() => togglePackage(pkg.id)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Radio/Checkbox */}
                          <div className="mt-1 shrink-0">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selected ? 'border-green-500' : 'border-zinc-300'
                            }`}>
                              {selected && <div className="w-3 h-3 rounded-full bg-green-500" />}
                            </div>
                          </div>

                          {/* Image */}
                          {pkg.image_url && (
                            <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden border border-zinc-200">
                              <img src={pkg.image_url} alt={pkg.headline} className="w-full h-full object-cover" />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-sm md:text-base text-zinc-900">{pkg.headline}</h3>
                              {pkg.offer_active && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">অফার</span>
                              )}
                            </div>
                            {pkg.description && (
                              <div className="text-xs md:text-sm text-zinc-500 mt-1 prose prose-sm prose-zinc line-clamp-3">
                                <ReactMarkdown>{pkg.description}</ReactMarkdown>
                              </div>
                            )}

                            {/* Quantity + Price */}
                            <div className="flex flex-wrap items-center gap-2 mt-3" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center border border-zinc-300 rounded-md h-8 bg-white shrink-0">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(pkg.id, qty - 1)}
                                  className="px-2.5 text-zinc-500 hover:text-black text-lg leading-none"
                                >−</button>
                                <span className="w-8 text-center text-sm font-medium">{selected ? qty : 1}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(pkg.id, qty + 1)}
                                  className="px-2.5 text-zinc-500 hover:text-black text-lg leading-none"
                                >+</button>
                              </div>
                              {pkg.offer_active && pkg.original_price ? (
                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ml-1">
                                  <span className="font-bold text-green-600 text-sm sm:text-base whitespace-nowrap">৳{pkg.price?.toLocaleString()}</span>
                                  <span className="text-xs sm:text-sm text-zinc-400 line-through whitespace-nowrap">৳{pkg.original_price?.toLocaleString()}</span>
                                </div>
                              ) : (
                                <span className="font-bold text-zinc-900 ml-1 whitespace-nowrap">৳{pkg.price?.toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-[380px]">
              <div className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">আপনার অর্ডার</h2>

                {/* Header */}
                <div className="flex justify-between text-sm font-medium text-zinc-500 border-b border-zinc-200 pb-2 mb-3">
                  <span>প্রোডাক্ট</span>
                  <span>সাবটোটাল</span>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {getSelectedItems().map((item: any) => (
                    <div key={item.packageId} className="flex items-center gap-3">
                      {item.pkg.image_url && (
                        <div className="w-10 h-12 shrink-0 rounded border border-zinc-200 overflow-hidden">
                          <img src={item.pkg.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.pkg.headline}</p>
                        <p className="text-xs text-zinc-400">× {item.quantity}</p>
                      </div>
                      {item.pkg.offer_active && item.pkg.original_price ? (
                        <div className="text-right shrink-0 flex flex-col items-end">
                          <span className="text-sm font-medium text-green-600 block whitespace-nowrap">৳{(item.pkg.price * item.quantity).toLocaleString()}</span>
                          <span className="text-xs text-zinc-400 line-through whitespace-nowrap">৳{(item.pkg.original_price * item.quantity).toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium whitespace-nowrap shrink-0">৳{(item.pkg.price * item.quantity).toLocaleString()}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-zinc-200 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">সাবটোটাল</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">ডেলিভারি চার্জ</span>
                    <span className="text-green-600 font-bold">ফ্রি</span>
                  </div>
                  <div className="border-t border-zinc-200 pt-3 flex justify-between font-bold text-lg mt-2">
                    <span>সর্বমোট</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment method */}
                <div className="mt-6 mb-4">
                  <h3 className="font-bold mb-2">ক্যাশ অন ডেলিভারি</h3>
                  <p className="text-sm text-zinc-500 border border-zinc-200 rounded-md p-3 bg-zinc-50">
                    অর্ডার কনফার্ম করতে নিচের "অর্ডার কনফার্ম করুন" বাটনে ক্লিক করুন।
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || selectedPackages.length === 0}
                  className="w-full bg-amber-700 text-white font-bold text-lg py-4 rounded-md hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Bottom help text */}
        <div className="text-center mt-10 pb-8 flex flex-col items-center gap-4">
          <p className="text-lg font-bold">
            অর্ডার করতে কোন সমস্যা হলে কল করুনঃ{' '}
            <a href="tel:+8801353366144" className="text-green-600 hover:underline">+8801353366144</a>
          </p>
          <a
            href="https://wa.me/8801353366144"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition-colors shadow-md hover:shadow-lg w-fit"
          >
            <MessageCircle className="w-5 h-5" />
            হোয়াটসঅ্যাপে মেসেজ দিন
          </a>
        </div>
      </div>
    </div>
  );
}
