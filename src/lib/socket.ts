import { io } from 'socket.io-client';

// Use the APP_URL from env if available, otherwise fallback to window.location.origin
const url = (import.meta as any).env.VITE_APP_URL || window.location.origin;

export const socket = io(url, {
  autoConnect: false,
});
