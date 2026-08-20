import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import RatingStars from './RatingStars.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const RatingModal = ({ open, onClose, store, onSubmit, submitting }) => {
  const [rating, setRating] = useState(store?.myRating || 0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setRating(store?.myRating || 0);
      setError('');
    }
  }, [open, store]);

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a star rating before submitting.');
      return;
    }
    setError('');
    await onSubmit(rating);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={store?.myRating ? 'Update your rating' : 'Rate this store'}
      size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting && <LoadingSpinner size="sm" className="text-white" />}
            {store?.myRating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div>
          <p className="text-sm font-semibold text-ink-900">{store?.name}</p>
          <p className="text-xs text-ink-500">{store?.address}</p>
        </div>
        <RatingStars value={rating} onChange={setRating} interactive size="lg" label="Select your rating" />
        {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
      </div>
    </Modal>
  );
};

export default RatingModal;
