const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Correct CORS origin: use your real deployed frontend URL from Vercel
const corsOptions = {
  origin: "https://codemate-61q2.vercel.app", // ✅ Make sure this matches Vercel domain!
  methods: ["GET", "POST"],
  credentials: true
};

// ✅ Apply CORS
app.use(cors(corsOptions));

// ✅ Create Socket.IO server with CORS
const io = new Server(server, {
  cors: corsOptions
});

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Codemate backend is working!");
});

// ✅ Socket.IO Logic
io.on("connection", (socket) => {
  console.log("🔌 A user connected: " + socket.id);

  // 🎯 Sync code with others
  socket.on("code_change", (data) => {
    socket.broadcast.emit("code_change", data);
  });

  // Optional: Room-based implementation
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("code_change_room", ({ roomId, code }) => {
    socket.to(roomId).emit("code_change_room", code);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected: " + socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
