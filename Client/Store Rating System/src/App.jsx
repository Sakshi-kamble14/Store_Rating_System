import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import RoleRoute from './components/common/RoleRoute.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';

import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Forbidden from './pages/errors/Forbidden.jsx';
import NotFound from './pages/errors/NotFound.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminUserDetails from './pages/admin/UserDetails.jsx';
import AdminStores from './pages/admin/Stores.jsx';
import AdminSettings from './pages/admin/Settings.jsx';

import UserDashboard from './pages/user/Dashboard.jsx';
import UserStores from './pages/user/Stores.jsx';
import UserRatings from './pages/user/MyRatings.jsx';
import UserSettings from './pages/user/Settings.jsx';

import OwnerDashboard from './pages/owner/Dashboard.jsx';
import OwnerSettings from './pages/owner/Settings.jsx';

const HomeRedirect = () => {
  const { isAuthenticated, user, initializing, roleHome } = useAuth();
  if (initializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={roleHome(user.role)} replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/403" element={<Forbidden />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allow={['ADMIN']} />}>
          <Route element={<DashboardLayout settingsPath="/admin/settings" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />
            <Route path="/admin/stores" element={<AdminStores />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allow={['USER']} />}>
          <Route element={<DashboardLayout settingsPath="/user/settings" />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/stores" element={<UserStores />} />
            <Route path="/user/ratings" element={<UserRatings />} />
            <Route path="/user/settings" element={<UserSettings />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allow={['OWNER']} />}>
          <Route element={<DashboardLayout settingsPath="/owner/settings" />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
