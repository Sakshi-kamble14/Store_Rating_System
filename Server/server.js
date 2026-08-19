require('dotenv').config();
const app = require('./app');
const pool = require('./config/pool');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Verify the MySQL connection pool can reach the database before serving traffic.
    const connection = await pool.getConnection();
    console.log('Database connection established.');
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
};

start();

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});
