import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  Clock, 
  LogOut, 
  User as UserIcon, 
  Building2 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tickets', path: '/tickets', icon: Ticket },
  ];

  // Only show SLA policies tab for Admin
  if (user?.role === 'admin') {
    navItems.push({ label: 'SLA Policies', path: '/sla', icon: Clock });
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        {/* Brand Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-xl text-white shadow-lg shadow-purple-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">PulseDesk</h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-purple-400">SaaS Portal</span>
          </div>
        </div>

        {/* Organisation Status */}
        <div className="mx-4 my-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 leading-none">Organization</p>
            <p className="text-sm font-bold text-slate-200 mt-1 truncate">{user?.organisation?.name || 'Default'}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active 
                    ? 'bg-purple-600/10 border border-purple-500/20 text-purple-400 font-semibold shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${active ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Details */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-sm font-bold text-slate-200 truncate leading-tight">{user?.name}</h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md border ${
              user?.role === 'admin' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : user?.role === 'agent' 
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                  : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}>
              {user?.role}
            </span>
            <button 
              onClick={handleLogout}
              className="ml-auto p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/30 transition-all duration-200 flex items-center justify-center cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-lg font-bold text-slate-100">
            {location.pathname === '/dashboard' && 'Operations Dashboard'}
            {location.pathname === '/tickets' && 'Support Tickets'}
            {location.pathname.startsWith('/tickets/') && 'Ticket Conversation'}
            {location.pathname === '/sla' && 'Service Level Agreements'}
          </h2>
        </header>

        <main className="p-8 flex-1 bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
