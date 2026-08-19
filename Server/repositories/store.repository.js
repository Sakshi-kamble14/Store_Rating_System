const pool = require('../config/pool');
const { buildOrderClause, buildPagination, likeParam } = require('../utils/queryHelpers');

const ADMIN_SORT_FIELDS = {
  name: 's.name',
  email: 's.email',
  address: 's.address',
  created_at: 's.created_at'
};

const USER_SORT_FIELDS = {
  name: 's.name',
  address: 's.address',
  created_at: 's.created_at'
};

exports.create = async ({ name, email, address, owner_id }) => {
  const [result] = await pool.query(
    'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
    [name, email, address, owner_id]
  );
  return exports.findById(result.insertId);
};

exports.findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM stores WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

exports.findByOwner = async (ownerId) => {
  const [rows] = await pool.query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);
  return rows;
};

// Admin listing: name/email/address filters + AVG rating, sortable, paginated.
exports.findAndCountForAdmin = async ({ name, email, address, sortBy, sortOrder, limit, offset }) => {
  const where = [];
  const params = [];

  if (name) {
    where.push('s.name LIKE ?');
    params.push(likeParam(name));
  }
  if (email) {
    where.push('s.email LIKE ?');
    params.push(likeParam(email));
  }
  if (address) {
    where.push('s.address LIKE ?');
    params.push(likeParam(address));
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const orderClause = buildOrderClause(sortBy, sortOrder, ADMIN_SORT_FIELDS, 'created_at');

  const [rows] = await pool.query(
    `SELECT
        s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS averageRating
     FROM stores s
     LEFT JOIN ratings r ON s.id = r.store_id
     ${whereClause}
     GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM stores s ${whereClause}`,
    params
  );

  return { rows, total: countRows[0].total };
};

// Normal-user listing: search by name/address, includes overall rating and
// the logged-in user's own submitted rating via a LEFT JOIN.
exports.findAndCountForUser = async ({ name, address, sortBy, sortOrder, limit, offset, userId }) => {
  const where = [];
  const params = [];

  if (name) {
    where.push('s.name LIKE ?');
    params.push(likeParam(name));
  }
  if (address) {
    where.push('s.address LIKE ?');
    params.push(likeParam(address));
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const orderClause = buildOrderClause(sortBy, sortOrder, USER_SORT_FIELDS, 'created_at');

  const [rows] = await pool.query(
    `SELECT
        s.id, s.name, s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS overallRating,
        ur.rating AS myRating
     FROM stores s
     LEFT JOIN ratings r ON s.id = r.store_id
     LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
     ${whereClause}
     GROUP BY s.id, s.name, s.address, ur.rating
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [userId, ...params, limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM stores s ${whereClause}`,
    params
  );

  return { rows, total: countRows[0].total };
};

// Store-owner dashboard: average rating per store owned by this user.
exports.findOwnerStoresWithAverage = async (ownerId) => {
  const [rows] = await pool.query(
    `SELECT
        s.id, s.name, s.address,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating
     FROM stores s
     LEFT JOIN ratings r ON s.id = r.store_id
     WHERE s.owner_id = ?
     GROUP BY s.id, s.name, s.address`,
    [ownerId]
  );
  return rows;
};

exports.count = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM stores');
  return rows[0].total;
};
