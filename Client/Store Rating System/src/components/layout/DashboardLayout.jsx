import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const TITLES = {
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/users': 'Users',
  '/admin/stores': 'Stores',
  '/admin/settings': 'Settings',
  '/user/dashboard': 'Dashboard',
  '/user/stores': 'Stores',
  '/user/ratings': 'My Ratings',
  '/user/settings': 'Settings',
  '/owner/dashboard': 'Store Dashboard',
  '/owner/settings': 'Settings'
};

const resolveTitle = (pathname) => {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith('/admin/users/')) return 'User Details';
  return 'StoreRating';
};

const DashboardLayout = ({ settingsPath }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setConfirmOpen(false);
    toast.success('You have been logged out.');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50 bg-gradient-to-br from-ink-50 via-white to-primary-50/30">
      <Sidebar
        role={user?.role}
        onLogoutClick={() => setConfirmOpen(true)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          user={user}
          title={resolveTitle(location.pathname)}
          onMenuClick={() => setMobileOpen(true)}
          onLogoutClick={() => setConfirmOpen(true)}
          settingsPath={settingsPath}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Log out of StoreRating?"
        message="You'll need to sign in again to access your dashboard."
        confirmLabel="Logout"
        danger
        loading={loggingOut}
      />
    </div>
  );
};

export default DashboardLayout;
