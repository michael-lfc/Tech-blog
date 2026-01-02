// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import userRouter from './controllers/users.js';
// import postRouter from './controllers/posts.js';
// import { connectDB } from './db.js';
// import tokenValidation from './middlewares/tokenValidation.js';

// dotenv.config();
// const app = express();

// // CORS (updated with your real frontend URL)
// // app.use(
// //   cors({
// //     origin: "https://blog-client-lbfpasy48-michaels-projects-62bd8962.vercel.app",
// //     credentials: true,
// //   })
// // );

// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "https://tech-blog-2yym.vercel.app"   // NEW FRONTEND!!!!
//   ],
//   credentials: true
// }));

// app.use(express.json());

// // Connect Database
// connectDB();

// // Base API route
// // app.get("/api", (req, res) => {
// //   res.send("API is live. Use /api/users or /api/posts.");
// // });

// // User routes
// app.use('/api/users', userRouter);

// // Post routes (protected)
// app.use('/api/posts', tokenValidation, postRouter);

// // Root route
// app.get("/", (req, res) => {
//   res.send("Server is up and running!");
// });

// // Local server (Heroku ignores this when deployed)
// if (!process.env.VERCEL) {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// export default app;

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
app.use(cors({ origin: "*" }));

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
