import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Code from "./models/Code";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Get and Save code
app.get("/api/code/:roomId", async (req, res) => {
  const code = await Code.findOne({ roomId: req.params.roomId });
  res.json(code || {});
});

app.post("/api/code", async (req, res) => {
  const { roomId, code } = req.body;
  const result = await Code.findOneAndUpdate(
    { roomId },
    { code },
    { upsert: true, new: true }
  );
  res.json(result);
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("👤 Connected:", socket.id);

  socket.on("join", (roomId: string) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room: ${roomId}`);
  });

  socket.on(
    "codeChange",
    ({ roomId, code }: { roomId: string; code: string }) => {
      socket.to(roomId).emit("codeChange", code);
    }
  );

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

server.listen(4000, () => console.log("🚀 Server on http://localhost:4000"));
