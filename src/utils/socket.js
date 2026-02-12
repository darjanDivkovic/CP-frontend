import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL 
  || 'http://localhost:5000';   // match your backend PORT

export const socket = io(SOCKET_URL, {
  withCredentials: true,        // important if you use cookies / auth
  autoConnect: false,           // we connect manually after authorization
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});