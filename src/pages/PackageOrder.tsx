import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OrderForm from '../components/shop/OrderForm';

export default function PackageOrder() {
  const location = useLocation();
  const defaultPackageId = location.state?.selectedPackageId;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <OrderForm defaultPackageId={defaultPackageId} />
      </div>
    </div>
  );
}
