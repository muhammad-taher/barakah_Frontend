import { Link, Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const linkCls = (path: string) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-blue-50 text-blue-700 font-medium'
        : 'hover:bg-gray-50 text-gray-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Barakah Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className={linkCls('/admin/dashboard')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/orders" className={linkCls('/admin/orders')}>
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
          <Link to="/admin/products" className={linkCls('/admin/products')}>
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link to="/admin/settings" className={linkCls('/admin/settings')}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
