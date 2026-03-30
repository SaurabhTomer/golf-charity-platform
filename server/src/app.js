import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes         from './routes/auth.routes.js';
import scoreRoutes        from './routes/score.routes.js';
import drawRoutes         from './routes/draw.routes.js';
import charityRoutes      from './routes/charity.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import adminRoutes        from './routes/admin.routes.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth',          authRoutes);
app.use('/api/scores',        scoreRoutes);
app.use('/api/draws',         drawRoutes);
app.use('/api/charities',     charityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin',         adminRoutes);

app.get('/', (req, res) => res.json({ status: 'Golf Charity API running' }));

export default app;