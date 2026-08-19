const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const storeRoutes = require('./routes/store.routes');
const ratingRoutes = require('./routes/rating.routes');
const ownerRoutes = require('./routes/owner.routes');
const errorHandler = require('./middleware/error.middleware');
const AppError = require('./utils/AppError');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.status(200).json({ status: 'success', message: 'API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
app.use(errorHandler);

module.exports = app;
