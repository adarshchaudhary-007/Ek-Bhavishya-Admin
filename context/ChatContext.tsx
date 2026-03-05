'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Message {
  _id: string;
  content: string;
  sender: string;
  senderName: string;
  timestamp: Date;
  attachments?: unknown[];
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface UIConversation {
  _id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
}

type ChatAction =
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string }
  | { type: 'ADD_CONVERSATION'; payload: UIConversation }
  | { type: 'UPDATE_CONVERSATION'; payload: { id: string; updates: Partial<UIConversation> } }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'MARK_AS_READ'; payload: { conversationId: string; messageIds: string[] } }
  | { type: 'SET_TYPING'; payload: { conversationId: string; isTyping: boolean } }
  | { type: 'SET_LOADING'; payload: { conversationId: string; isLoading: boolean } };

interface ChatContextValue {
  conversations: Map<string, UIConversation>;
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string, attachments?: unknown[]) => Promise<void>;
  loadConversationHistory: (conversationId: string, page?: number) => Promise<void>;
  markMessagesAsRead: (conversationId: string, messageIds: string[]) => void;
  setTypingStatus: (conversationId: string, isTyping: boolean) => void;
  getOrCreateConversation: (participantId: string, participantName: string) => Promise<string>;
  dispatch: React.Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const initialState: { conversations: Map<string, UIConversation>; activeConversationId: string | null } = {
  conversations: new Map(),
  activeConversationId: null,
};

function chatReducer(
  state: typeof initialState,
  action: ChatAction
): typeof initialState {
  switch (action.type) {
    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversationId: action.payload,
      };

    case 'ADD_CONVERSATION': {
      const newConversations = new Map(state.conversations);
      newConversations.set(action.payload._id, action.payload);
      return { ...state, conversations: newConversations };
    }

    case 'UPDATE_CONVERSATION': {
      const newConversations = new Map(state.conversations);
      const existing = newConversations.get(action.payload.id);
      if (existing) {
        newConversations.set(action.payload.id, { ...existing, ...action.payload.updates });
      }
      return { ...state, conversations: newConversations };
    }

    case 'ADD_MESSAGE': {
      const newConversations = new Map(state.conversations);
      const conversation = newConversations.get(action.payload.conversationId);
      if (conversation) {
        conversation.messages.push(action.payload.message);
        conversation.lastMessage = action.payload.message.content;
        conversation.lastMessageTime = action.payload.message.timestamp;
        newConversations.set(action.payload.conversationId, { ...conversation });
      }
      return { ...state, conversations: newConversations };
    }

    case 'MARK_AS_READ': {
      const newConversations = new Map(state.conversations);
      const conversation = newConversations.get(action.payload.conversationId);
      if (conversation) {
        conversation.messages = conversation.messages.map((msg) =>
          action.payload.messageIds.includes(msg._id) ? { ...msg, status: 'read' as const } : msg
        );
        conversation.unreadCount = 0;
        newConversations.set(action.payload.conversationId, { ...conversation });
      }
      return { ...state, conversations: newConversations };
    }

    case 'SET_TYPING': {
      const newConversations = new Map(state.conversations);
      const conversation = newConversations.get(action.payload.conversationId);
      if (conversation) {
        // Track typing status - can be extended to show typing indicator
        newConversations.set(action.payload.conversationId, { ...conversation });
      }
      return { ...state, conversations: newConversations };
    }

    case 'SET_LOADING': {
      const newConversations = new Map(state.conversations);
      const conversation = newConversations.get(action.payload.conversationId);
      if (conversation) {
        newConversations.set(action.payload.conversationId, {
          ...conversation,
          isLoading: action.payload.isLoading,
        });
      }
      return { ...state, conversations: newConversations };
    }

    default:
      return state;
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setActiveConversation = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: id });
  };

  const sendMessage = async (conversationId: string, content: string, attachments?: unknown[]) => {
    // This will be integrated with Socket.io
    const message: Message = {
      _id: Date.now().toString(),
      content,
      sender: 'current-user',
      senderName: 'You',
      timestamp: new Date(),
      attachments,
      status: 'sent',
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message } });
  };

  const loadConversationHistory = async (conversationId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { conversationId, isLoading: true } });
    // This will fetch from API
    setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: { conversationId, isLoading: false } });
    }, 500);
  };

  const markMessagesAsRead = (conversationId: string, messageIds: string[]) => {
    dispatch({ type: 'MARK_AS_READ', payload: { conversationId, messageIds } });
  };

  const setTypingStatus = (conversationId: string, isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: { conversationId, isTyping } });
  };

  const getOrCreateConversation = async (
    participantId: string,
    participantName: string
  ): Promise<string> => {
    // Check if conversation already exists
    let conversationId: string | null = null;
    for (const [id, conv] of state.conversations) {
      if (conv.participantId === participantId) {
        conversationId = id;
        break;
      }
    }

    if (conversationId) {
      return conversationId;
    }

    // Create new conversation
    const newId = `conv-${Date.now()}`;
    const newConversation: UIConversation = {
      _id: newId,
      participantId,
      participantName,
      lastMessage: '',
      lastMessageTime: new Date(),
      messages: [],
      unreadCount: 0,
      isLoading: false,
    };

    dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
    return newId;
  };

  const value: ChatContextValue = {
    conversations: state.conversations,
    activeConversationId: state.activeConversationId,
    setActiveConversation,
    sendMessage,
    loadConversationHistory,
    markMessagesAsRead,
    setTypingStatus,
    getOrCreateConversation,
    dispatch,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
