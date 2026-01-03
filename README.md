📝 Tech-blog






A full-stack blogging platform built with React and Node.js + Express, allowing users to create posts, react with emojis, comment, and manage profiles. Fully deployed with Vercel (frontend) and Render (backend).

🌟 Live Demo

Frontend (Vercel): https://tech-blog-qz17.vercel.app

Backend API (Render): https://tech-blog-5-28i4.onrender.com

🎨 Features

✅ User authentication (login/register)

✅ Create, edit, and delete posts

✅ React to posts with emojis

✅ Comment on posts

✅ View public profiles

✅ Responsive design for mobile & desktop

📁 Project Structure
Tech-blog/
├─ client/        # React frontend
│  ├─ public/
│  ├─ src/
│  └─ package.json
└─ server/        # Node.js backend
   ├─ controllers/
   ├─ middlewares/
   ├─ models/
   ├─ db.js
   └─ package.json

⚡ Screenshots

Homepage

Post Detail / Comment / React

Replace these images with actual screenshots of your app.

🛠️ Tech Stack
Frontend	Backend	Database	Deployment
React	Node.js	MongoDB	Vercel (frontend), Render (backend)
CSS	Express		
💻 Getting Started (Local)
Backend Setup

Navigate to the server folder:

cd server


Install dependencies:

npm install


Create a .env file with placeholder values:

PORT=5000
MONGO_URI=your_mongo_connection_string_here
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:3000


Replace these with your real secrets locally. Never commit your real .env to GitHub.

Start the backend server:

npm start


The backend runs at http://localhost:5000.

Frontend Setup

Navigate to the client folder:

cd client


Install dependencies:

npm install


Create a .env file:

REACT_APP_API_BASE=http://localhost:5000/api


Start the frontend:

npm start


The frontend runs at http://localhost:3000.

🚀 Deployment
Backend (Render)

Root Directory: server/

Environment Variables (set in Render dashboard):

FRONTEND_URL=https://tech-blog-qz17.vercel.app
PORT=5000
MONGO_URI=your_mongo_connection_string_here
JWT_SECRET=your_jwt_secret_here


Use your real secrets here, not the placeholders.

Frontend (Vercel)

Root Directory: client/

Build Command: npm run build

Output Directory: build

Environment Variable:

REACT_APP_API_BASE=https://tech-blog-5-28i4.onrender.com/api

🔗 API Endpoints
Users

POST /api/users/register → Register new user

POST /api/users/login → Login

GET /api/users/profile → Get your profile

PUT /api/users/me → Update your profile

GET /api/users/public/:id → View public profile

Posts

GET /api/posts → Fetch posts

POST /api/posts → Create post

POST /api/posts/:postId/react → React with emoji

POST /api/posts/:postId/comments → Add comment

Most post routes require a JWT token in Authorization headers.

🤝 Contributing

Fork the repository

Create a branch: git checkout -b feature-name

Make your changes

Commit: git commit -m "Add feature"

Push: git push origin feature-name

Open a Pull Request

📄 License
