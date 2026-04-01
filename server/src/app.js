import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

import authRoutes         from './routes/auth.routes.js';
import scoreRoutes        from './routes/score.routes.js';
import drawRoutes         from './routes/draw.routes.js';
import charityRoutes      from './routes/charity.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import adminRoutes        from './routes/admin.routes.js';
import winnerRoutes       from './routes/winner.routes.js';

const app = express();

// Fix CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://golf-charity-platform-eosin-six.vercel.app',
    process.env.CLIENT_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth',          authRoutes);
app.use('/api/scores',        scoreRoutes);
app.use('/api/draws',         drawRoutes);
app.use('/api/charities',     charityRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/winners',       winnerRoutes);

app.get('/', (req, res) => res.json({ status: 'Golf Charity API running' }));

export default app;