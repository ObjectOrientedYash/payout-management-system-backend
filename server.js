import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

import authRoutes from './routes/auth.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import payoutRoutes from './routes/payout.routes.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : [];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Payout Management System server is running',
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});

app.use('/auth', authRoutes);
app.use('/vendors', vendorRoutes);
app.use('/payouts', payoutRoutes);

await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server started on port ${PORT}`)
);