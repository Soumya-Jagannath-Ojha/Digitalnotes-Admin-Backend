import express from 'express';    //modern ES Modules approach! "type": "module" in package.json
import cors from 'cors';
import cookieParser from "cookie-parser";

// Import routes
import authRoutes from '../routes/auth.route.js';
import usersRoutes from '../routes/users.route.js';
import documentsRoutes from '../routes/documents.route.js';
import reviewsRoutes from '../routes/reviews.route.js';

import { connectDB } from '../lib/db.js';
import environment from '../SecureCode.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Credentials'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400
  })
);

app.options('*', cors()); // Enable preflight for all routes

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// All routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/reviews", reviewsRoutes);

// Start server
const PORT = environment.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);  
  connectDB();
});
