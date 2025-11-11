import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import cron from "node-cron";
import Note from "./models/Note.js"; 

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

// Security middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS: only allow frontend origin
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🧹 Cleaning up old trashed notes...");
    const result = await Note.deleteMany({
      isTrashed: true,
      updatedAt: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });
    console.log(`✅ Deleted ${result.deletedCount} old trashed notes.`);
  } catch (err) {
    console.error("❌ Error while cleaning trash:", err);
  }
});