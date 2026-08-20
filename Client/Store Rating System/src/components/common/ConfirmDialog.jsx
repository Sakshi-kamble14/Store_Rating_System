import React from 'react';
import Modal from './Modal.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <button className="btn-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button
          className={danger ? 'btn-danger' : 'btn-primary'}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && <LoadingSpinner size="sm" className="text-white" />}
          {confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-sm text-ink-600">{message}</p>
  </Modal>
);

export default ConfirmDialog;
