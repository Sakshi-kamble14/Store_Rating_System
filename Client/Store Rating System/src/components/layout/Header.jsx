import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, User, KeyRound, LogOut } from 'lucide-react';
import { initials, roleBadgeColor } from '../../utils/formatters.js';

const Header = ({ user, title, onMenuClick, onLogoutClick, settingsPath }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/50 bg-white/60 px-4 py-4 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-ink-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative rounded-full p-2 text-ink-500 hover:bg-ink-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-ink-100"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
              {initials(user?.name) || <User className="h-4 w-4" />}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight text-ink-800">{user?.name}</p>
              <span className={`badge ${roleBadgeColor(user?.role)} !px-1.5 !py-0 text-[10px]`}>
                {user?.role}
              </span>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-ink-400 sm:block" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-popover animate-in"
            >
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(settingsPath);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
              >
                <KeyRound className="h-4 w-4" />
                Account settings
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onLogoutClick();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
