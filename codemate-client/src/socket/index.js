import { io } from 'socket.io-client';

const socket = io('https://codemate-server.onrender.com');

export default socket;
