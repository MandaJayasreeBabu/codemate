const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// CORS for Vercel client
const corsOptions = {
  origin: "https://codemate-61q2.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

// 🧠 ROOM-based logic
io.on("connection", (socket) => {
  console.log("🔌 A user connected: " + socket.id);

  // Join a room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`📦 Socket ${socket.id} joined room ${roomId}`);
  });

  // Broadcast code changes
  socket.on("code_change", ({ roomId, code }) => {
    socket.to(roomId).emit("code_change", code);
  });

  // Broadcast chat messages
  socket.on("chat_message", ({ roomId, message }) => {
    socket.to(roomId).emit("chat_message", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected: " + socket.id);
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Codemate backend is working!");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
