import React, { useEffect, useState } from 'react';
import { Plus, Star } from 'lucide-react';
import SearchBar from '../../components/common/SearchBar.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import CreateStoreModal from './components/CreateStoreModal.jsx';
import * as adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';
import { formatRating } from '../../utils/formatters.js';

const LIMIT = 10;

const AdminStores = () => {
  const toast = useToast();

  const [nameQuery, setNameQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [ownerMap, setOwnerMap] = useState({});

  // Build an owner_id -> name/email lookup from the existing admin/users API
  // (the store listing API only returns owner_id, and we're told not to
  // invent a dedicated owners endpoint).
  const loadOwners = async () => {
    try {
      const res = await adminService.getUsers({ role: 'OWNER', limit: 100 });
      const map = {};
      res.data.users.forEach((u) => {
        map[u.id] = u;
      });
      setOwnerMap(map);
    } catch {
      // Non-fatal: the table will just show the raw owner id if this fails.
    }
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getStores({
        name: nameQuery || undefined,
        email: emailQuery || undefined,
        address: addressQuery || undefined,
        sortBy,
        sortOrder,
        page,
        limit: LIMIT
      });
      setRows(res.data.stores);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameQuery, emailQuery, addressQuery, sortBy, sortOrder, page]);

  const handleSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleCreated = () => {
    setCreateOpen(false);
    toast.success('Store created successfully.');
    setPage(1);
    load();
    loadOwners();
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true, className: 'max-w-[220px] truncate' },
    {
      key: 'owner_id',
      label: 'Owner',
      sortable: false,
      render: (row) => ownerMap[row.owner_id]?.name || `#${row.owner_id}`
    },
    {
      key: 'averageRating',
      label: 'Rating',
      sortable: false,
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-semibold text-ink-800">
          <Star className="h-3.5 w-3.5 fill-warning-500 text-warning-500" />
          {formatRating(row.averageRating)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Stores</h2>
          <p className="mt-1 text-sm text-ink-500">Manage all registered stores.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Store
        </button>
      </div>

      <div className="glass-panel rounded-2xl grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
        <SearchBar value={nameQuery} onChange={(v) => { setNameQuery(v); setPage(1); }} placeholder="Search by name..." />
        <SearchBar value={emailQuery} onChange={(v) => { setEmailQuery(v); setPage(1); }} placeholder="Search by email..." />
        <SearchBar value={addressQuery} onChange={(v) => { setAddressQuery(v); setPage(1); }} placeholder="Search by address..." />
      </div>

      <div className="card overflow-hidden p-0 border-0 shadow-soft">
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          error={error}
          onRetry={load}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyTitle="No stores found"
          emptyMessage="Try a different search term or add a new store."
        />
        <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>

      <CreateStoreModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} />
    </div>
  );
};

export default AdminStores;
