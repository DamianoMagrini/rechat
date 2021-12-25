import { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io('http://localhost:3001');
export const SocketContext = createContext<Socket>(socket);
export const useSocket = () => useContext(SocketContext);
