// Turns a requested sortBy/sortOrder pair into a safe "ORDER BY" fragment.
// allowedFieldsMap maps public field names -> actual "table.column" SQL, so
// user-provided sortBy can never be interpolated directly into the query.
exports.buildOrderClause = (sortBy, sortOrder, allowedFieldsMap, defaultField) => {
  const column = allowedFieldsMap[sortBy] || allowedFieldsMap[defaultField];
  const direction = String(sortOrder).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return `ORDER BY ${column} ${direction}`;
};

// Normalizes page/limit query params into safe integers + OFFSET.
exports.buildPagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

// Wraps a value for a parameterized LIKE query.
exports.likeParam = (value) => `%${value}%`;
