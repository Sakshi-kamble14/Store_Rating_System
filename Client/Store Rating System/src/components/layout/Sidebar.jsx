import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Settings,
  LogOut,
  Star,
  X
} from 'lucide-react';

const NAV_ITEMS = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/stores', label: 'Stores', icon: Store },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ],
  USER: [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/stores', label: 'Stores', icon: Store },
    { to: '/user/ratings', label: 'My Ratings', icon: Star },
    { to: '/user/settings', label: 'Settings', icon: Settings }
  ],
  OWNER: [
    { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/owner/settings', label: 'Settings', icon: Settings }
  ]
};

const Sidebar = ({ role, onLogoutClick, mobileOpen, onCloseMobile }) => {
  const items = NAV_ITEMS[role] || [];

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Star className="h-4 w-4 fill-white" />
          </div>
          <span className="text-base font-bold text-ink-900">StoreRating</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow' 
                  : 'text-ink-600 hover:bg-white/80 hover:text-ink-900 hover:shadow-sm'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-100 px-3 py-3">
        <button
          onClick={onLogoutClick}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 hover:bg-danger-50 hover:text-danger-600"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/50 bg-white/60 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:block z-40">{content}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="relative h-full w-64 bg-white shadow-popover animate-in">{content}</aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
