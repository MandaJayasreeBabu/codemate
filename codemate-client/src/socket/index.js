import { io } from "socket.io-client";

const socket = io("https://codemate-rkil.onrender.com", {
  transports: ["websocket"],
  withCredentials: true
});

export default socket;
