import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, Star, ArrowRight } from 'lucide-react';
import StatCard from '../../components/common/StatCard.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import * as adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Overview of your system</h2>
        <p className="mt-1 text-sm text-ink-500">Key metrics across users, stores, and ratings.</p>
      </div>

      {error && !loading && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard label="Total Users" value={stats.totalUsers} icon={Users} accent="primary" helper="View all users" />
              <StatCard label="Total Stores" value={stats.totalStores} icon={Store} accent="success" helper="View all stores" />
              <StatCard label="Total Ratings" value={stats.totalRatings} icon={Star} accent="warning" helper="View all ratings" />
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-800">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              to="/admin/users"
              className="group flex items-center justify-between rounded-xl bg-white/40 border border-ink-200 px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft hover:border-primary-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 ring-1 ring-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-primary-700 transition-colors">Manage Users</p>
                  <p className="text-xs text-ink-500 mt-0.5">Add, edit and view users</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
            <Link
              to="/admin/stores"
              className="group flex items-center justify-between rounded-xl bg-white/40 border border-ink-200 px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft hover:border-success-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-success-50 to-success-100 text-success-600 ring-1 ring-success-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900 group-hover:text-success-700 transition-colors">Manage Stores</p>
                  <p className="text-xs text-ink-500 mt-0.5">Add, edit and view stores</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-success-500 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink-800">System Snapshot</h3>
          <p className="text-sm text-ink-500">
            {loading
              ? 'Loading system snapshot…'
              : `Your platform currently has ${stats.totalUsers} users across ${stats.totalStores} stores, with ${stats.totalRatings} ratings submitted in total.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
