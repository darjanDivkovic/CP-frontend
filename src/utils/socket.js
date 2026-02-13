import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL 
  || 'http://localhost:5000';   // match your backend PORT

export const socket = io(SOCKET_URL, {
 withCredentials: true,
  autoConnect: false,
  transports: ["polling", "websocket"],

  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});