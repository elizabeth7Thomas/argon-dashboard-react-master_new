import { io } from "socket.io-client";

const socket = io("http://64.23.169.22:3002", {
  transports: ["websocket"],
});

export default socket;
