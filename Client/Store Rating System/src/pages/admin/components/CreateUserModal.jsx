import React, { useState } from 'react';
import Modal from '../../../components/common/Modal.jsx';
import PasswordInput from '../../../components/common/PasswordInput.jsx';
import LoadingSpinner from '../../../components/common/LoadingSpinner.jsx';
import * as adminService from '../../../services/adminService';
import { useToast } from '../../../context/ToastContext.jsx';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../../utils/validators.js';

const INITIAL = { name: '', email: '', address: '', password: '', role: 'USER' };

const CreateUserModal = ({ open, onClose, onCreated }) => {
  const toast = useToast();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      password: validatePassword(form.password)
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await adminService.createUser(form);
      reset();
      onCreated();
    } catch (err) {
      toast.error(err.message || 'Could not create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add User"
      size="md"
      footer={
        <>
          <button className="btn-secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting && <LoadingSpinner size="sm" className="text-white" />}
            Create User
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="cu-name">
            Full name
          </label>
          <input
            id="cu-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="20-60 characters"
            className={`input ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div>
          <label className="label" htmlFor="cu-email">
            Email
          </label>
          <input
            id="cu-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className={`input ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label className="label" htmlFor="cu-address">
            Address
          </label>
          <textarea
            id="cu-address"
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
          <label className="label" htmlFor="cu-password">
            Password
          </label>
          <PasswordInput id="cu-password" name="password" value={form.password} onChange={handleChange} error={errors.password} />
        </div>

        <div>
          <label className="label" htmlFor="cu-role">
            Role
          </label>
          <select id="cu-role" name="role" value={form.role} onChange={handleChange} className="input">
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default CreateUserModal;
