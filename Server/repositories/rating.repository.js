const pool = require('../config/pool');

exports.findByUserAndStore = async (userId, storeId) => {
  const [rows] = await pool.query(
    'SELECT * FROM ratings WHERE user_id = ? AND store_id = ? LIMIT 1',
    [userId, storeId]
  );
  return rows[0] || null;
};

exports.findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM ratings WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

exports.create = async (userId, storeId, rating) => {
  const [result] = await pool.query(
    'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
    [userId, storeId, rating]
  );

  return exports.findById(result.insertId);
};

exports.updateByUserAndStore = async (userId, storeId, rating) => {
  await pool.query(
    `UPDATE ratings
     SET rating = ?, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = ? AND store_id = ?`,
    [rating, userId, storeId]
  );

  return exports.findByUserAndStore(userId, storeId);
};

exports.updateById = async (id, rating) => {
  await pool.query(
    `UPDATE ratings
     SET rating = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [rating, id]
  );

  return exports.findById(id);
};

exports.findAllByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT
        r.id,
        r.rating,
        r.created_at,
        r.updated_at,
        s.id AS store_id,
        s.name AS store_name,
        s.address AS store_address
     FROM ratings r
     JOIN stores s ON s.id = r.store_id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC`,
    [userId]
  );

  return rows;
};

// All raters + rating values for a set of store IDs
exports.findRatersForStores = async (storeIds) => {
  if (!storeIds.length) return [];

  const placeholders = storeIds.map(() => '?').join(', ');

  const [rows] = await pool.query(
    `SELECT
        r.store_id,
        r.rating,
        u.id AS user_id,
        u.name,
        u.email
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id IN (${placeholders})
     ORDER BY r.created_at DESC`,
    storeIds
  );

  return rows;
};

// Used for admin's user details screen
exports.findAverageForOwner = async (ownerId) => {
  const [rows] = await pool.query(
    `SELECT
        COALESCE(ROUND(AVG(r.rating), 2), NULL) AS avgRating
     FROM ratings r
     JOIN stores s ON s.id = r.store_id
     WHERE s.owner_id = ?`,
    [ownerId]
  );

  return rows[0].avgRating;
};

exports.count = async () => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS total FROM ratings'
  );

  return rows[0].total;
};

/*
 * Global rating analytics for Admin Dashboard.
 *
 * Returns:
 * - totalRatings
 * - averageRating
 * - ratingDistribution
 */
exports.getGlobalAnalytics = async () => {
  const [rows] = await pool.query(
    `SELECT
        COUNT(*) AS totalRatings,
        COALESCE(ROUND(AVG(rating), 2), 0) AS averageRating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS fiveStar,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS fourStar,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS threeStar,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS twoStar,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS oneStar
     FROM ratings`
  );

  const data = rows[0];

  return {
    totalRatings: Number(data.totalRatings),
    averageRating: Number(data.averageRating),
    ratingDistribution: {
      5: Number(data.fiveStar),
      4: Number(data.fourStar),
      3: Number(data.threeStar),
      2: Number(data.twoStar),
      1: Number(data.oneStar)
    }
  };
};