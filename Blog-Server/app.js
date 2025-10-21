import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './controllers/users.js';
import postRouter from './controllers/posts.js';
import { connectDB } from './db.js';
import tokenValidation from './middlewares/tokenValidation.js';

dotenv.config();
const app = express();

// Middleware
// app.use(cors());

app.use(cors({
  origin: "https://your-frontend.vercel.app",
  credentials: true  // only needed if you send cookies
}));


app.use(express.json());

// Database
connectDB();

// Routes
app.use('/api/users', userRouter);
app.use('/api/posts', tokenValidation, postRouter);
// app.use('/api/posts', postRouter);

// ✅ Add this route for root path:
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Only listen locally (not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app; // ✅ Don’t forget this for Vercel
