import React, { useEffect, useState } from 'react';
import Modal from '../../../components/common/Modal.jsx';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';
import * as adminService from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext.jsx';
import { validateName, validateEmail, validateAddress } from '../../../utils/validators.js';

const INITIAL = { name: '', email: '', address: '', owner_id: '' };

const CreateStoreModal = ({ open, onClose, onCreated }) => {
  const toast = useToast();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [owners, setOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setOwnersLoading(true);
    adminService
      .getUsers({ role: 'OWNER', limit: 100 })
      .then((res) => setOwners(res.data.users))
      .catch(() => toast.error('Could not load store owners.'))
      .finally(() => setOwnersLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const reset = () => {
    setForm(INITIAL);
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      owner_id: form.owner_id ? '' : 'Please select a store owner'
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await adminService.createStore({ ...form, owner_id: Number(form.owner_id) });
      reset();
      onCreated();
    } catch (err) {
      toast.error(err.message || 'Could not create store.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add Store"
      size="md"
      footer={
        <>
          <button className="btn-secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting && <LoadingSpinner size="sm" className="text-white" />}
            Create Store
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="cs-name">
            Store name
          </label>
          <input
            id="cs-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="20-60 characters"
            className={`input ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div>
          <label className="label" htmlFor="cs-email">
            Email
          </label>
          <input
            id="cs-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="store@example.com"
            className={`input ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label className="label" htmlFor="cs-address">
            Address
          </label>
          <textarea
            id="cs-address"
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={2}
            placeholder="Max 400 characters"
            className={`input resize-none ${errors.address ? 'input-error' : ''}`}
          />
          {errors.address && <p className="field-error">{errors.address}</p>}
        </div>

        <div>
          <label className="label" htmlFor="cs-owner">
            Store owner
          </label>
          <select
            id="cs-owner"
            name="owner_id"
            value={form.owner_id}
            onChange={handleChange}
            className={`input ${errors.owner_id ? 'input-error' : ''}`}
            disabled={ownersLoading}
          >
            <option value="">{ownersLoading ? 'Loading owners…' : 'Select an owner'}</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>
          {errors.owner_id && <p className="field-error">{errors.owner_id}</p>}
          {!ownersLoading && owners.length === 0 && (
            <p className="mt-1.5 text-xs text-ink-500">
              No OWNER accounts exist yet. Create one from the Users page first.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateStoreModal;
