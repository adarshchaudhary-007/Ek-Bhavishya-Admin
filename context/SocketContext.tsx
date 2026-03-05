'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const { hasToken } = useAuth();

  useEffect(() => {
    if (!hasToken) {
      disconnectSocket();
      setIsConnected(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setIsConnected(false);
      return;
    }

    try {
      connectSocket(token);
      const connectedSocket = getSocket();

      if (!connectedSocket) {
        setIsConnected(false);
        return;
      }

      const handleConnect = () => {
        setIsConnected(true);
        console.log('Socket connected in context');
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        console.log('Socket disconnected in context');
      };

      connectedSocket.on('connect', handleConnect);
      connectedSocket.on('disconnect', handleDisconnect);
      setIsConnected(connectedSocket.connected);

      return () => {
        connectedSocket.off('connect', handleConnect);
        connectedSocket.off('disconnect', handleDisconnect);
      };
    } catch (error) {
      console.error('Failed to connect socket:', error);
      setIsConnected(false);
      return;
    }
  }, [hasToken]);

  const value = useMemo(
    () => ({ socket: getSocket(), isConnected }),
    [isConnected],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
