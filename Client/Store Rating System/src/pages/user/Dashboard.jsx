import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, TrendingUp } from 'lucide-react';
import StatCard from '../../components/common/StatCard.jsx';
import { SkeletonCard } from '../../components/common/Skeleton.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as storeService from '../../services/storeService';
import * as ratingService from '../../services/ratingService';

const UserDashboard = () => {
  const { user } = useAuth();
  const [totalStores, setTotalStores] = useState(0);
  const [myRatings, setMyRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [storesRes, ratings] = await Promise.all([
        storeService.getStores({ limit: 1 }),
        ratingService.getMyRatings()
      ]);
      setTotalStores(storesRes.total);
      setMyRatings(ratings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const avgGiven = myRatings.length
    ? (myRatings.reduce((sum, r) => sum + r.rating, 0) / myRatings.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Good morning, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="mt-1 text-sm text-ink-500">Discover stores and share your experience.</p>
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
              <StatCard label="Total Stores" value={totalStores} icon={Store} accent="primary" helper="Explore all stores" />
              <StatCard label="My Ratings" value={myRatings.length} icon={Star} accent="warning" helper="Store ratings given" />
              <StatCard label="Average Rating Given" value={avgGiven} icon={TrendingUp} accent="success" helper="Your average rating" />
            </>
          )}
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink-800">Ready to rate a store?</h3>
            <p className="mt-1 text-sm text-ink-500">Browse stores and share your experience with the community.</p>
          </div>
          <Link to="/user/stores" className="btn-primary shrink-0">
            Browse Stores
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
