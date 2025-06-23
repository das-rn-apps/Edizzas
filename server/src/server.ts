// server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Code from "./models/Code";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in environment variables.");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*", // use your frontend URL in prod
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// REST API Routes
app.get("/api/code/:roomId", async (req, res) => {
  try {
    const code = await Code.findOne({ roomId: req.params.roomId });
    res.status(200).json(code || {});
  } catch (err) {
    console.error("Error fetching code:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/code", async (req, res) => {
  try {
    const { roomId, code } = req.body;
    if (!roomId || code === undefined) {
      res.status(400).json({ message: "roomId and code required" });
      return;
    }

    const result = await Code.findOneAndUpdate(
      { roomId },
      { code },
      { upsert: true, new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("Error saving code:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log(`🟢 Connected: ${socket.id}`);

  socket.on("join", (roomId: string) => {
    socket.join(roomId);
    console.log(`📥 ${socket.id} joined room: ${roomId}`);
  });

  socket.on(
    "codeChange",
    ({ roomId, code }: { roomId: string; code: string }) => {
      socket.to(roomId).emit("codeChange", code);
    }
  );

  socket.on("disconnect", () => {
    console.log(`🔌 Disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
