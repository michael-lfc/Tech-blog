import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import userRouter from './controllers/users.js';
import postRouter from './controllers/posts.js';
import { connectDB } from './db.js';
import tokenValidation from './middlewares/tokenValidation.js';
import countryRoutes from './src/routes/countryRoutes.js';
import statusRoute from './src/routes/statusRoute.js';
import { sequelize } from './src/config/db.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Ensure cache folder exists
const cacheDir = process.env.CACHE_DIR || './cache';
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
  console.log(`✅ Cache folder created at ${cacheDir}`);
}

// Connect to MongoDB / MySQL via Sequelize and connectDB
connectDB();

// Sync Sequelize DB and start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // ⚠️ TEMP FIX: drop & recreate tables to avoid "Too many keys" error
    await sequelize.sync({ force: true });
    console.log('✅ Database synced successfully (force: true)');

    // Routes
    app.use('/countries', countryRoutes);
    app.use('/status', statusRoute);

    app.use('/api/users', userRouter);
    app.use('/api/posts', tokenValidation, postRouter);

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({ message: 'Server is up and running!' });
    });

    // Generic error handler
    app.use((err, req, res, next) => {
      console.error(err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Unable to connect to database:', err);
    process.exit(1);
  }
})();

export default app; // ✅ For Vercel or other deployment platforms
