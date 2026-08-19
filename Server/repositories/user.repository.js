const pool = require('../config/pool');
const { buildOrderClause, buildPagination, likeParam } = require('../utils/queryHelpers');

const PUBLIC_FIELDS =
  'id, name, email, address, role, created_at, updated_at';

const SORT_FIELDS = {
  name: 'name',
  email: 'email',
  address: 'address',
  role: 'role',
  created_at: 'created_at'
};

exports.findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

exports.findById = async (id) => {
  const [rows] = await pool.query(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

exports.findByIdWithPassword = async (id) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

exports.create = async ({ name, email, passwordHash, address, role }) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, passwordHash, address, role || 'USER']
  );
  return exports.findById(result.insertId);
};

exports.updatePassword = async (id, passwordHash) => {
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [passwordHash, id]);
  return exports.findById(id);
};

// Admin listing: filter by name/email/address (LIKE) and role (exact), with
// whitelisted sort + pagination.
exports.findAndCount = async ({ name, email, address, role, sortBy, sortOrder, limit, offset }) => {
  const where = [];
  const params = [];

  if (name) {
    where.push('name LIKE ?');
    params.push(likeParam(name));
  }
  if (email) {
    where.push('email LIKE ?');
    params.push(likeParam(email));
  }
  if (address) {
    where.push('address LIKE ?');
    params.push(likeParam(address));
  }
  if (role) {
    where.push('role = ?');
    params.push(role);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const orderClause = buildOrderClause(sortBy, sortOrder, SORT_FIELDS, 'created_at');

  const [rows] = await pool.query(
    `SELECT ${PUBLIC_FIELDS} FROM users ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM users ${whereClause}`,
    params
  );

  return { rows, total: countRows[0].total };
};

exports.count = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
  return rows[0].total;
};

exports.isOwner = async (id) => {
  const [rows] = await pool.query('SELECT id FROM users WHERE id = ? AND role = ?', [id, 'OWNER']);
  return rows.length > 0;
};
