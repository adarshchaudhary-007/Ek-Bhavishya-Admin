import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token: string, baseURL: string = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000') {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  try {
    socket = io(baseURL, {
      auth: {
        token: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect socket...');
    });

    return socket;
  } catch (error) {
    console.error('Failed to connect socket:', error);
    return null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

// Chat-related events
export function sendMessage(conversationId: string, content: string, attachments?: any[]) {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('message:send', { conversationId, content, attachments });
}

export function joinChat(conversationId: string) {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('chat:join', { conversationId });
}

export function leaveChat(conversationId: string) {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('chat:leave', { conversationId });
}

export function setTyping(conversationId: string, isTyping: boolean) {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('typing:set', { conversationId, isTyping });
}

export function markMessagesAsRead(conversationId: string, messageIds: string[]) {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('messages:read', { conversationId, messageIds });
}

// Call-related events
export function emitCallEvent(eventName: string, data: any) {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.emit(eventName, data);
}

// Subscribe to events
export function onSocketEvent(eventName: string, callback: (data: any) => void) {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  socket.on(eventName, callback);
}

// Unsubscribe from events
export function offSocketEvent(eventName: string, callback?: (data: any) => void) {
  if (!socket) {
    console.error('Socket not connected');
    return;
  }
  if (callback) {
    socket.off(eventName, callback);
  } else {
    socket.off(eventName);
  }
}
