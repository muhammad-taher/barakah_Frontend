import { Link, Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('admin_token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;
  const linkCls = (path: string) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-zinc-100 text-zinc-900 font-medium'
        : 'hover:bg-zinc-50 text-zinc-600'
    }`;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm flex items-center justify-between p-4 z-20 relative">
        <h1 className="text-xl font-bold text-zinc-800">Barakah Admin</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`${
        isMobileMenuOpen ? 'flex' : 'hidden'
      } md:flex flex-col w-full md:w-64 bg-white border-r border-zinc-200 shadow-sm md:h-screen md:sticky top-0 z-10 flex-shrink-0 absolute md:relative w-full h-[calc(100vh-60px)] md:h-auto overflow-y-auto`}>
        <div className="hidden md:block p-6 border-b border-zinc-100">
          <h1 className="text-2xl font-bold text-zinc-800 tracking-tight">Barakah Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin/dashboard" onClick={closeMobileMenu} className={linkCls('/admin/dashboard')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/orders" onClick={closeMobileMenu} className={linkCls('/admin/orders')}>
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
          <Link to="/admin/products" onClick={closeMobileMenu} className={linkCls('/admin/products')}>
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link to="/admin/settings" onClick={closeMobileMenu} className={linkCls('/admin/settings')}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-100 mt-auto">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full transition-colors font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 w-full md:max-w-[calc(100vw-16rem)] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
