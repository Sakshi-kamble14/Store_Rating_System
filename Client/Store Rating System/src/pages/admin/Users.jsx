import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterDropdown from '../../components/common/FilterDropdown.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Badge from '../../components/common/Badge.jsx';
import CreateUserModal from './components/CreateUserModal.jsx';
import * as adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';
import { roleBadgeColor } from '../../utils/formatters.js';

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'USER', label: 'User' },
  { value: 'OWNER', label: 'Owner' },
  { value: 'ADMIN', label: 'Admin' }
];

const LIMIT = 10;

const AdminUsers = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [nameQuery, setNameQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getUsers({
        name: nameQuery || undefined,
        email: emailQuery || undefined,
        address: addressQuery || undefined,
        role: role || undefined,
        sortBy,
        sortOrder,
        page,
        limit: LIMIT
      });
      setRows(res.data.users);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameQuery, emailQuery, addressQuery, role, sortBy, sortOrder, page]);

  const handleSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleCreated = () => {
    setCreateOpen(false);
    toast.success('User created successfully.');
    setPage(1);
    load();
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => <Badge className={roleBadgeColor(row.role)}>{row.role}</Badge>
    },
    { key: 'address', label: 'Address', sortable: true, className: 'max-w-[220px] truncate' },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-16',
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/users/${row.id}`)}
          className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-primary-600"
          aria-label={`View ${row.name}`}
        >
          <Eye className="h-4 w-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-ink-900">Users</h2>
          <p className="mt-1 text-sm text-ink-500">Manage all users in the system.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <div className="card space-y-3 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SearchBar value={nameQuery} onChange={(v) => { setNameQuery(v); setPage(1); }} placeholder="Search by name..." />
          <SearchBar value={emailQuery} onChange={(v) => { setEmailQuery(v); setPage(1); }} placeholder="Search by email..." />
          <SearchBar value={addressQuery} onChange={(v) => { setAddressQuery(v); setPage(1); }} placeholder="Search by address..." />
        </div>
        <div className="flex justify-end">
          <FilterDropdown
            label="Filter by role"
            value={role}
            onChange={(v) => { setRole(v); setPage(1); }}
            options={ROLE_OPTIONS}
            className="w-44"
          />
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          error={error}
          onRetry={load}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyTitle="No users found"
          emptyMessage="Try a different search term or clear your filters."
        />
        <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={handleCreated} />
    </div>
  );
};

export default AdminUsers;
