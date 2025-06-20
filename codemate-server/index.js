const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Define CORS options
const corsOptions = {
  origin: "https://codemate-61q2.vercel.app", // your actual frontend URL
  methods: ["GET", "POST"],
  credentials: true
};

// ✅ Apply CORS middleware to Express
app.use(cors(corsOptions));

// ✅ Create Socket.IO server with CORS options
const io = new Server(server, {
  cors: corsOptions
});

// ✅ Socket.IO server logic
io.on("connection", (socket) => {
  console.log("🔌 New user connected:", socket.id);

  // Join a specific room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`✅ User ${socket.id} joined room ${roomId}`);
  });

  // Broadcast chat messages to others in the room
  socket.on("chat-message", ({ roomId, message }) => {
    socket.to(roomId).emit("chat-message", message);
  });

  // Broadcast code changes to others in the room
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("code-change", code);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Codemate backend is working!");
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
