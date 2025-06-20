const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "https://codemate-61q2.vercel.app", // ✅ Use final deployed frontend URL
  methods: ["GET", "POST"],
  credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions,
});

// ✅ Socket.IO Logic
io.on("connection", (socket) => {
  console.log("🔌 A user connected: " + socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`🛏️ Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("chat-message", ({ roomId, message }) => {
    socket.to(roomId).emit("chat-message", message);
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", code);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected: " + socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Codemate backend is working!");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
