const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ✅ Define CORS options
const corsOptions = {
  origin: "https://codemate-61q2-r2sw78qsn-jayasrees-projects-efec99c6.vercel.app", // your Vercel frontend URL
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
  console.log("🔌 A user connected: " + socket.id);

  // 🎯 Broadcast code changes to others
  socket.on("code_change", (data) => {
    socket.broadcast.emit("code_change", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected: " + socket.id);
  });
});

// ✅ Add a default test route
app.get("/", (req, res) => {
  res.send("Codemate backend is working!");
});

// ✅ Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
