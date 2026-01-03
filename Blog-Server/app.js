import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./controllers/users.js";
import postRouter from "./controllers/posts.js";
import { connectDB } from "./db.js";
import tokenValidation from "./middlewares/tokenValidation.js";

dotenv.config();

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(express.json());

// CORS setup for Vercel frontend + local dev
const allowedOrigins = [
  "http://localhost:3000",              // local React dev
  process.env.FRONTEND_URL               // deployed frontend on Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

/* =====================
   DATABASE
===================== */
connectDB();

/* =====================
   ROUTES
===================== */
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use("/api/users", userRouter);
app.use("/api/posts", tokenValidation, postRouter);

/* =====================
   SERVER (RENDER)
===================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
