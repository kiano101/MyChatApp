import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://192.168.1.104:5000', {
      transports: ['websocket', 'polling'],
    });
    console.log('Socket initialized from socket.js')
  }
  return socket;
};
