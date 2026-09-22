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
      <div className="md:hidden bg-white shadow-sm flex items-center justify-between p-4 z-30 sticky top-0 border-b border-zinc-200">
        <h1 className="text-xl font-bold text-zinc-800">Barakah Admin</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-600 focus:outline-none">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden" 
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } fixed md:sticky top-[60px] md:top-0 left-0 z-20 w-64 h-[calc(100vh-60px)] md:h-screen bg-white border-r border-zinc-200 shadow-sm transition-transform duration-200 ease-in-out flex flex-col flex-shrink-0`}>
        <div className="hidden md:block p-6 border-b border-zinc-100">
          <h1 className="text-2xl font-bold text-zinc-800 tracking-tight">Barakah Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
        <div className="p-4 border-t border-zinc-100">
          <button onClick={handleLogout} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full transition-colors font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full md:max-w-[calc(100vw-16rem)] overflow-x-hidden min-h-[calc(100vh-60px)] md:min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
