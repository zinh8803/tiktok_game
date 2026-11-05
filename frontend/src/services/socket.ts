import { io, Socket } from 'socket.io-client';

export function createRoomSocket(roomCode = 'KB2026'): Socket {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
  const socket = io(socketUrl, {
    query: { roomCode: roomCode.toUpperCase() },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    socket.emit('room.join', { roomCode: roomCode.toUpperCase() });
  });

  return socket;
}

