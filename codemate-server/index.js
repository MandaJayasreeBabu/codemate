const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// ✅ Enable CORS to allow frontend on Vercel to talk to this server
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

// ✅ Optional: root route to show server is running in browser
app.get('/', (req, res) => {
  res.send('Codemate backend is live! 🚀');
});

// ✅ Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-change', code);
  });

  socket.on('chat-message', ({ roomId, message }) => {
    socket.to(roomId).emit('chat-message', message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ✅ Important: use Render’s dynamic PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
